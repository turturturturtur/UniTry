"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

export function LiveCameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const uploadedImageRef = useRef<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function enableCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("当前浏览器不支持摄像头调用");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "无法打开摄像头，请检查权限"
        );
      } finally {
        setIsLoading(false);
      }
    }

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    if (uploadedImageRef.current) {
      URL.revokeObjectURL(uploadedImageRef.current);
    }
    uploadedImageRef.current = nextUrl;
    setUploadedImage(nextUrl);
  }

  useEffect(() => {
    return () => {
      if (uploadedImageRef.current) {
        URL.revokeObjectURL(uploadedImageRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/60">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {(isLoading || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
            {error ? error : "正在请求摄像头权限"}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <p className="text-xs text-slate-300">
          允许浏览器访问摄像头即可获得实时预览，或上传一张静态图片进行占位展示。
        </p>
        <div className="space-y-2">
          <label
            htmlFor="preview-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/30"
          >
            上传图片
          </label>
          <input
            id="preview-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          {uploadedImage && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img src={uploadedImage} alt="用户上传预览" className="h-48 w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
