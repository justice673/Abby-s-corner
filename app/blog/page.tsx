"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { FiSearch } from "react-icons/fi";

const recentPosts = [
  {
    id: "1",
    slug: "how-to-choose-perfume-based-on-personality",
    title: "How to choose your perfume based on your personality",
    date: "March 15, 2025",
    image: "/images/new-arrivals-1.jpg",
  },
  {
    id: "2",
    slug: "olfactory-families-explained",
    title: "Olfactory families explained",
    date: "March 8, 2025",
    image: "/images/new-arrivals-2.webp",
  },
  {
    id: "3",
    slug: "perfume-rituals-for-spring",
    title: "Perfume rituals for spring",
    date: "March 1, 2025",
    image: "/images/dropdown-4.webp",
  },
];

const archives = ["March 2025", "February 2025", "January 2025"];

const categories = [
  { name: "Women's perfumes", count: 8 },
  { name: "Men's perfumes", count: 6 },
  { name: "Tips & tricks", count: 12 },
  { name: "New brands", count: 4 },
];

const blogPosts = [
  {
    id: "1",
    slug: "how-to-store-perfume-last-longer",
    title: "How to store your perfume so it lasts longer",
    excerpt:
      "Discover the best practices to preserve the quality and intensity of your fragrances over time.",
    tag: "Tips",
    date: "March 15, 2025",
    comments: 5,
    image: "/images/product-1.jpg",
  },
  {
    id: "2",
    slug: "understanding-olfactory-pyramid",
    title: "Top, heart and base notes: understanding the olfactory pyramid",
    excerpt:
      "An introduction to the three phases of a perfume and how they evolve on your skin throughout the day.",
    tag: "Guide",
    date: "March 12, 2025",
    comments: 8,
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    slug: "top-5-perfumes-summer-2025",
    title: "Top 5 perfumes for summer 2025",
    excerpt:
      "Our selection of fresh, light fragrances, perfect for sunny days.",
    tag: "Selection",
    date: "March 8, 2025",
    comments: 12,
    image: "/images/blog-top5.png",
  },
  {
    id: "4",
    slug: "history-of-perfume",
    title: "The history of perfume: from ancient civilizations to today",
    excerpt:
      "A journey through the ages to understand how perfume has shaped cultures and societies.",
    tag: "History",
    date: "March 5, 2025",
    comments: 3,
    image: "/images/product-2.jpg",
  },
  {
    id: "5",
    slug: "how-to-apply-perfume-optimal-sillage",
    title: "How to apply perfume for optimal sillage",
    excerpt:
      "Pulse points, the ideal amount and mistakes to avoid for perfect diffusion.",
    tag: "Tips",
    date: "March 1, 2025",
    comments: 7,
    image: "/images/product-3.png",
  },
  {
    id: "6",
    slug: "unisex-perfumes-trend",
    title: "Unisex perfumes: the trend that's winning over",
    excerpt:
      "Why gender-neutral fragrances are gaining popularity and which ones to discover first.",
    tag: "Trends",
    date: "February 28, 2025",
    comments: 4,
    image: "/images/login.webp",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main>
        {/* Hero Banner */}
        <div className="bg-(--brand-primary) py-16 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Our Blog
          </h1>
          <p className="mx-auto mt-3 max-w-xl px-4 text-sm text-white/70">
            Tips, guides, and stories from the world of perfumery
          </p>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar - 1/4 */}
            <aside className="w-full shrink-0 lg:w-1/4">
              <div className="sticky top-32 space-y-8">
                {/* Recent Posts */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                    Recent posts
                  </h3>
                  <ul className="space-y-3">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/blog/${post.slug}`}
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
                        </Link>
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
                    Search
                  </h3>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded border border-(--brand-primary)/30 bg-white py-2.5 pl-3 pr-10 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
                    />
                    <FiSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--brand-primary)/60" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                    Categories
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
                    <Link
                      href={`/blog/${post.slug}`}
                      className="relative block overflow-hidden"
                    >
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
                    </Link>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-base font-semibold leading-snug text-(--brand-primary)">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-opacity hover:opacity-80"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-(--brand-primary)/70">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wider text-(--brand-primary) underline transition-opacity hover:opacity-80"
                      >
                        Read more »
                      </Link>
                      <div className="mt-auto flex gap-4 pt-4 text-xs text-(--brand-primary)/60">
                        <span>{post.date}</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
