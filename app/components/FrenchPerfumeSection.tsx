export default function FrenchPerfumeSection() {
  return (
    <section
      id="french-perfumes"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
            French perfumes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-(--brand-primary)/75">
            Elegant, balanced and sophisticated scents inspired by French perfume
            houses – perfect for the office, special moments and timeless style.
          </p>
        </div>
        <div className="text-xs font-medium uppercase tracking-[0.22em] text-(--brand-primary)/70">
          Floral · Powdery · Musks · Vanilla · Woods
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
            For who
          </p>
          <h3 className="text-sm font-semibold text-(--brand-primary)">
            Office & day-to-night elegance
          </h3>
          <p className="text-sm text-(--brand-primary)/75">
            Soft florals, powdery musks and discreet vanilla that feel polished
            from morning meetings to late dinners.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
            Scent mood
          </p>
          <h3 className="text-sm font-semibold text-(--brand-primary)">
            Refined & romantic
          </h3>
          <p className="text-sm text-(--brand-primary)/75">
            Bouquets of rose, iris and jasmine wrapped in clean musks and
            creamy woods for a signature French finish.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--brand-primary)/70">
              Perfect for
            </p>
            <ul className="mt-2 space-y-1 text-sm text-(--brand-primary)/80">
              <li>• Work days & business meetings</li>
              <li>• Date nights and dinners</li>
              <li>• Gift ideas for classic perfume lovers</li>
            </ul>
          </div>
          <a
            href="/shop?style=french"
            className="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-(--brand-light) px-5 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-primary) transition hover:bg-white"
          >
            Explore French perfumes
          </a>
        </div>
      </div>
    </section>
  );
}

