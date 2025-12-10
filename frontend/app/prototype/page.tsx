import Link from "next/link";
import { LiveCameraPreview } from "@/components/LiveCameraPreview";
import { ClothingRecommendation } from "@/components/ClothingRecommendation";

export default function PrototypePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12 md:py-20">
      <header className="flex flex-col gap-4 text-white">
        <div className="text-xs uppercase tracking-[0.4em] text-white/70">
          UniTry · Prototype
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">实时试穿预览</h1>
        <p className="text-sm text-slate-300 md:text-base">
          允许摄像头权限即可查看 Output Preview，同时在右侧查看占位的 Outfit Recommendation 模块。
        </p>
        <Link
          href="/"
          className="self-start rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:border-white/60"
        >
          返回首页
        </Link>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="glass-panel flex flex-col gap-4 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Output Preview
          </p>
          <LiveCameraPreview />
        </div>
        <ClothingRecommendation />
      </section>
    </main>
  );
}
