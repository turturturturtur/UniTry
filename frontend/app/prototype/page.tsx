"use client";

import Link from "next/link";
import { useState } from "react";
import { OutfitChosen } from "@/components/OutfitChosen";
import { LiveCameraPreview } from "@/components/LiveCameraPreview";
import { ClothingRecommendation } from "@/components/ClothingRecommendation";
import { FinalLook } from "@/components/FinalLook";

export default function PrototypePage() {
  const [gender, setGender] = useState<'man' | 'woman' | null>(null);

  return (
    <main className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-12 px-6 py-12 md:py-20">
      <header className="flex flex-col gap-4 text-white">
        <div className="text-xs uppercase tracking-[0.4em] text-white/70">
          UniTry · Prototype
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">实时试穿预览(Developing)</h1>
        <p className="text-sm text-slate-300 md:text-base">
          上传图片，查看用户选择的服装、推荐搭配以及最终穿着效果。
        </p>
        <Link
          href="/"
          className="self-start rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:border-white/60"
        >
          返回首页
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* 最左侧: 用户选择的衣服 */}
        <OutfitChosen gender={gender} />

        {/* 左侧: 上传的图片预览 */}
        <div className="glass-panel flex flex-col gap-4 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Output Preview
          </p>
          <LiveCameraPreview onGenderDetected={setGender} />
        </div>

        {/* 右侧: 服装推荐 */}
        <ClothingRecommendation gender={gender} />

        {/* 最右侧: 最终效果 */}
        <FinalLook gender={gender} />
      </section>
    </main>
  );
}
