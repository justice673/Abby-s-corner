import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/lib/db/models/BlogPost";

const SAMPLE_POSTS = [
  {
    title: "How to store your perfume so it lasts longer",
    slug: "how-to-store-perfume-last-longer",
    excerpt: "Discover the best practices to preserve the quality and intensity of your fragrances over time.",
    content: `<p>Perfume is a delicate product that requires proper storage to maintain its quality. Here are the essential tips:</p>
<h2>Keep Away from Light</h2>
<p>UV rays can break down the molecules in your perfume, altering its scent. Store in a dark place or keep in the original box.</p>
<h2>Maintain Cool Temperature</h2>
<p>Heat accelerates the degradation process. Avoid storing near windows or in bathrooms.</p>
<h2>Don't Shake the Bottle</h2>
<p>Contrary to popular belief, shaking can introduce air and damage the fragrance molecules.</p>`,
    coverImage: "/images/product-1.jpg",
    category: "Tips & Tricks",
    tags: ["storage", "perfume care", "tips"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-03-15"),
  },
  {
    title: "Top, heart and base notes: understanding the olfactory pyramid",
    slug: "understanding-olfactory-pyramid",
    excerpt: "An introduction to the three phases of a perfume and how they evolve on your skin throughout the day.",
    content: `<p>Every perfume tells a story in three acts, known as the olfactory pyramid.</p>
<h2>Top Notes (5-15 minutes)</h2>
<p>The first impression - typically light, fresh scents like citrus or herbs.</p>
<h2>Heart Notes (15 minutes - 3 hours)</h2>
<p>The core of the fragrance - often floral or spicy notes that define the perfume's character.</p>
<h2>Base Notes (3+ hours)</h2>
<p>The foundation - rich, deep notes like wood, musk, or vanilla that linger longest.</p>`,
    coverImage: "/images/product-2.jpg",
    category: "Guide",
    tags: ["education", "fragrance notes", "guide"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-03-12"),
  },
  {
    title: "Top 5 perfumes for summer 2025",
    slug: "top-5-perfumes-summer-2025",
    excerpt: "Our selection of fresh, light fragrances, perfect for sunny days.",
    content: `<p>Summer calls for lighter, fresher fragrances. Here are our top picks:</p>
<ol>
<li><strong>Acqua di Gio</strong> - A timeless aquatic fresh scent</li>
<li><strong>Light Blue</strong> - Mediterranean vibes in a bottle</li>
<li><strong>Jo Malone Wood Sage & Sea Salt</strong> - Coastal elegance</li>
<li><strong>Chanel Chance Eau Fraîche</strong> - Sparkling and energetic</li>
<li><strong>Versace Pour Homme</strong> - Classic masculine freshness</li>
</ol>`,
    coverImage: "/images/product-3.png",
    category: "Selection",
    tags: ["summer", "recommendations", "top picks"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-03-08"),
  },
  {
    title: "The history of perfume: from ancient civilizations to today",
    slug: "history-of-perfume",
    excerpt: "A journey through the ages to understand how perfume has shaped cultures and societies.",
    content: `<p>Perfume has been with humanity for thousands of years.</p>
<h2>Ancient Egypt</h2>
<p>Egyptians used fragrant oils in religious ceremonies and daily life.</p>
<h2>The Persian Innovation</h2>
<p>Persians developed distillation techniques that revolutionized perfumery.</p>
<h2>European Renaissance</h2>
<p>France emerged as the perfume capital of the world.</p>
<h2>Modern Era</h2>
<p>Synthetic molecules expanded the perfumer's palette infinitely.</p>`,
    coverImage: "/images/product-4.jpg",
    category: "History",
    tags: ["history", "culture", "education"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-03-05"),
  },
  {
    title: "How to apply perfume for optimal sillage",
    slug: "how-to-apply-perfume-sillage",
    excerpt: "Pulse points, the ideal amount and mistakes to avoid for perfect diffusion.",
    content: `<p>The way you apply perfume greatly affects how it performs.</p>
<h2>Pulse Points</h2>
<p>Apply to wrists, neck, behind ears, and inner elbows where blood vessels are close to the skin.</p>
<h2>Don't Rub</h2>
<p>Rubbing your wrists together breaks down the molecules and alters the scent.</p>
<h2>Distance Matters</h2>
<p>Spray from 15-20cm away for even distribution.</p>
<h2>Less is More</h2>
<p>2-3 sprays are usually sufficient for most occasions.</p>`,
    coverImage: "/images/product-5.webp",
    category: "Tips & Tricks",
    tags: ["application", "tips", "sillage"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-03-01"),
  },
  {
    title: "Unisex perfumes: the trend that's winning over everyone",
    slug: "unisex-perfumes-trend",
    excerpt: "Why gender-neutral fragrances are becoming the new standard in modern perfumery.",
    content: `<p>The boundaries between masculine and feminine fragrances are blurring.</p>
<h2>Breaking Traditions</h2>
<p>Modern perfumery is moving away from gendered marketing.</p>
<h2>Popular Unisex Scents</h2>
<p>Le Labo Santal 33, Byredo Gypsy Water, and Jo Malone collections lead the way.</p>
<h2>The Appeal</h2>
<p>Unisex fragrances focus on quality ingredients and unique compositions rather than demographic targeting.</p>`,
    coverImage: "/images/product-6.png",
    category: "Trends",
    tags: ["unisex", "trends", "modern perfumery"],
    author: "Abby",
    status: "published",
    publishedAt: new Date("2025-02-25"),
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Check if posts already exist
    const existingCount = await BlogPost.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: "Blog posts already exist",
        count: existingCount,
        skipped: true,
      });
    }

    // Insert sample posts
    await BlogPost.insertMany(SAMPLE_POSTS);

    return NextResponse.json({
      message: "Blog posts seeded successfully",
      count: SAMPLE_POSTS.length,
    });
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    return NextResponse.json(
      { error: "Failed to seed blog posts" },
      { status: 500 }
    );
  }
}
