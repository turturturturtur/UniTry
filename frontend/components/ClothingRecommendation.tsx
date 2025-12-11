'use client';

import { useState } from 'react';
import React from 'react';

// 图片映射配置：上传哪个 look → 展示哪些图片
const lookImageMaps: Record<string, { 帽子: string[]; 上衣: string[]; 下装: string[] }> = {
  'look1-first': {
    帽子: ['/images/outfits_man/hat1.jpg', '/images/outfits_man/look1-top.png'],
    上衣: ['/images/outfits_man/cloth1.jpg', '/images/outfits_man/look1-first.png'],
    下装: ['/images/outfits_man/pants1.jpg', '/images/outfits_man/look1-all.jpg']
  },
  'look2-first': {
    帽子: ['/images/outfits_woman/hat2.jpg', '/images/outfits_woman/look2-all.jpg'],
    上衣: ['/images/outfits_woman/cloth2.jpg', '/images/outfits_woman/look2-first.jpg'],
    下装: ['/images/outfits_woman/sp2.jpg', '/images/outfits_woman/look2-all.jpg']
  }
};

export function ClothingRecommendation() {
  const [currentLook, setCurrentLook] = useState<'look1-first' | 'look2-first'>('look1-first');
  const [uploadedLook, setUploadedLook] = useState<'look1-first' | 'look2-first' | null>(null);

  const categories = ['帽子', '上衣', '下装'] as const;
  const currentImages = lookImageMaps[currentLook];

  const [modalImage, setModalImage] = useState<string | null>(null);
  const openModal = (url: string) => setModalImage(url);
  const closeModal = () => setModalImage(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 监听左侧上传 input 的文件名（不修改摄像头组件），根据文件名决定显示哪个 look
  // 规则：文件名中包含 "look1-first" 或 "look2-first"（不区分大小写）
  // 只有当上传了匹配的文件时，右侧才会显示对应图片
  React.useEffect(() => {
    const input = document.getElementById('preview-upload') as HTMLInputElement | null;
    if (!input) return;

    const inputEl = input;
    function updateFromInput() {
      const file = inputEl.files?.[0];
      if (!file) {
        setUploadedLook(null);
        return;
      }
      const name = file.name.toLowerCase();
      if (name.includes('look1-first')) {
        setUploadedLook('look1-first');
        setCurrentLook('look1-first');
      } else if (name.includes('look2-first')) {
        setUploadedLook('look2-first');
        setCurrentLook('look2-first');
      } else {
        setUploadedLook(null);
      }
    }

    // initial check
    updateFromInput();
    input.addEventListener('change', updateFromInput);
    return () => input.removeEventListener('change', updateFromInput);
  }, []);

  return (
    <div className="glass-panel flex flex-col gap-4 p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
        Outfit Recommendation
      </p>
      <h2 className="text-2xl font-semibold text-white">智能服饰推荐</h2>
      {/* 说明文本已隐藏 — 使用上传触发展示 */}

      {/* 分类展示图片：仅在左侧上传匹配 look 后显示 */}
      {uploadedLook === currentLook ? (
        <div className="mt-6 space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">
                {category}
              </div>
              <div className="flex gap-3 flex-wrap items-center">
                {currentImages[category].map((imagePath, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border border-white/20 shadow-md transition-transform hover:scale-105 cursor-zoom-in"
                    style={{
                      width: '140px',
                      height: '180px'
                    }}
                  >
                    <img
                      src={imagePath}
                      alt={`${category} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                      onDoubleClick={() => openModal(imagePath)}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <div className="max-h-56 overflow-y-auto pr-2">
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category}
                  className="min-h-[6rem] rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center"
                >
                  <div className="text-xs text-white/60 uppercase tracking-[0.2em]">
                    {category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 z-60 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="关闭预览"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="原图预览"
              className="max-w-full max-h-[80vh] rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Modal helper: we'll append modal markup via component state in the same file
