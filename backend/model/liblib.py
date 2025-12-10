from pathlib import Path
from argparse import ArgumentParser
import requests
import hmac
from hashlib import sha1
import base64
import time
import uuid
import os
from urllib3.exceptions import RequestError
from dotenv import load_dotenv
load_dotenv()

import logging
logger = logging.getLogger("LiblibAI")
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(levelname)s - %(name)s] %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

ACCESS_KEY = os.environ["ACCESS_KEY"]
SECRET_KEY = os.environ["SECRET_KEY"]
MAX_WAIT_TIME = 20
CUSTOM_MODELS = [
    {
        "versionUuid":"7f7caafb5ce543fc878cf104518a24d2"  # 测试用的模型UUID(真实存在)
    }
]


def make_sign(secret_key:str,uri:str):
    """
    生成签名
    """
    # 当前毫秒时间戳
    timestamp = str(int(time.time() * 1000))
    # 随机字符串
    signature_nonce= str(uuid.uuid4())
    # 拼接请求数据
    content = '&'.join((uri, timestamp, signature_nonce))
    
    # 生成签名
    digest = hmac.new(secret_key.encode(), content.encode(), sha1).digest()
    # 移除为了补全base64位数而填充的尾部等号
    sign = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()
    return sign,timestamp,signature_nonce

request_example = {
    "templateUuid":"5d7e67009b344550bc1aa6ccbfa1d7f4",
    "generateParams":{
        "prompt":"1 girl,lotus leaf,masterpiece,best quality,finely detail,highres,8k,beautiful and aesthetic,no watermark,",
        "aspectRatio":"portrait",
        "imageSize": {
            "width": 768,
            "height": 1024
        },
        "imgCount":1,
        "steps": 30,
        # "controlnet":{
            # "controlType":"depth",
            # "controlImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
        # }        
    }
}

class LiblibAI:
    def __init__(self) -> None:
        self.base = "https://openapi.liblibai.cloud"
    
    def _get_url_with_key(self,uri:str) -> None:
        sign,timestamp,signature_nonce = make_sign(SECRET_KEY,uri)
        key = f"?AccessKey={ACCESS_KEY}&Signature={sign}&Timestamp={timestamp}&SignatureNonce={signature_nonce}"
        return self.base + uri + key
    
    def _check_model(self, versionUuid):
        """查询模型版本信息

        Args:
            versionUuid: 模型版本UUID，从LibLib官网模型详情页URL中获取

        Returns:
            包含模型信息的响应对象
        """
        uri = "/api/model/version/get"
        url = self._get_url_with_key(uri)
        request = {"versionUuid": versionUuid}

        logger.debug(f"Checking model version: {versionUuid}")
        response = requests.post(url=url, json=request)

        # 检查响应
        resp_data = response.json()
        if resp_data.get('code') != 0:
            logger.error(f"Failed to check model: {resp_data}")
            logger.error(f"请确保:")
            logger.error(f"1. versionUuid正确(从LibLib官网模型详情页URL复制)")
            logger.error(f"2. 模型是Checkpoint或LoRA类型")
            logger.error(f"3. 模型可商用(或是你的私有模型)")
        else:
            logger.info(f"Model found: {resp_data.get('data', {}).get('model_name', 'Unknown')}")

        return response

    def _get_upload_signature(self, filename: str, extension: str):
        """获取文件上传签名

        Args:
            filename: 文件名，不能为空且长度<=100
            extension: 扩展名，仅支持jpg、png、jpeg

        Returns:
            包含上传所需签名信息的字典
        """
        if len(filename) > 100:
            raise ValueError("文件名长度不能超过100")

        if extension.lower() not in ['jpg', 'png', 'jpeg']:
            raise ValueError("扩展名仅支持jpg、png、jpeg")

        url = self._get_url_with_key("/api/generate/upload/signature")
        request = {
            "name": filename,
            "extension": extension
        }

        logger.debug(f"Getting upload signature for: {filename}.{extension}")
        response = requests.post(url=url, json=request)
        assert response.json()['code'] == 0, f"Error when getting upload signature, response: {response.json()}"

        return response.json()['data']

    def _upload_local_file(self, file_path: str):
        """上传本地文件到LibLib OSS

        Args:
            file_path: 本地文件路径

        Returns:
            上传后的图片URL
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"文件不存在: {file_path}")

        # 检查文件大小(不超过10M)
        file_size = os.path.getsize(file_path)
        if file_size > 10 * 1024 * 1024:
            raise ValueError("图片大小不能超过10M")

        # 获取文件名和扩展名
        path_obj = Path(file_path)
        filename = path_obj.stem
        extension = path_obj.suffix.lstrip('.')

        # 获取上传签名
        signature_data = self._get_upload_signature(filename, extension)

        # 准备上传表单数据(注意顺序,file必须在最后)
        data = {
            'key': signature_data['key'],
            'policy': signature_data['policy'],
            'x-oss-date': signature_data['xOssDate'],
            'x-oss-expires': signature_data['xOssExpires'],
            'x-oss-signature': signature_data['xOssSignature'],
            'x-oss-credential': signature_data['xOssCredential'],
            'x-oss-signature-version': signature_data['xOssSignatureVersion'],
        }

        # 上传文件
        post_url = signature_data['postUrl']
        logger.debug(f"Uploading file to: {post_url}")

        # 确定正确的content-type
        if extension.lower() in ['jpg', 'jpeg']:
            content_type = 'image/jpeg'
        elif extension.lower() == 'png':
            content_type = 'image/png'
        else:
            content_type = f'image/{extension}'

        # 使用with语句确保文件正确关闭
        with open(file_path, 'rb') as f:
            files = {'file': (f'{filename}.{extension}', f, content_type)}
            response = requests.post(post_url, data=data, files=files)

        if response.status_code != 204:
            raise RequestError(f"文件上传失败, status code: {response.status_code}, response: {response.text}")

        # 构造图片URL
        image_url = f"{post_url}/{signature_data['key']}"
        logger.info(f"File uploaded successfully: {image_url}")

        return image_url

    def check(self,uuid:str):
        url = self._get_url_with_key("/api/generate/webui/status")
        response = requests.post(url=url,json={"generateUuid":uuid})
        assert response.json()['code'] == 0, f"Error when generating image, response: {response.json()}" 
        return response
    
    def download_image(self,response,save_path="image_text2image.png"):
        if 'images' not in response.json()['data']:
            response = self.check(response.json()['data']['generateUuid'])
            logger.debug(f"Check generation: {response.json()}")
        image_urls = [image['imageUrl'] for image in response.json()['data']['images']]
        logger.debug(f"Generated image urls: {image_urls}")
        images = [requests.get(url) for url in image_urls]
        n_image = len(images)
        if n_image > 1:
            for i,image in enumerate(images):
                path = Path(save_path)
                _save = path.parent / f"{path.stem}_{i}.{path.suffix}" 
                with open(_save,"wb") as f:
                    f.write(image.content)
                logger.info(f"Images saved to {_save}")
        else:
            with open(save_path,"wb") as f:
                f.write(images[0].content)
            logger.info(f"Image saved to {save_path}")

    def image2image(self, prompt: str, sourceImage: str, is_wait=True, imgCount: int = 1, controlnet: dict = None):
        """图生图便捷接口

        Args:
            prompt: 正向提示词，纯英文文本，不超过2000字符
            sourceImage: 参考图URL或本地文件路径
                        - 如果是URL(以http://或https://开头)，直接使用
                        - 如果是本地路径，自动上传后使用
            is_wait: 是否等待生成完成
            imgCount: 单次生图张数，范围1~4
            controlnet: 可选，构图控制参数，包含controlType和controlImage
                       controlType可选值: line(线稿轮廓), depth(空间关系), pose(人物姿态), IPAdapter(风格迁移)
                       如果controlImage是本地路径，也会自动上传
        """
        # 检查sourceImage是否为本地路径，如果是则上传
        if not sourceImage.startswith(('http://', 'https://')):
            logger.info(f"Detected local file path, uploading: {sourceImage}")
            sourceImage = self._upload_local_file(sourceImage)

        # 如果controlnet中的controlImage也是本地路径，同样需要上传
        if controlnet and 'controlImage' in controlnet:
            if not controlnet['controlImage'].startswith(('http://', 'https://')):
                logger.info(f"Detected local controlImage path, uploading: {controlnet['controlImage']}")
                controlnet['controlImage'] = self._upload_local_file(controlnet['controlImage'])

        request = {
            "templateUuid": "07e00af4fc464c7ab55ff906f8acf1b7",
            "generateParams": {
                "prompt": prompt,
                "sourceImage": sourceImage,
                "imgCount": imgCount,
            }
        }

        # 添加可选的controlnet参数
        if controlnet:
            request["generateParams"]["controlnet"] = controlnet

        logger.debug(f"Generate image from image: {sourceImage}, prompt: {prompt}")
        url = self._get_url_with_key("/api/generate/webui/img2img/ultra")
        response = requests.post(url=url, json=request)
        assert response.json()['code'] == 0, f"Error when requesting api service, response: {response.json()}"
        logger.info(f"Generation starts: {response.json()}")

        try:
            if is_wait:
                logger.info("Waiting for image generation ...")
                start = time.time()
                while time.time() - start < MAX_WAIT_TIME:
                    result = self.check(response.json()['data']['generateUuid'])
                    status = result.json()['data']['generateStatus']
                    if status == 5:
                        logger.info(f"Generation Success: {result.json()}")
                        return result
                    elif status > 5:
                        raise RequestError(f"Error when generating image, response: {result.json()}")
                    time.sleep(1)
                logger.warning(f"Exceed max wait time, requesting response: {response.json()}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            logger.error(f"response: {response.json()}")
            raise

        return response

    def text2image(self,prompt:str,is_wait=True,width:int=768,height:int=1024,imgCount:int=1,steps:int=30,aspectRatio:str="portrait"):
        """文生图便捷接口"""
        request = {
        "templateUuid":"5d7e67009b344550bc1aa6ccbfa1d7f4",
        "generateParams":{
            "prompt":prompt,
            "aspectRatio": aspectRatio,
            "imageSize": {
                "width": width,
                "height": height 
            },
            "imgCount":imgCount,
            "steps": steps,
            }
        }
        logger.debug(f"Generate image on text: {prompt}")
        url = self._get_url_with_key("/api/generate/webui/text2img/ultra")
        response = requests.post(url=url,json=request)
        assert response.json()['code'] == 0 ,f"Error when requesting api service, response: {response.json()}"
        logger.debug(f"API:RequestGeneration: {response.json()}")

        try:
            if is_wait:
                logger.info("Waiting for image generation ...")
                start = time.time()
                ind = 0
                while time.time()-start < MAX_WAIT_TIME:
                    result = self.check(response.json()['data']['generateUuid'])
                    status = result.json()['data']['generateStatus']
                    if status == 5:
                        logger.info(f"Generation Success: {result.json()}")
                        return result
                    elif status > 5:
                        raise RequestError(f"Error when generating image, response: {result.json()}")
                logger.warning(f"Exceed max wait time, requesting response: {response.json()}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            logger.error(f"response: {response.json()}")
            raise
        
        return response

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("-m","--mode",type=str,default="text")
    model = LiblibAI()
    args = parser.parse_args()
    mode = args.mode
    logger.info("Testing LiblibAI api")
    logger.info(f"Mode: {mode}")
    if mode == "text":
        response = model.text2image("A woman model,masterpiece,realistic,wearing clothes of uniqlo 'peace for all' series",is_wait=True)
        model.download_image(response,"assets/test_text2image.png")
    elif mode == "image":
        response = model.image2image("Change the girl to a boy.","https://liblibai-tmp-image.liblib.cloud/img/3e547ddc3eb64f878cb9f5e5efae3746/8c0e26a32c142da30f56ffaee6134e06480b359ebda929af3e1703e537dbce0f.png",is_wait=True)
        model.download_image(response,"assets/test_image2image.png")
    elif mode == "check":
        response = model._check_model(CUSTOM_MODELS[0]['versionUuid'])
    elif mode == "download":
        response = model.check("9cab5df41d8e4145b70f7881283465c2")
        model.download_image(response)