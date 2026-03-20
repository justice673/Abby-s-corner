export default function EnglishPerfumeSection() {
  return (
    <section
      id="english-perfumes"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
            English perfumes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-(--brand-primary)/75">
            Modern, fresh and easy-to-wear fragrances inspired by British
            perfumery – made for everyday confidence and casual luxury.
          </p>
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.22em] text-(--brand-primary)/70">
          Citrus · Green · Aquatic · Light florals
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
            For who
          </p>
          <h3 className="text-sm font-semibold text-(--brand-primary)">
            Young professionals & everyday wear
          </h3>
          <p className="text-sm text-(--brand-primary)/75">
            Clean, uplifting scents you can wear to work, brunch or errands
            without feeling too strong.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
            Scent mood
          </p>
          <h3 className="text-sm font-semibold text-(--brand-primary)">
            Fresh & effortless
          </h3>
          <p className="text-sm text-(--brand-primary)/75">
            Sparkling citrus, airy musks and green notes that feel like a crisp
            white shirt and clean skin.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
              Perfect for
            </p>
            <ul className="mt-2 space-y-1 text-sm text-(--brand-primary)/80">
              <li>• Everyday signature perfumes</li>
              <li>• First perfumes and safe gifts</li>
              <li>• Fresh office & weekend scents</li>
            </ul>
          </div>
          <a
            href="/shop?style=english"
            className="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-(--brand-light) px-5 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-primary) transition hover:bg-white"
          >
            Explore English perfumes
          </a>
        </div>
      </div>
    </section>
  );
}

