"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { withBasePath } from "@/lib/basePath";
import { LabelTag } from "./LabelTag";

interface OutfitData {
  [key: string]: { label: string; content: string; };
}

interface OutfitChosenProps {
  gender: 'man' | 'woman' | null;
}

// 选择的衣服图片映射
const chosenOutfitData = {
  man: {
    image: "/assets/outfits_man/chosen_cloth1.jpg",
    label: "男装选择",
  },
  woman: {
    image: "/assets/outfits_woman/chosen_cloth2.jpg",
    label: "女装选择",
  },
};

export function OutfitChosen({ gender }: OutfitChosenProps) {
  const [showModal, setShowModal] = useState(false);
  const [outfitLabels, setOutfitLabels] = useState<OutfitData>({});
  const outfit = gender ? chosenOutfitData[gender] : null;

  useEffect(() => {
    const loadLabelData = async () => {
      if (gender) {
        try {
          // 由于 Next.js 的文件结构，我们需要使用 fetch 来获取 JSON 文件
          const response = await fetch(
            withBasePath(`/assets/outfits_${gender}/label.json`)
          );
          if (response.ok) {
            const labelData = await response.json();
            setOutfitLabels(labelData);
          }
        } catch (error) {
          console.error("Failed to load label data:", error);
        }
      }
    };

    loadLabelData();
  }, [gender]);

  return (
    <>
      <div className="glass-panel flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Outfit Chosen
          </p>
          {outfit && (() => {
            // 获取文件名来匹配label.json
            const fileName = outfit.image.split('/').pop();
            const labelData = fileName ? outfitLabels[fileName] : null;
            return labelData ? (
              <LabelTag
                label={labelData.label}
                content={labelData.content}
              />
            ) : null;
          })()}
        </div>
        <h2 className="text-2xl font-semibold text-white">用户选择</h2>
        <p className="text-sm text-slate-300">
          {gender
            ? "您选择的服装单品。点击图片可放大查看。"
            : "等待上传图片以显示对应的服装选择。"}
        </p>
        <div className="mt-4">
          {outfit ? (
            <div
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition hover:border-white/30 hover:bg-white/10"
              onClick={() => setShowModal(true)}
            >
              <Image
                src={withBasePath(outfit.image)}
                alt={outfit.label}
                width={400}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="min-h-[16rem] rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center">
              <p className="text-xs text-white/40">暂无选择</p>
            </div>
          )}
        </div>
      </div>

      {/* 模态框 - 放大显示 */}
      {showModal && outfit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {outfit.label}
              </p>
            </div>
            <div className="relative">
              <Image
                src={withBasePath(outfit.image)}
                alt={outfit.label}
                width={800}
                height={800}
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
