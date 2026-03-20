export default function FragranceBarSection() {
  return (
    <section
      id="fragrance-bar"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--brand-primary)/70">
            Abby&apos;s Corner fragrance bar
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-(--brand-primary) sm:text-3xl">
            Create your own signature scent
          </h2>
          <p className="mt-3 text-sm text-(--brand-primary)/75">
            Mix perfume oils with our team and leave with a bottle labelled in
            your name. From soft everyday blends to bold Arabic-inspired
            creations, the bar is fully personalised.
          </p>

          <div className="mt-5 grid gap-3 text-sm text-(--brand-primary)/80 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-primary)/70">
                How it works
              </h3>
              <ol className="mt-2 space-y-1.5 text-sm">
                <li>1. Smell different fragrance oils.</li>
                <li>2. Choose your families: sweet, fresh, woody, oriental.</li>
                <li>3. Our specialist blends your formula.</li>
                <li>4. Test on skin and adjust.</li>
                <li>5. We bottle & label your scent.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-primary)/70">
                Bottle sizes
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["5ml", "10ml", "20ml", "30ml", "50ml", "100ml"].map((size) => (
                  <span
                    key={size}
                    className="rounded-full bg-(--brand-light) px-3 py-1 text-xs font-semibold text-(--brand-primary)"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-dashed border-black/10 bg-white/80 p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-(--brand-primary)/80">
            In-store experiences
          </h3>
          <ul className="space-y-1.5 text-sm text-(--brand-primary)/80">
            <li>• &quot;Create your own perfume&quot; sessions for couples & groups</li>
            <li>• Gift boxes for birthdays and special occasions</li>
            <li>• Signature Scent Card so you can reorder your blend</li>
            <li>• Mini perfume education sessions at the bar</li>
            <li>• Refill discounts for returning customers</li>
            <li>• VIP perfume membership for loyal clients</li>
          </ul>
          <a
            href="/contact"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-(--brand-primary) px-6 text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-light) transition hover:bg-black"
          >
            Book a fragrance bar session
          </a>
        </div>
      </div>
    </section>
  );
}

