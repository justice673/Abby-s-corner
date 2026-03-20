export default function ArabicPerfumeSection() {
  return (
    <section
      id="arabic-perfumes"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
            Arabic perfumes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-(--brand-primary)/75">
            Bold, long-lasting oriental fragrances with presence – built around
            oud, amber, saffron and rich florals.
          </p>
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.22em] text-(--brand-primary)/70">
          Oud · Amber · Rose · Musk · Incense
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black text-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            For who
          </p>
          <h3 className="text-sm font-semibold">
            Lovers of strong, lasting scent
          </h3>
          <p className="text-sm text-white/80">
            Fragrances that project, leave a trail and stay on the skin and
            clothes for hours.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black text-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Scent mood
          </p>
          <h3 className="text-sm font-semibold">Opulent & addictive</h3>
          <p className="text-sm text-white/80">
            Layers of oud, amber, spices and roses for evenings, occasions and
            anyone who wants to be remembered.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-black text-white p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Perfect for
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/85">
              <li>• Events, parties & night outs</li>
              <li>• Customers who love intense perfume</li>
              <li>• Layering and signature Arabic blends</li>
            </ul>
          </div>
          <a
            href="/shop?style=arabic"
            className="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-white/40 bg-white/5 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
          >
            Explore Arabic perfumes
          </a>
        </div>
      </div>
    </section>
  );
}

