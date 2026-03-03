import { FiSearch } from "react-icons/fi";

const recentPosts = [
  {
    id: "1",
    title: "Comment choisir son parfum selon sa personnalité",
    date: "15 mars 2025",
    image: "/images/new-arrivals-1.jpg",
  },
  {
    id: "2",
    title: "Les familles olfactives expliquées",
    date: "8 mars 2025",
    image: "/images/new-arrivals-2.webp",
  },
  {
    id: "3",
    title: "Rituels de parfum pour le printemps",
    date: "1 mars 2025",
    image: "/images/dropdown-4.webp",
  },
];

const archives = ["Mars 2025", "Février 2025", "Janvier 2025"];

const categories = [
  { name: "Parfums féminins", count: 8 },
  { name: "Parfums masculins", count: 6 },
  { name: "Conseils & astuces", count: 12 },
  { name: "Nouvelles marques", count: 4 },
];

const blogPosts = [
  {
    id: "1",
    title: "Comment conserver votre parfum pour qu'il dure plus longtemps",
    excerpt:
      "Découvrez les meilleures pratiques pour préserver la qualité et l'intensité de vos fragrances au fil du temps.",
    tag: "Conseils",
    date: "15 mars 2025",
    comments: 5,
    image: "/images/product-1.jpg",
  },
  {
    id: "2",
    title: "Les notes de tête, de cœur et de fond : comprendre la pyramide olfactive",
    excerpt:
      "Une introduction aux trois phases d'un parfum et comment elles évoluent sur votre peau tout au long de la journée.",
    tag: "Guide",
    date: "12 mars 2025",
    comments: 8,
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "Top 5 des parfums pour l'été 2025",
    excerpt:
      "Notre sélection de fragrances fraîches et légères, parfaites pour les journées ensoleillées.",
    tag: "Sélection",
    date: "8 mars 2025",
    comments: 12,
    image: "/images/blog-top5.png",
  },
  {
    id: "4",
    title: "L'histoire du parfum : des civilisations anciennes à nos jours",
    excerpt:
      "Un voyage à travers les âges pour comprendre comment le parfum a façonné les cultures et les sociétés.",
    tag: "Histoire",
    date: "5 mars 2025",
    comments: 3,
    image: "/images/product-2.jpg",
  },
  {
    id: "5",
    title: "Comment appliquer son parfum pour un sillage optimal",
    excerpt:
      "Les points de pulsation, la quantité idéale et les erreurs à éviter pour une diffusion parfaite.",
    tag: "Conseils",
    date: "1 mars 2025",
    comments: 7,
    image: "/images/product-3.png",
  },
  {
    id: "6",
    title: "Parfums unisexes : la tendance qui séduit",
    excerpt:
      "Pourquoi les fragrances sans genre gagnent en popularité et lesquelles découvrir en priorité.",
    tag: "Tendances",
    date: "28 février 2025",
    comments: 4,
    image: "/images/login.webp",
  },
];

export default function BlogSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-2xl font-bold uppercase tracking-wide text-(--brand-primary)">
        Notre blog
      </h2>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar - 1/4 */}
        <aside className="w-full shrink-0 lg:w-1/4">
          <div className="space-y-8">
            {/* Recent Posts */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                Articles récents
              </h3>
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <a
                      href="#"
                      className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/10"
                    >
                      <img
                        src={post.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-(--brand-primary) line-clamp-2 transition-colors group-hover:text-black">
                          {post.title}
                        </p>
                        <p className="mt-0.5 text-xs text-(--brand-primary)/60 transition-colors group-hover:text-black/80">
                          {post.date}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Archives */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                Archives
              </h3>
              <ul className="space-y-2">
                {archives.map((month) => (
                  <li key={month}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-(--brand-primary)/80 hover:text-(--brand-primary)">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
                      />
                      {month}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                Recherche
              </h3>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-full rounded border border-(--brand-primary)/30 bg-white py-2.5 pl-3 pr-10 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
                />
                <FiSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--brand-primary)/60" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                Catégories
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <label className="flex cursor-pointer items-center justify-between text-sm text-(--brand-primary)/80 hover:text-(--brand-primary)">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
                        />
                        {cat.name}
                      </span>
                      <span className="text-xs text-(--brand-primary)/50">
                        ({cat.count})
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Blog cards - 3/4 */}
        <div className="min-w-0 flex-1 lg:w-3/4">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <a href="#" className="relative block overflow-hidden">
                  <div className="relative aspect-4/3 overflow-hidden bg-black/5">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute right-2 top-2 rounded bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {post.tag}
                    </span>
                  </div>
                </a>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-semibold leading-snug text-(--brand-primary)">
                    <a href="#" className="transition-opacity hover:opacity-80">
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-(--brand-primary)/70">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wider text-(--brand-primary) underline transition-opacity hover:opacity-80"
                  >
                    Lire la suite »
                  </a>
                  <div className="mt-auto flex gap-4 pt-4 text-xs text-(--brand-primary)/60">
                    <span>{post.date}</span>
                    <span>{post.comments} commentaires</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
