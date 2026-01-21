"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { LabelTag } from "./LabelTag";
import { withBasePath } from "@/lib/basePath";

interface ClothingRecommendationProps {
  gender: 'man' | 'woman' | null;
}

interface LabelData {
  [key: string]: { label: string; content: string; };
}

// 服装数据映射
const outfitData = {
  man: {
    categories: [
      { label: "帽子", image: withBasePath("/assets/outfits_man/hat1.jpg") },
      { label: "上衣", image: withBasePath("/assets/outfits_man/cloth1.jpg") },
      { label: "裤子", image: withBasePath("/assets/outfits_man/pants1.jpg") },
    ],
  },
  woman: {
    categories: [
      { label: "帽子", image: withBasePath("/assets/outfits_woman/hat2.jpg") },
      { label: "上衣", image: withBasePath("/assets/outfits_woman/cloth2.jpg") },
      { label: "下装", image: withBasePath("/assets/outfits_woman/sp2.jpg") },
    ],
  },
};

export function ClothingRecommendation({ gender }: ClothingRecommendationProps) {
  const [outfitLabels, setOutfitLabels] = useState<LabelData>({});
  const categories = gender ? outfitData[gender].categories : [];
  const [selectedImage, setSelectedImage] = useState<{ src: string; label: string } | null>(null);

  useEffect(() => {
    const loadLabelData = async () => {
      if (gender) {
        try {
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
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">
          Outfit Recommendation
        </p>
        <h2 className="text-2xl font-semibold text-white">智能服饰推荐</h2>

        <div className="mt-4 space-y-4">
          {gender ? (
            categories.map((category) => {
              // 获取文件名来匹配label.json
              const fileName = category.image.split('/').pop();
              const labelData = fileName ? outfitLabels[fileName] : null;

              return (
                <div key={category.label} className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {category.label}
                  </div>
                  <div className="relative flex">
                    <div
                      className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition hover:border-white/30 hover:bg-white/10"
                      onClick={() => setSelectedImage({ src: category.image, label: category.label })}
                    >
                      <Image
                        src={category.image}
                        alt={category.label}
                        width={400}
                        height={200}
                        className="h-32 w-full object-contain"
                      />
                    </div>
                    {labelData && (
                      <div className="absolute right-2 top-2">
                        <LabelTag
                          label={labelData.label}
                          content={labelData.content}
                          orientation="horizontal"
                          className="text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            ["帽子", "上衣", "裤子"].map((category) => (
              <div key={category} className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {category}
                </div>
                <div className="min-h-[6rem] rounded-2xl border border-dashed border-white/20 bg-white/5" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 模态框 - 放大显示图片 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {selectedImage.label}
              </p>
            </div>
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.label}
                width={800}
                height={800}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <button
              className="mt-4 w-full rounded-full bg-white/20 px-6 py-2 text-sm text-white transition hover:bg-white/30"
              onClick={() => setSelectedImage(null)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  );
}
