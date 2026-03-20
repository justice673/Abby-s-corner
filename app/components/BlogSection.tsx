"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  image: string;
  comments?: number;
}

const archives = ["March 2025", "February 2025", "January 2025"];

const categories = [
  { name: "Women's perfumes", count: 8 },
  { name: "Men's perfumes", count: 6 },
  { name: "Tips & tricks", count: 12 },
  { name: "New brands", count: 4 },
];

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const recentPosts = blogPosts.slice(0, 3);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Fetch from actual BlogPost table (published posts)
        const res = await fetch("/api/homepage/blog?limit=6");
        if (res.ok) {
          const data = await res.json();
          if (data.posts) {
            setBlogPosts(data.posts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-black/10" />
        </div>
        <div className="flex gap-8">
          <div className="hidden w-1/4 space-y-4 lg:block">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-black/10" />
            ))}
          </div>
          <div className="flex-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-4/3 rounded bg-black/10" />
                <div className="mt-4 h-4 w-3/4 rounded bg-black/10" />
                <div className="mt-2 h-3 w-full rounded bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogPosts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-(--brand-primary)">
          Our blog
        </h2>
        <Link
          href="/blog"
          className="text-sm font-semibold uppercase tracking-wider text-(--brand-primary) underline transition-opacity hover:opacity-70"
        >
          View all articles →
        </Link>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar - 1/4 */}
        <aside className="w-full shrink-0 lg:w-1/4">
          <div className="space-y-8">
            {/* Recent Posts */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                Recent posts
              </h3>
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
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
                key={post.slug}
                className="flex flex-col overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Link href={`/blog/${post.slug}`} className="relative block overflow-hidden">
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
                    <Link href={`/blog/${post.slug}`} className="transition-opacity hover:opacity-80">
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
                    <span>{post.comments || 0} comments</span>
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
