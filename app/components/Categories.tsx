import Link from "next/link";

export type HomeCategory = {
  label: string;
  href: string;
  area: string;
  image: string;
};

function CategoryCard({ cat }: { cat: HomeCategory }) {
  return (
    <Link
      href={cat.href}
      className="group relative flex items-end overflow-hidden p-4"
      style={{ gridArea: cat.area }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${cat.image})` }}
      />
      <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      <span className="relative z-10 text-sm font-semibold text-white drop-shadow-md sm:text-base md:text-lg">
        {cat.label}
      </span>
    </Link>
  );
}

const categories: HomeCategory[] = [
  {
    label: "Women's perfumes",
    href: "#parfums-femmes",
    area: "a",
    image: "/images/category-1.jpg",
  },
  {
    label: "Men's perfumes",
    href: "#parfums-hommes",
    area: "b",
    image: "/images/category-2.png",
  },
  {
    label: "Home & wellness",
    href: "#maison-bien-etre",
    area: "c",
    image: "/images/category-3.png",
  },
  {
    label: "Gift sets",
    href: "#coffrets",
    area: "d",
    image: "/images/category-4.jpg",
  },
  {
    label: "New brands",
    href: "#nouvelles-marques",
    area: "e",
    image: "/images/category-5.webp",
  },
  {
    label: "Exclusive offers",
    href: "#offres-exclusives",
    area: "f",
    image: "/images/category-6.jpg",
  },
];

export default function CategoriesSection() {
  if (!categories.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
        Categories
      </h2>

      {/* Desktop grid */}
      <div
        className="hidden gap-3 sm:grid"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "260px 180px 180px",
          gridTemplateAreas: `
            "a b f"
            "a c d"
            "e c d"
          `,
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.area + cat.href} cat={cat} />
        ))}
      </div>

      {/* Mobile grid */}
      <div
        className="grid gap-3 sm:hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "200px 140px 140px 140px",
          gridTemplateAreas: `
            "a a"
            "b f"
            "c d"
            "e e"
          `,
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.area + cat.href} cat={cat} />
        ))}
      </div>
    </section>
  );
}

