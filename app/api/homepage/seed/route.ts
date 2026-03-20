import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import HomeSection from "@/lib/db/models/HomeSection";

const heroData = {
  title: "Elevate your style with",
  highlight: "signature fragrances",
  subtitle:
    "Discover intimate, long-lasting perfumes, created in small batches. From luminous florals to deep ambers, build a wardrobe of scents that linger long after you've passed.",
  ctaLabel: "View collection",
  ctaLink: "#collections",
  secondaryCtaLabel: "Discover our story",
  secondaryCtaLink: "#about",
  videoIntro: "/videos/IMG_7673.MOV",
  videoMain: "/videos/IMG_7729.MOV",
};

const categoriesData = [
  {
    label: "French perfumes",
    href: "#french-perfumes",
    area: "a",
    image: "/images/category-1.jpg",
    subtitle:
      "Elegant, balanced and sophisticated scents inspired by French perfume houses – perfect for the office, special moments and timeless style.",
    highlightLine: "Floral · Powdery · Musks · Vanilla · Woods",
    bullets: [
      "Work days & business meetings",
      "Date nights and dinners",
      "Gift ideas for classic perfume lovers",
    ],
    ctaLabel: "Explore French perfumes",
  },
  {
    label: "English perfumes",
    href: "#english-perfumes",
    area: "b",
    image: "/images/category-2.png",
    subtitle:
      "Modern, fresh and easy-to-wear fragrances inspired by British perfumery – made for everyday confidence and casual luxury.",
    highlightLine: "Citrus · Green · Aquatic · Light florals",
    bullets: [
      "Everyday signature perfumes",
      "First perfumes and safe gifts",
      "Fresh office & weekend scents",
    ],
    ctaLabel: "Explore English perfumes",
  },
  {
    label: "Arabic perfumes",
    href: "#arabic-perfumes",
    area: "c",
    image: "/images/category-3.png",
    subtitle:
      "Bold, long-lasting oriental fragrances with presence – built around oud, amber, saffron and rich florals.",
    highlightLine: "Oud · Amber · Rose · Musk · Incense",
    bullets: [
      "Events, parties & night outs",
      "Customers who love intense perfume",
      "Layering and signature Arabic blends",
    ],
    ctaLabel: "Explore Arabic perfumes",
  },
  {
    label: "Home & wellness",
    href: "#maison-bien-etre",
    area: "d",
    image: "/images/category-4.jpg",
  },
  {
    label: "Gift sets",
    area: "e",
    href: "#coffrets",
    image: "/images/category-5.webp",
  },
  {
    label: "Exclusive offers & new brands",
    href: "#offres-exclusives",
    area: "f",
    image: "/images/category-6.jpg",
  },
];

const frenchPerfumeData = {
  id: "french",
  title: "French perfumes",
  description:
    "Elegant, balanced and sophisticated scents inspired by French perfume houses – perfect for the office, special moments and timeless style.",
  tagline: "Floral · Powdery · Musks · Vanilla · Woods",
  cards: [
    {
      label: "For who",
      title: "Office & day-to-night elegance",
      content:
        "Soft florals, powdery musks and discreet vanilla that feel polished from morning meetings to late dinners.",
    },
    {
      label: "Scent mood",
      title: "Refined & romantic",
      content:
        "Bouquets of rose, iris and jasmine wrapped in clean musks and creamy woods for a signature French finish.",
    },
    {
      label: "Perfect for",
      title: "",
      content: "",
      items: [
        "Work days & business meetings",
        "Date nights and dinners",
        "Gift ideas for classic perfume lovers",
      ],
    },
  ],
  ctaLabel: "Explore French perfumes",
  ctaLink: "/shop?style=french",
};

const englishPerfumeData = {
  id: "english",
  title: "English perfumes",
  description:
    "Modern, fresh and easy-to-wear fragrances inspired by British perfumery – made for everyday confidence and casual luxury.",
  tagline: "Citrus · Green · Aquatic · Light florals",
  cards: [
    {
      label: "For who",
      title: "Everyday freshness",
      content:
        "Clean citrus, green notes and light florals that feel effortless from morning jogs to weekend brunches.",
    },
    {
      label: "Scent mood",
      title: "Modern & confident",
      content:
        "Bright bergamot, crisp greens and sheer musks for a contemporary British sensibility.",
    },
    {
      label: "Perfect for",
      title: "",
      content: "",
      items: [
        "Everyday signature perfumes",
        "First perfumes and safe gifts",
        "Fresh office & weekend scents",
      ],
    },
  ],
  ctaLabel: "Explore English perfumes",
  ctaLink: "/shop?style=english",
};

const arabicPerfumeData = {
  id: "arabic",
  title: "Arabic perfumes",
  description:
    "Bold, long-lasting oriental fragrances with presence – built around oud, amber, saffron and rich florals.",
  tagline: "Oud · Amber · Rose · Musk · Incense",
  cards: [
    {
      label: "For who",
      title: "Statement presence",
      content:
        "Deep oud, rich amber and opulent rose for those who want their fragrance to announce their arrival.",
    },
    {
      label: "Scent mood",
      title: "Luxurious & bold",
      content:
        "Warm saffron, smoky incense and velvety musks that evolve beautifully throughout the day.",
    },
    {
      label: "Perfect for",
      title: "",
      content: "",
      items: [
        "Events, parties & night outs",
        "Customers who love intense perfume",
        "Layering and signature Arabic blends",
      ],
    },
  ],
  ctaLabel: "Explore Arabic perfumes",
  ctaLink: "/shop?style=arabic",
};

const newArrivalsData = [
  {
    name: "Eau de parfum — Signature",
    description: "Floral amber",
    price: "From 29,520 FCFA",
    image: "/images/new-arrivals-1.jpg",
  },
  {
    name: "Eau de parfum — Lumière",
    description: "Fresh notes",
    price: "From 27,552 FCFA",
    image: "/images/new-arrivals-2.webp",
  },
  {
    name: "Eau de parfum — Abby's",
    description: "Wood and musk",
    price: "From 31,488 FCFA",
    image: "/images/product-1.jpg",
  },
  {
    name: "Scented candle — Garden",
    description: "White flowers",
    price: "18,368 FCFA",
    image: "/images/product-2.jpg",
  },
  {
    name: "Hair mist — Softness",
    description: "Subtle trail",
    price: "14,432 FCFA",
    image: "/images/product-3.png",
  },
  {
    name: "Discovery set",
    description: "3 miniatures",
    price: "22,960 FCFA",
    image: "/images/product-4.jpg",
  },
];

const blogPostsData = [
  {
    slug: "how-to-store-perfume-last-longer",
    title: "How to store your perfume so it lasts longer",
    excerpt:
      "Discover the best practices to preserve the quality and intensity of your fragrances over time.",
    tag: "Tips",
    date: "March 15, 2025",
    image: "/images/product-1.jpg",
    comments: 5,
  },
  {
    slug: "understanding-olfactory-pyramid",
    title: "Top, heart and base notes: understanding the olfactory pyramid",
    excerpt:
      "An introduction to the three phases of a perfume and how they evolve on your skin throughout the day.",
    tag: "Guide",
    date: "March 12, 2025",
    image: "/images/new-arrivals-2.webp",
    comments: 8,
  },
  {
    slug: "top-5-perfumes-summer-2025",
    title: "Top 5 perfumes for summer 2025",
    excerpt:
      "Our selection of fresh, light fragrances, perfect for sunny days.",
    tag: "Selection",
    date: "March 8, 2025",
    image: "/images/blog-top5.png",
    comments: 12,
  },
  {
    slug: "history-of-perfume",
    title: "The history of perfume: from ancient civilizations to today",
    excerpt:
      "A journey through the ages to understand how perfume has shaped cultures and societies.",
    tag: "History",
    date: "March 5, 2025",
    image: "/images/product-2.jpg",
    comments: 3,
  },
  {
    slug: "how-to-apply-perfume-optimal-sillage",
    title: "How to apply perfume for optimal sillage",
    excerpt:
      "Pulse points, the ideal amount and mistakes to avoid for perfect diffusion.",
    tag: "Tips",
    date: "March 1, 2025",
    image: "/images/product-3.png",
    comments: 7,
  },
  {
    slug: "unisex-perfumes-trend",
    title: "Unisex perfumes: the trend that's winning over",
    excerpt:
      "Why gender-neutral fragrances are gaining popularity and which ones to discover first.",
    tag: "Trends",
    date: "February 28, 2025",
    image: "/images/login.webp",
    comments: 4,
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Check if homepage sections already exist
    const existingCount = await HomeSection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          message: "Homepage sections already seeded",
          count: existingCount,
        },
        { status: 200 }
      );
    }

    // Seed all sections
    const sections = [
      {
        sectionType: "hero",
        title: "Hero",
        isActive: true,
        order: 0,
        data: heroData,
      },
      {
        sectionType: "categories",
        title: "Categories",
        isActive: true,
        order: 1,
        data: categoriesData,
      },
      {
        sectionType: "perfume_style",
        title: "French Perfumes",
        isActive: true,
        order: 2,
        data: frenchPerfumeData,
      },
      {
        sectionType: "perfume_style",
        title: "English Perfumes",
        isActive: true,
        order: 3,
        data: englishPerfumeData,
      },
      {
        sectionType: "perfume_style",
        title: "Arabic Perfumes",
        isActive: true,
        order: 4,
        data: arabicPerfumeData,
      },
      {
        sectionType: "new_arrivals",
        title: "New Arrivals",
        subtitle: "The latest items added to our collection",
        isActive: true,
        order: 5,
        data: newArrivalsData,
      },
      {
        sectionType: "blog",
        title: "Our Blog",
        isActive: true,
        order: 6,
        data: blogPostsData,
      },
    ];

    await HomeSection.insertMany(sections);

    return NextResponse.json({
      message: "Homepage sections seeded successfully",
      count: sections.length,
    });
  } catch (error) {
    console.error("Error seeding homepage:", error);
    return NextResponse.json(
      { error: "Failed to seed homepage sections" },
      { status: 500 }
    );
  }
}
