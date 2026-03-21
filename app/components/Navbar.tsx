"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiChevronDown,
  FiSearch,
  FiArrowLeft,
  FiLogOut,
} from "react-icons/fi";
import { SearchBar } from "./SearchBar";
import { useFavorites } from "@/hooks/use-favorites";

const topBarLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavCategory {
  _id: string;
  name: string;
  slug: string;
}

interface DropdownItem {
  id: string;
  label: string;
  description: string;
  image: string;
  buttonText: string;
  link?: string;
}

/** CMS "All brands" row (seed id `toutes-marques`) overrides /api/brands synthetic row (`all-brands`). */
function findCmsAllBrandsItem(
  items: Array<{ id: string; label?: string }> | undefined,
) {
  if (!items?.length) return undefined;
  return items.find(
    (i) =>
      i.id === "all-brands" ||
      i.id === "toutes-marques" ||
      (typeof i.label === "string" && i.label.toLowerCase().trim() === "all brands"),
  ) as DropdownItem | undefined;
}

function mergeBrandsWithCms(
  apiItems: DropdownItem[],
  cmsMarquesItems: DropdownItem[] | undefined,
): DropdownItem[] {
  const cmsAll = findCmsAllBrandsItem(cmsMarquesItems);
  if (!cmsAll) return apiItems;

  return apiItems.map((item) => {
    if (item.id !== "all-brands") return item;
    return {
      ...item,
      image: cmsAll.image || item.image,
      description: cmsAll.description ?? item.description,
      buttonText: cmsAll.buttonText ?? item.buttonText,
      link: cmsAll.link || item.link,
      label: cmsAll.label || item.label,
    };
  });
}

export default function Navbar() {
  const { openCart, totalItems } = useCart();
  const { data: session } = useSession();
  const { likedIds } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<"marques" | "maison" | null>(
    null,
  );
  const [marquesItems, setMarquesItems] = useState<DropdownItem[]>([]);
  const [maisonItems, setMaisonItems] = useState<DropdownItem[]>([]);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [hoveredMarquesId, setHoveredMarquesId] = useState<string | null>(null);
  const [hoveredMaisonId, setHoveredMaisonId] = useState<string | null>(null);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [brandsRes, marquesNavRes, maisonRes, catRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/nav-dropdown?key=marques"),
          fetch("/api/nav-dropdown?key=maison"),
          fetch("/api/categories/nav"),
        ]);

        // Brands: product-driven list + CMS overlay for "All brands" image/copy (Navigation → Brands)
        if (brandsRes.ok) {
          const data = await brandsRes.json();
          let items: DropdownItem[] = data.items || [];

          if (marquesNavRes.ok) {
            const navData = await marquesNavRes.json();
            const dropdowns = navData.dropdowns || [];
            const marques = dropdowns.find(
              (d: { menuKey: string }) => d.menuKey === "marques",
            );
            items = mergeBrandsWithCms(items, marques?.items);
          }

          setMarquesItems(items);
          setHoveredMarquesId(items[0]?.id || null);
        }

        if (maisonRes.ok) {
          const data = await maisonRes.json();
          const dropdowns = data.dropdowns || [];
          const maison = dropdowns.find(
            (d: { menuKey: string }) => d.menuKey === "maison",
          );
          if (maison?.items) {
            setMaisonItems(maison.items);
            setHoveredMaisonId(maison.items[0]?.id || null);
          }
        }

        if (catRes.ok) {
          const data = await catRes.json();
          setNavCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch nav data:", error);
      }
    };

    fetchNavData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-black/5 bg-(--brand-light)/80 backdrop-blur-md">
      <nav className="relative mx-auto max-w-6xl overflow-x-hidden px-4 py-2 md:px-6 lg:px-8 md:overflow-x-visible">
        {/* Top bar: logo + Shop / About / Contact + icons */}
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Logo - hides on mobile when scrolled or search overlay is open */}
          <a
            href="/"
            className={`flex items-center gap-3 transition-opacity md:opacity-100 ${
              isScrolled || showSearchOverlay
                ? "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100"
                : "opacity-100"
            }`}
          >
            <div className="relative h-9 w-38 sm:h-10 sm:w-40">
              <Image
                src="/images/logo.png"
                alt="Abby's Corner logo"
                fill
                className="object-contain text-(--brand-primary)"
                priority
              />
            </div>
          </a>

          {/* Desktop links + search */}
          <div className="hidden flex-1 items-center justify-center gap-6 sm:flex">
            <ul className="flex items-center gap-5 text-sm font-medium text-(--brand-primary)/80">
              {topBarLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-(--brand-primary)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SearchBar
              variant="desktop"
              className="hidden max-w-xs flex-1 sm:block"
            />
          </div>

          {/* Right icons + mobile search behaviors */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search icon (mobile, when at top) */}
            {!isScrolled && (
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setShowSearchOverlay(true)}
                className="rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white md:hidden"
              >
                <FiSearch className="h-4 w-4" />
              </button>
            )}

            <Link
              href="/likes"
              aria-label="Favorites"
              className="relative rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
            >
              <FiHeart className="h-4 w-4" />
              {likedIds.size > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--brand-primary) text-[10px] font-bold text-(--brand-light)">
                  {likedIds.size > 9 ? "9+" : likedIds.size}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Cart"
              onClick={openCart}
              className="relative rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
            >
              <FiShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--brand-primary) text-[10px] font-bold text-(--brand-light)">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            {session?.user ? (
              <div ref={userMenuRef} className="relative z-[100]">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="My account"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-primary) text-xs font-semibold text-white transition hover:bg-(--brand-primary)/90"
                >
                  {getInitials(session.user.name || "")}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full z-[100] mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10">
                    <div className="border-b border-black/5 px-4 py-2">
                      <p className="text-sm font-medium text-(--brand-primary)">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-(--brand-primary)/60 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-(--brand-primary)/80 hover:bg-black/5 hover:text-(--brand-primary)"
                    >
                      <FiUser className="h-4 w-4" />
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                aria-label="My account"
                className="rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
              >
                <FiUser className="h-4 w-4" />
              </Link>
            )}
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setIsOpen((open) => !open)}
              className="ml-1 inline-flex items-center justify-center rounded-full border border-(--brand-primary)/15 bg-white/80 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white md:hidden"
            >
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile inline search bar shown when scrolled (separate full-width row) */}
        {isScrolled && !showSearchOverlay && (
          <div className="mt-2 flex w-full justify-center md:hidden">
            <SearchBar variant="mobile" className="w-[88%] max-w-md" />
          </div>
        )}

        {/* Mobile full-width search overlay (like Shein) */}
        {showSearchOverlay && (
          <div className="absolute inset-x-0 top-0 z-40 block bg-(--brand-light) px-4 pb-3 pt-2 shadow-md md:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setShowSearchOverlay(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-(--brand-primary)"
              >
                <FiArrowLeft className="h-4 w-4" />
              </button>
              <SearchBar
                variant="overlay"
                onClose={() => setShowSearchOverlay(false)}
                autoFocus
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Bottom bar: main navigation links (scrollable on small screens only) */}
        <div className="mt-1 border-t border-black/5 pt-2">
          <ul className="flex items-center gap-6 overflow-x-auto overflow-y-hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] text-(--brand-primary)/80 md:flex-wrap md:justify-center md:overflow-x-visible md:whitespace-normal">
            {/* Brands dropdown */}
            {marquesItems.length > 0 && (
              <li
                className="group relative"
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setOpenMegaMenu("marques");
                  }
                }}
                onMouseLeave={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setOpenMegaMenu(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenMegaMenu(openMegaMenu === "marques" ? null : "marques");
                  }}
                  className="relative flex items-center gap-1 pb-1 transition-colors hover:text-(--brand-primary)"
                >
                  <span>Brands</span>
                  <FiChevronDown className={`h-3 w-3 transition-transform ${openMegaMenu === "marques" ? "rotate-180" : ""}`} />
                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center bg-(--brand-primary) transition-transform duration-200 ${
                      openMegaMenu === "marques" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              </li>
            )}

            {/* Category links from database */}
            {navCategories.map((cat) => (
              <li key={cat._id} className="group relative">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="relative pb-1 transition-colors hover:text-(--brand-primary)"
                >
                  <span>{cat.name}</span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-(--brand-primary) transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}

            {/* Home & wellness dropdown */}
            {maisonItems.length > 0 && (
              <li
                className="group relative"
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setOpenMegaMenu("maison");
                  }
                }}
                onMouseLeave={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setOpenMegaMenu(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenMegaMenu(openMegaMenu === "maison" ? null : "maison");
                  }}
                  className="relative flex items-center gap-1 pb-1 transition-colors hover:text-(--brand-primary)"
                >
                  <span>Home & wellness</span>
                  <FiChevronDown className={`h-3 w-3 transition-transform ${openMegaMenu === "maison" ? "rotate-180" : ""}`} />
                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center bg-(--brand-primary) transition-transform duration-200 ${
                      openMegaMenu === "maison" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile bottom bar (collapsible) */}
        {isOpen && (
          <div className="mt-1 border-t border-black/5 pt-2 md:hidden">
            <ul className="flex flex-col gap-2 pb-2 text-sm font-medium text-(--brand-primary)/90">
              {topBarLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 transition-colors hover:text-(--brand-primary)"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {marquesItems.length > 0 && (
                <li>
                  <button
                    onClick={() => setOpenMegaMenu(openMegaMenu === "marques" ? null : "marques")}
                    className="block py-1.5 transition-colors hover:text-(--brand-primary)"
                  >
                    Brands
                  </button>
                </li>
              )}
              {navCategories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="block py-1.5 transition-colors hover:text-(--brand-primary)"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              {maisonItems.length > 0 && (
                <li>
                  <button
                    onClick={() => setOpenMegaMenu(openMegaMenu === "maison" ? null : "maison")}
                    className="block py-1.5 transition-colors hover:text-(--brand-primary)"
                  >
                    Home & wellness
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>

    {/* Mobile Mega Menu Overlay - Brands (outside header for proper z-index) */}
    {openMegaMenu === "marques" && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setOpenMegaMenu(null)}
            />
            {/* Mobile dropdown */}
            <div className="fixed inset-x-0 top-[120px] z-60 mx-4 max-h-[60vh] overflow-y-auto rounded-xl bg-white p-4 shadow-2xl md:hidden">
              <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Brands
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenMegaMenu(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-(--brand-primary)"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {marquesItems.map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    onClick={() => setOpenMegaMenu(null)}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/5"
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-(--brand-primary)">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-(--brand-primary)/60 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* Desktop dropdown */}
            <div
              className="fixed left-1/2 z-60 hidden w-[min(60rem,92vw)] -translate-x-1/2 md:block"
              style={{ top: "4.5rem" }}
              onMouseEnter={() => setOpenMegaMenu("marques")}
              onMouseLeave={() => setOpenMegaMenu(null)}
            >
              <div className="pt-4">
                <div className="max-h-[70vh] min-h-[280px] overflow-y-auto bg-white/95 py-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
                  <div className="flex h-full divide-x divide-black/5">
                    {/* Left column: list */}
                    <div className="w-[40%] p-4">
                      <div className="space-y-1">
                        {marquesItems.map((item) => {
                          const isActive = hoveredMarquesId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setHoveredMarquesId(item.id)}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-left transition-colors ${
                                isActive
                                  ? "bg-(--brand-light) text-(--brand-primary)"
                                  : "text-(--brand-primary)/80 hover:bg-(--brand-light)/70 hover:text-(--brand-primary)"
                              }`}
                            >
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  {/* Right column: preview card */}
                  <div className="w-[60%] p-6">
                    {(() => {
                      const current =
                        marquesItems.find((i) => i.id === hoveredMarquesId) ??
                        marquesItems[0];
                      return (
                        <div className="flex min-h-[200px] flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-black/5">
                            <img
                              src={current.image}
                              alt={current.label}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <div>
                              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
                                {current.label}
                              </h3>
                              <p className="mt-2 text-sm leading-relaxed text-(--brand-primary)/80">
                                {current.description}
                              </p>
                            </div>
                            <div className="mt-auto flex justify-end">
                              <button
                                type="button"
                                className="group inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-light) transition hover:bg-black/80"
                              >
                                <span>{current.buttonText}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Mega Menu Overlay - Home & Wellness */}
        {openMegaMenu === "maison" && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setOpenMegaMenu(null)}
            />
            {/* Mobile dropdown */}
            <div className="fixed inset-x-0 top-[120px] z-60 mx-4 max-h-[60vh] overflow-y-auto rounded-xl bg-white p-4 shadow-2xl md:hidden">
              <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Home & wellness
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenMegaMenu(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-(--brand-primary)"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {maisonItems.map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    onClick={() => setOpenMegaMenu(null)}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/5"
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-(--brand-primary)">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-(--brand-primary)/60 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* Desktop dropdown */}
            <div
              className="fixed left-1/2 z-60 hidden w-[min(60rem,92vw)] -translate-x-1/2 md:block"
              style={{ top: "4.5rem" }}
              onMouseEnter={() => setOpenMegaMenu("maison")}
              onMouseLeave={() => setOpenMegaMenu(null)}
            >
              <div className="pt-4">
                <div className="max-h-[70vh] min-h-[280px] overflow-y-auto bg-white/95 py-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
                  <div className="flex h-full divide-x divide-black/5">
                    {/* Left column: list */}
                    <div className="w-[40%] p-4">
                      <div className="space-y-1">
                        {maisonItems.map((item) => {
                          const isActive = hoveredMaisonId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setHoveredMaisonId(item.id)}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-left transition-colors ${
                                isActive
                                  ? "bg-(--brand-light) text-(--brand-primary)"
                                  : "text-(--brand-primary)/80 hover:bg-(--brand-light)/70 hover:text-(--brand-primary)"
                              }`}
                            >
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right column: preview card */}
                    <div className="w-[60%] p-6">
                      {(() => {
                        const current =
                          maisonItems.find((i) => i.id === hoveredMaisonId) ??
                          maisonItems[0];
                        return (
                          <div className="flex min-h-[200px] flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-black/5">
                              <img
                                src={current.image}
                                alt={current.label}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex flex-1 flex-col gap-3">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
                                  {current.label}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-(--brand-primary)/80">
                                  {current.description}
                                </p>
                              </div>
                              <div className="mt-auto flex justify-end">
                                <button
                                  type="button"
                                  className="group inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-light) transition hover:bg-black/80"
                                >
                                  <span>{current.buttonText}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
}

