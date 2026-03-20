"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { FiSearch, FiCalendar, FiUser, FiClock, FiTag, FiChevronLeft, FiMessageCircle } from "react-icons/fi";

const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  date: string;
  author: string;
  readTime: string;
  comments: number;
  image: string;
}> = {
  "how-to-store-perfume-last-longer": {
    title: "How to store your perfume so it lasts longer",
    excerpt: "Discover the best practices to preserve the quality and intensity of your fragrances over time.",
    content: `
      <p>Perfume is a delicate product that requires proper care to maintain its quality and longevity. Many people don't realize that how they store their fragrances can significantly impact how long they last and how they smell over time.</p>
      
      <h2>Keep it away from light</h2>
      <p>Light, especially sunlight, is one of the biggest enemies of perfume. UV rays can break down the molecules in your fragrance, causing it to degrade faster and potentially change its scent profile. Always store your perfumes in a dark place, such as a drawer, closet, or cabinet.</p>
      
      <h2>Maintain a consistent temperature</h2>
      <p>Temperature fluctuations can cause the chemical compounds in perfume to break down. Avoid storing your fragrances in bathrooms where temperature and humidity levels change frequently. Instead, choose a cool, dry place with a stable temperature, ideally between 15-20°C (59-68°F).</p>
      
      <h2>Keep the original bottle sealed</h2>
      <p>Oxygen exposure can oxidize the perfume and alter its composition. Always keep your perfume bottles tightly closed when not in use, and avoid transferring perfume to other containers unless absolutely necessary.</p>
      
      <h2>Avoid humidity</h2>
      <p>High humidity can damage both the fragrance and its packaging. The bathroom might seem like a convenient place to store perfume, but the steam from showers creates an environment that can deteriorate your precious scents.</p>
      
      <h2>Don't shake the bottle</h2>
      <p>Contrary to popular belief, shaking your perfume bottle doesn't mix the ingredients better – it actually introduces air bubbles that can accelerate oxidation. Simply spray and enjoy without shaking.</p>
      
      <h2>Consider refrigeration for long-term storage</h2>
      <p>If you have a large collection or rarely used bottles, consider storing them in a dedicated cosmetics fridge or a regular refrigerator. The cool, dark environment is ideal for preserving fragrances for years.</p>
    `,
    tag: "Tips",
    date: "March 15, 2025",
    author: "Sophie Martin",
    readTime: "5 min read",
    comments: 5,
    image: "/images/product-1.jpg",
  },
  "understanding-olfactory-pyramid": {
    title: "Top, heart and base notes: understanding the olfactory pyramid",
    excerpt: "An introduction to the three phases of a perfume and how they evolve on your skin throughout the day.",
    content: `
      <p>When you spray a perfume, you're not experiencing just one scent – you're embarking on a journey through multiple layers of fragrance that unfold over time. This structure is known as the olfactory pyramid, and understanding it can help you choose and appreciate perfumes on a deeper level.</p>
      
      <h2>Top Notes: The First Impression</h2>
      <p>Top notes are what you smell immediately after applying a perfume. They're typically light, fresh, and volatile, meaning they evaporate quickly. Common top notes include citrus fruits (bergamot, lemon, orange), light herbs (basil, sage), and aromatic notes (lavender, mint).</p>
      <p>These notes last anywhere from 15 minutes to 2 hours and create the crucial first impression of a fragrance.</p>
      
      <h2>Heart Notes: The Soul of the Perfume</h2>
      <p>As the top notes fade, the heart notes emerge. These form the core of the fragrance and typically last 3-5 hours. Heart notes are usually more rounded and complex than top notes.</p>
      <p>Common heart notes include florals (rose, jasmine, ylang-ylang), spices (cinnamon, cardamom), and fruits (apple, peach). They provide the main character of the perfume.</p>
      
      <h2>Base Notes: The Lasting Foundation</h2>
      <p>Base notes are the foundation of any perfume. They're rich, deep, and long-lasting, often lingering on the skin for 6-8 hours or even longer. Base notes include woods (sandalwood, cedar, oud), musks, amber, vanilla, and resins.</p>
      <p>These notes not only provide longevity but also help anchor the lighter top and heart notes, allowing them to develop more slowly.</p>
      
      <h2>How to Test Perfumes Properly</h2>
      <p>Understanding the olfactory pyramid explains why you should never judge a perfume by its initial spray. Always wait at least 30 minutes to experience the heart notes, and several hours to appreciate the dry-down base notes before making a purchase decision.</p>
    `,
    tag: "Guide",
    date: "March 12, 2025",
    author: "Jean-Pierre Dubois",
    readTime: "7 min read",
    comments: 8,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
  },
  "top-5-perfumes-summer-2025": {
    title: "Top 5 perfumes for summer 2025",
    excerpt: "Our selection of fresh, light fragrances, perfect for sunny days.",
    content: `
      <p>Summer calls for lighter, fresher fragrances that won't feel overwhelming in the heat. We've curated our top picks for the season, featuring scents that are refreshing yet memorable.</p>
      
      <h2>1. Aqua di Gio Profondo</h2>
      <p>A modern take on the classic aquatic fragrance, featuring notes of sea minerals, bergamot, and woody amber. Perfect for beach days and casual outings.</p>
      
      <h2>2. Jo Malone Wood Sage & Sea Salt</h2>
      <p>This unisex gem captures the essence of coastal walks with its blend of ambrette seeds, sea salt, and sage. Effortlessly elegant and never overpowering.</p>
      
      <h2>3. Maison Francis Kurkdjian Aqua Universalis</h2>
      <p>A pure, clean scent with citrus and white flowers that feels like freshly laundered linen on a summer morning. Sophisticated simplicity at its best.</p>
      
      <h2>4. Versace Pour Homme</h2>
      <p>Mediterranean-inspired with neroli, citrus, and amber, this masculine scent is versatile enough for office days and evening dinners alike.</p>
      
      <h2>5. Dolce & Gabbana Light Blue</h2>
      <p>A timeless summer classic featuring Sicilian lemon, apple, and cedarwood. Its bright, cheerful character perfectly embodies the Italian summer spirit.</p>
      
      <h2>Tips for Wearing Perfume in Summer</h2>
      <p>In hot weather, perfume tends to project more intensely, so apply with a lighter hand. Focus on pulse points like inner wrists and behind the ears. Consider keeping a travel-size bottle in your bag for afternoon refreshes.</p>
    `,
    tag: "Selection",
    date: "March 8, 2025",
    author: "Amelia Rose",
    readTime: "6 min read",
    comments: 12,
    image: "/images/blog-top5.png",
  },
  "history-of-perfume": {
    title: "The history of perfume: from ancient civilizations to today",
    excerpt: "A journey through the ages to understand how perfume has shaped cultures and societies.",
    content: `
      <p>The art of perfumery is as old as civilization itself. From ancient rituals to modern luxury, fragrance has played a pivotal role in human culture for thousands of years.</p>
      
      <h2>Ancient Origins</h2>
      <p>The word "perfume" comes from the Latin "per fumum," meaning "through smoke." The earliest perfumes were incense and aromatic resins burned in religious ceremonies. Ancient Egyptians were particularly advanced in perfumery, using fragrant oils for religious rituals, cosmetics, and mummification.</p>
      
      <h2>The Persian Innovation</h2>
      <p>The Persians refined perfumery into an art form. The physician Avicenna invented the distillation process in the 10th century, allowing for the extraction of essential oils from flowers – a technique still used today.</p>
      
      <h2>European Renaissance</h2>
      <p>Perfume arrived in Europe through trade routes and the Crusades. Catherine de Medici brought her personal perfumer from Italy to France, establishing Grasse as the perfume capital of the world – a title it still holds today.</p>
      
      <h2>The Modern Era</h2>
      <p>The 19th century saw the development of synthetic molecules, allowing perfumers to create new scent combinations impossible with natural ingredients alone. The 20th century brought designer fragrances and celebrity perfumes to the masses.</p>
      
      <h2>Perfumery Today</h2>
      <p>Modern perfumery balances tradition with innovation. Niche houses focus on artisanal, unique creations while technology enables new synthetic molecules and sustainable practices. The future of fragrance is as exciting as its storied past.</p>
    `,
    tag: "History",
    date: "March 5, 2025",
    author: "Dr. Henri Leclerc",
    readTime: "8 min read",
    comments: 3,
    image: "/images/product-2.jpg",
  },
  "how-to-apply-perfume-optimal-sillage": {
    title: "How to apply perfume for optimal sillage",
    excerpt: "Pulse points, the ideal amount and mistakes to avoid for perfect diffusion.",
    content: `
      <p>Sillage – the trail of scent you leave behind – is the mark of a well-applied perfume. Here's how to maximize your fragrance's projection and longevity.</p>
      
      <h2>Understanding Pulse Points</h2>
      <p>Pulse points are areas where blood vessels are close to the skin, generating warmth that helps diffuse fragrance. The key pulse points are:</p>
      <ul>
        <li>Inner wrists</li>
        <li>Behind the ears</li>
        <li>Base of the throat</li>
        <li>Inside of elbows</li>
        <li>Behind the knees</li>
      </ul>
      
      <h2>The Right Amount</h2>
      <p>Less is more when it comes to perfume. For eau de parfum, 3-4 sprays are usually sufficient. For lighter formulations like eau de toilette, you might use 4-6 sprays. The goal is to create an aura, not announce your presence from across the room.</p>
      
      <h2>Common Mistakes to Avoid</h2>
      <p><strong>Don't rub your wrists together.</strong> This friction creates heat that breaks down the top notes, altering the fragrance's development.</p>
      <p><strong>Don't spray and walk through.</strong> Most of the fragrance ends up on your clothes and the floor rather than your skin.</p>
      <p><strong>Don't apply to dry skin.</strong> Moisturized skin holds fragrance better. Apply an unscented lotion before your perfume for better longevity.</p>
      
      <h2>Pro Tips for Maximum Impact</h2>
      <p>Apply perfume right after showering when your pores are open. Consider layering with matching body lotion or oil for extended wear. Store a small decant in your bag for midday touch-ups.</p>
    `,
    tag: "Tips",
    date: "March 1, 2025",
    author: "Sophie Martin",
    readTime: "5 min read",
    comments: 7,
    image: "/images/product-3.png",
  },
  "unisex-perfumes-trend": {
    title: "Unisex perfumes: the trend that's winning over",
    excerpt: "Why gender-neutral fragrances are gaining popularity and which ones to discover first.",
    content: `
      <p>The lines between masculine and feminine fragrances are blurring as more people embrace scents based on personal preference rather than marketing labels. Unisex perfumes are not just a trend – they're a revolution in how we think about fragrance.</p>
      
      <h2>Why Unisex Is the Future</h2>
      <p>Historically, the division between men's and women's perfumes has been arbitrary. Many classic ingredients like rose, oud, and lavender were worn by all genders throughout history. Today's consumers are rejecting artificial boundaries and choosing scents that resonate with their individual identity.</p>
      
      <h2>Our Top Unisex Recommendations</h2>
      <p><strong>Le Labo Santal 33:</strong> This woody, leathery scent has become a modern classic, loved by all for its unique blend of sandalwood and violet.</p>
      <p><strong>Byredo Gypsy Water:</strong> Fresh, wandering, and free-spirited with pine, sandalwood, and vanilla.</p>
      <p><strong>Maison Margiela Replica Jazz Club:</strong> Warm, smoky, and sophisticated with rum, tobacco, and vanilla.</p>
      <p><strong>Escentric Molecules 01:</strong> A minimalist's dream featuring iso e super, which smells different on everyone.</p>
      
      <h2>How to Choose Your Unisex Scent</h2>
      <p>Forget about traditional categories. Test fragrances on your own skin and give them time to develop. The best unisex perfume for you is simply the one that makes you feel confident and authentic.</p>
      
      <h2>The Business of Gender-Neutral Fragrance</h2>
      <p>Niche brands led this movement, but mainstream houses are following suit. This shift reflects broader cultural changes around gender expression and personal identity, making perfumery more inclusive than ever.</p>
    `,
    tag: "Trends",
    date: "February 28, 2025",
    author: "Alex Chen",
    readTime: "6 min read",
    comments: 4,
    image: "/images/login.webp",
  },
  "how-to-choose-perfume-based-on-personality": {
    title: "How to choose your perfume based on your personality",
    excerpt: "Find the perfect fragrance that matches who you are.",
    content: `
      <p>Your perfume is an invisible accessory that speaks volumes about who you are. Choosing a fragrance that aligns with your personality creates an authentic, memorable impression.</p>
      
      <h2>The Romantic</h2>
      <p>If you're drawn to poetry, candlelit dinners, and timeless elegance, look for fragrances with soft florals, powdery notes, and gentle musks. Rose, peony, and iris are your allies.</p>
      
      <h2>The Adventurer</h2>
      <p>For free spirits who love travel and new experiences, fresh aquatics, citrus bursts, and exotic spices capture your wanderlust. Look for notes of bergamot, sea salt, and cardamom.</p>
      
      <h2>The Sophisticate</h2>
      <p>Polished, confident, and always put-together? Rich woods, smooth leather, and warm amber create the refined aura you embody. Oud, sandalwood, and vetiver are your signature notes.</p>
      
      <h2>The Creative</h2>
      <p>Artists and dreamers need fragrances as unique as their visions. Seek out niche houses with unconventional combinations – think violet and concrete, or ink and paper.</p>
      
      <h2>The Minimalist</h2>
      <p>Clean, unfussy, and modern? Single-note or molecule fragrances offer sophistication without complexity. Iso e super, white musk, or a pure vetiver let your natural beauty shine.</p>
      
      <h2>Finding Your Match</h2>
      <p>The best way to find your signature scent is to sample widely. Visit our fragrance bar to test different families and discover which notes resonate with your authentic self.</p>
    `,
    tag: "Guide",
    date: "March 15, 2025",
    author: "Marie Lavande",
    readTime: "5 min read",
    comments: 9,
    image: "/images/new-arrivals-1.jpg",
  },
  "olfactory-families-explained": {
    title: "Olfactory families explained",
    excerpt: "Understanding fragrance categories to find your perfect scent.",
    content: `
      <p>Navigating the world of perfume becomes much easier once you understand the main olfactory families. Each family has distinct characteristics that appeal to different preferences and occasions.</p>
      
      <h2>Floral</h2>
      <p>The largest fragrance family, florals range from single-note soliflores to complex bouquets. Rose, jasmine, tuberose, and lily are classics. Florals can be fresh, powdery, or opulent depending on the composition.</p>
      
      <h2>Oriental</h2>
      <p>Rich, warm, and sensual, oriental fragrances feature amber, vanilla, spices, and resins. They're often associated with evening wear and cooler weather, creating a cocooning effect.</p>
      
      <h2>Woody</h2>
      <p>From creamy sandalwood to smoky vetiver, woody fragrances offer sophistication and depth. Cedar, oud, and patchouli create scents that are often unisex and versatile.</p>
      
      <h2>Fresh</h2>
      <p>This family includes citrus, green, and aquatic subfamilies. Light and invigorating, fresh fragrances are perfect for daytime wear and warm weather. Think bergamot, mint, and sea notes.</p>
      
      <h2>Fougère</h2>
      <p>A traditional masculine family built around lavender, oakmoss, and coumarin. Modern fougères have evolved to be more inclusive and lighter than their classic counterparts.</p>
      
      <h2>Chypre</h2>
      <p>Sophisticated and complex, chypres are built on a foundation of bergamot, oakmoss, and labdanum. They offer a mossy, earthy elegance favored by perfume connoisseurs.</p>
    `,
    tag: "Guide",
    date: "March 8, 2025",
    author: "Philippe Noir",
    readTime: "6 min read",
    comments: 6,
    image: "/images/new-arrivals-2.webp",
  },
  "perfume-rituals-for-spring": {
    title: "Perfume rituals for spring",
    excerpt: "Refresh your fragrance wardrobe for the new season.",
    content: `
      <p>As the seasons change, so should your fragrance rituals. Spring is the perfect time to refresh your scent wardrobe and adapt your application techniques for warmer days ahead.</p>
      
      <h2>Transitioning Your Wardrobe</h2>
      <p>Store your heavy winter orientals and bring out lighter options. Spring calls for florals, fresh greens, and gentle citrus notes that complement the blooming season.</p>
      
      <h2>Layer for Complexity</h2>
      <p>Spring weather can be unpredictable. Create versatile scent combinations by layering a fresh body lotion with a slightly warmer eau de parfum for all-day adaptability.</p>
      
      <h2>Adjust Your Application</h2>
      <p>As temperatures rise, you'll need less perfume. Reduce your spray count and focus on areas that won't get as warm, like behind the knees and in your hair.</p>
      
      <h2>Our Spring Picks</h2>
      <p><strong>Chanel Chance Eau Fraîche:</strong> Sparkling citrus and jasmine embody spring's fresh energy.</p>
      <p><strong>Diptyque Philosykos:</strong> Green fig leaves and woody notes capture a Mediterranean garden.</p>
      <p><strong>Clean Reserve Skin:</strong> A barely-there musk perfect for those who prefer subtle scents.</p>
      
      <h2>Care for Your Collection</h2>
      <p>As humidity increases, ensure your perfumes are stored properly. Now is a good time to check expiration dates and rotate your collection to keep fragrances fresh.</p>
    `,
    tag: "Lifestyle",
    date: "March 1, 2025",
    author: "Emma Bloom",
    readTime: "4 min read",
    comments: 5,
    image: "/images/dropdown-4.webp",
  },
};

const relatedPosts = [
  {
    slug: "how-to-store-perfume-last-longer",
    title: "How to store your perfume so it lasts longer",
    tag: "Tips",
    image: "/images/product-1.jpg",
  },
  {
    slug: "understanding-olfactory-pyramid",
    title: "Top, heart and base notes: understanding the olfactory pyramid",
    tag: "Guide",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "top-5-perfumes-summer-2025",
    title: "Top 5 perfumes for summer 2025",
    tag: "Selection",
    image: "/images/blog-top5.png",
  },
];

const categories = [
  { name: "Women's perfumes", count: 8 },
  { name: "Men's perfumes", count: 6 },
  { name: "Tips & tricks", count: 12 },
  { name: "New brands", count: 4 },
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
        <Navbar />
        <main>
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <p className="mt-4 text-(--brand-primary)/70">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <FiChevronLeft className="h-4 w-4" />
              Back to blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const filteredRelated = relatedPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main>
        {/* Hero Image */}
        <div className="relative h-[40vh] min-h-[300px] w-full sm:h-[50vh]">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <span className="inline-block rounded bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-(--brand-primary)">
                {post.tag}
              </span>
              <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Main Content */}
            <article className="min-w-0 flex-1 lg:w-2/3">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 border-b border-black/10 pb-6 text-sm text-(--brand-primary)/70">
                <span className="flex items-center gap-1.5">
                  <FiUser className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiMessageCircle className="h-4 w-4" />
                  {post.comments} comments
                </span>
              </div>

              {/* Article content */}
              <div
                className="prose prose-lg mt-8 max-w-none prose-headings:font-bold prose-headings:text-(--brand-primary) prose-p:text-(--brand-primary)/80 prose-a:text-(--brand-primary) prose-a:underline prose-strong:text-(--brand-primary) prose-ul:text-(--brand-primary)/80 prose-li:marker:text-(--brand-primary)"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-black/10 pt-6">
                <FiTag className="h-4 w-4 text-(--brand-primary)/50" />
                <span className="text-sm text-(--brand-primary)/70">Tags:</span>
                <span className="rounded-full bg-(--brand-primary)/10 px-3 py-1 text-xs font-medium text-(--brand-primary)">
                  {post.tag}
                </span>
                <span className="rounded-full bg-(--brand-primary)/10 px-3 py-1 text-xs font-medium text-(--brand-primary)">
                  Perfume
                </span>
                <span className="rounded-full bg-(--brand-primary)/10 px-3 py-1 text-xs font-medium text-(--brand-primary)">
                  Fragrance
                </span>
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-(--brand-primary) transition-opacity hover:opacity-70"
                >
                  <FiChevronLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </div>

              {/* Related Posts */}
              <div className="mt-12 border-t border-black/10 pt-10">
                <h2 className="text-xl font-bold text-(--brand-primary)">
                  Related articles
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRelated.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg"
                    >
                      <div className="relative aspect-4/3 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute right-2 top-2 rounded bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          {related.tag}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold leading-snug text-(--brand-primary) line-clamp-2 transition-opacity group-hover:opacity-80">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full shrink-0 lg:w-1/3">
              <div className="sticky top-32 space-y-8">
                {/* Search */}
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                    Search
                  </h3>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search articles..."
                      className="w-full rounded border border-(--brand-primary)/30 bg-white py-2.5 pl-3 pr-10 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
                    />
                    <FiSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--brand-primary)/60" />
                  </div>
                </div>

                {/* Categories */}
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <a
                          href="#"
                          className="flex items-center justify-between py-1 text-sm text-(--brand-primary)/80 transition-colors hover:text-(--brand-primary)"
                        >
                          {cat.name}
                          <span className="text-xs text-(--brand-primary)/50">
                            ({cat.count})
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="rounded-lg bg-(--brand-primary) p-5 text-white">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider">
                    Newsletter
                  </h3>
                  <p className="mb-4 text-sm text-white/70">
                    Subscribe to get the latest articles and perfume tips.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="mb-3 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
                  />
                  <button className="w-full rounded bg-white py-2.5 text-sm font-semibold text-(--brand-primary) transition-opacity hover:opacity-90">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
