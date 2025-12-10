import Link from "next/link";

const featureCards = [
  {
    title: "多模态换装",
    description: "结合商品图、人体姿态与用户提示，生成更贴合的穿搭效果。",
  },
  {
    title: "多端部署",
    description: "Next.js + FastAPI 设计，未来可封装为 Android / Web / 桌面客户端。",
  },
  {
    title: "工作流可扩展",
    description: "可串联素材筛选、批量生成、A/B 测试等环节，满足商业化需求。",
  },
];

const roadmap = [
  {
    title: "Step 1 · 素材上传",
    description:
      "上传模特照与服装单品，系统自动校验角度、清晰度与人体关键点。",
  },
  {
    title: "Step 2 · Diffusion 推理",
    description: "调用 Python 服务加载定制 diffusion checkpoint，完成智能换装。",
  },
  {
    title: "Step 3 · 审核与分发",
    description: "通过前端审核管控后推送至商城、社媒或移动 App。",
  },
];

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel p-6 transition hover:-translate-y-1 hover:border-brand hover:bg-white/10">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  );
}

function RoadmapCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <div className="glass-panel relative p-5">
      <div className="absolute inset-y-4 left-4 w-px bg-white/10" aria-hidden />
      <div className="ml-6">
        <span className="text-xs uppercase tracking-[0.3em] text-brand">
          {index.toString().padStart(2, "0")}
        </span>
        <h4 className="mt-3 text-xl font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-12 md:gap-24 md:py-20">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-brand/30 to-cyan-500/20 p-8 text-center md:gap-6">
        <div className="text-xs uppercase tracking-[0.4em] text-white/70">
          UniTry · 智能换衣
        </div>
        <h1 className="text-balance text-3xl font-semibold leading-tight text-white md:text-5xl">
          让 AI 为用户打造下一套穿搭
        </h1>
        <p className="text-balance text-base text-slate-200 md:text-lg">
          前端使用 Next.js + Tailwind CSS，后端使用 FastAPI，保留 diffusion
          推理接口的扩展位，实现从上传到生成的完整链路。
        </p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link
            href="/prototype"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            体验原型
          </Link>
          <Link
            href="#roadmap"
            className="rounded-full border border-white/30 px-6 py-3 text-sm text-white transition hover:border-white/60"
          >
            查看路线
          </Link>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </section>

      <section id="roadmap" className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Product Roadmap
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            面向未来的 diffusion 工作流
          </h2>
          <p className="text-sm text-slate-300">
            后端可插拔，兼容 Python 模型微服务及 GPU 推理集群；前端通过轻量
            UI 提供清晰的使用路径。
          </p>
        </div>
        <div className="space-y-4">
          {roadmap.map((item, index) => (
            <RoadmapCard key={item.title} {...item} index={index + 1} />
          ))}
        </div>
      </section>
    </main>
  );
}
