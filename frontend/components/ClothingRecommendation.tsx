export function ClothingRecommendation() {
  const categories = ["帽子", "上衣", "裤子"];

  return (
    <div className="glass-panel flex flex-col gap-4 p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
        Outfit Recommendation
      </p>
      <h2 className="text-2xl font-semibold text-white">智能服饰推荐</h2>
      <p className="text-sm text-slate-300">
        结合后续的用户偏好与库存数据，动态生成搭配建议。目前为占位模块。
      </p>
      <div className="mt-4 space-y-4">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">
              {category}
            </div>
            <div className="min-h-[6rem] rounded-2xl border border-dashed border-white/20 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
