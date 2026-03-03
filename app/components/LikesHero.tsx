const HERO_IMAGE = "/images/like.png";

export default function LikesHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[320px] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--brand-light)/80">
          Sillage Parfumerie
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-wide text-white sm:text-4xl md:text-5xl font-heading">
          Mes favoris
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-(--brand-light)/90 sm:text-base">
          Vos coups de cœur et parfums sauvegardés
        </p>
      </div>
    </section>
  );
}
