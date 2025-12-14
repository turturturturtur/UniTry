"use client";

import Image from "next/image";
import { useState } from "react";

interface FinalLookProps {
  gender: 'man' | 'woman' | null;
}

// 最终效果图映射
const finalLookData = {
  man: {
    image: "/assets/outfits_man/look1-all.jpg",
    label: "男装效果",
  },
  woman: {
    image: "/assets/outfits_woman/look2-all.jpg",
    label: "女装效果",
  },
};

export function FinalLook({ gender }: FinalLookProps) {
  const [showModal, setShowModal] = useState(false);
  const finalLook = gender ? finalLookData[gender] : null;

  return (
    <>
      <div className="glass-panel flex flex-col gap-4 p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">
          Final Look
        </p>
        <h2 className="text-2xl font-semibold text-white">最终效果</h2>
        <p className="text-sm text-slate-300">
          {gender
            ? "穿着推荐服装的最终效果。点击图片可放大查看。"
            : "等待上传图片以显示最终效果。"}
        </p>
        <div className="mt-4">
          {finalLook ? (
            <div
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition hover:border-white/30 hover:bg-white/10"
              onClick={() => setShowModal(true)}
            >
              <Image
                src={finalLook.image}
                alt={finalLook.label}
                width={400}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="min-h-[16rem] rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center">
              <p className="text-xs text-white/40">暂无效果图</p>
            </div>
          )}
        </div>
      </div>

      {/* 模态框 - 放大显示 */}
      {showModal && finalLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {finalLook.label}
              </p>
            </div>
            <div className="relative">
              <Image
                src={finalLook.image}
                alt={finalLook.label}
                width={800}
                height={1200}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <button
              className="mt-4 w-full rounded-full bg-white/20 px-6 py-2 text-sm text-white transition hover:bg-white/30"
              onClick={() => setShowModal(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  );
}
