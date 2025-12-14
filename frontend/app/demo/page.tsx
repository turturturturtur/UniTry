"use client";

import Link from "next/link";
import { useState } from "react";
import { OutfitChosen } from "@/components/OutfitChosen";
import { ClothingRecommendation } from "@/components/ClothingRecommendation";
import { FinalLook } from "@/components/FinalLook";

export default function DemoPage() {
  const [gender, setGender] = useState<'man' | 'woman'>('man');

  return (
    <main className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-12 px-6 py-12 md:py-20">
      <header className="flex flex-col gap-4 text-white">
        {/* 左上角性别选择 */}
        <div className="flex items-center gap-4">
          <div className="text-xs uppercase tracking-[0.4em] text-white/70">
            UniTry · 样例展示
          </div>
          <div className="flex gap-2 rounded-full border border-white/30 p-1">
            <button
              onClick={() => setGender('man')}
              className={`rounded-full px-4 py-1 text-sm transition ${
                gender === 'man'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              男
            </button>
            <button
              onClick={() => setGender('woman')}
              className={`rounded-full px-4 py-1 text-sm transition ${
                gender === 'woman'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              女
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">样例展示</h1>
        <p className="text-sm text-slate-300 md:text-base">
          查看预设的服装搭配样例效果。
        </p>
        <Link
          href="/"
          className="self-start rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:border-white/60"
        >
          返回首页
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 最左侧: 用户选择的衣服 */}
        <OutfitChosen gender={gender} />

        {/* 中间: 服装推荐 */}
        <ClothingRecommendation gender={gender} />

        {/* 最右侧: 最终效果 */}
        <FinalLook gender={gender} />
      </section>
    </main>
  );
}
