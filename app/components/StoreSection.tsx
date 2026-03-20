import Image from "next/image";

const HERO_IMAGE = "/images/store-hero.jpg";

const stores = [
  {
    id: "1",
    name: "Abby's Corner",
    address: "Douala, Cameroon",
    phone: "+237 670-123-456",
    href: "#",
    image: "/images/store-1.jpeg",
  },
  // {
  //   id: "2",
  //   name: "Sillage Mandela",
  //   address: "12, Av Nelson Mandela, en face Hôpital Principal",
  //   phone: "338425555 - 781300404",
  //   href: "#",
  //   image: "/images/store-2.webp",
  // },
  // {
  //   id: "3",
  //   name: "La gondole",
  //   address: "Sea Plaza, 1st floor on the left",
  //   phone: "338646363 - 770991292",
  //   href: "#",
  //   image: "/images/store-3.webp",
  // },
];

export default function StoreSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center px-4 py-20 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12">
        {/* Hero title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-wide text-white drop-shadow-md sm:text-4xl md:text-5xl font-heading">
            Visit Abby&apos;s Corner
          </h2>
          <p className="mt-4 text-sm font-medium tracking-[0.2em] text-white/90 sm:text-base">
            A boutique with French, English, Arabic perfumes & a fragrance bar
          </p>
        </div>

        {/* Store cards inside hero */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.href}
              className="group overflow-hidden bg-white/95 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-black/5">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="text-base font-semibold text-(--brand-primary)">
                  {store.name}
                </h4>
                <p className="mt-2 text-sm text-(--brand-primary)/80">
                  {store.address}
                </p>
                <p className="mt-1 text-sm font-medium text-(--brand-primary)">
                  {store.phone}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Layout explanation */}
        <div className="relative mt-8 grid gap-6 rounded-2xl bg-black/45 p-6 text-sm text-white sm:grid-cols-2 sm:gap-8">
          <div>
            <h3 className="text-base font-semibold uppercase tracking-[0.2em]">
              How the store is organised
            </h3>
            <ul className="mt-3 space-y-1.5">
              <li>• Entrance: best sellers and discovery table</li>
              <li>• Left side: French perfumes – luxury & designer inspiration</li>
              <li>• Right side: English perfumes – fresh everyday scents</li>
              <li>• Center display: Arabic perfumes – bold & long-lasting</li>
              <li>• Back area: Abby&apos;s Corner Fragrance Bar, our custom mixing station</li>
              <li>• Checkout: impulse mini perfumes and refills near the exit</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-[0.2em]">
              Experiences in store
            </h3>
            <ul className="mt-3 space-y-1.5">
              <li>• Create your own perfume sessions (solo, couples, groups)</li>
              <li>• Gift boxes for birthdays and special occasions</li>
              <li>• Signature Scent Card to reorder your custom blend</li>
              <li>• Short perfume education mini-sessions</li>
              <li>• Refill discounts and VIP perfume membership for loyal clients</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
