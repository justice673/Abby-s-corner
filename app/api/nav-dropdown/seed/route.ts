import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import NavDropdown from "@/lib/db/models/NavDropdown";

const marquesData = {
  menuKey: "marques",
  menuLabel: "Brands",
  items: [
    {
      id: "toutes-marques",
      label: "All brands",
      description:
        "Explore our full range of perfume houses, from the most iconic to new confidential signatures.",
      image: "/images/dropdown-1.webp",
      buttonText: "Discover all brands",
      link: "/brands",
      order: 0,
    },
    {
      id: "nouvelles-marques",
      label: "New brands",
      description:
        "New houses join our selection, chosen for their excellence and creativity.",
      image: "/images/dropdown-2.jpg",
      buttonText: "See what's new",
      link: "/brands/new",
      order: 1,
    },
    {
      id: "coups-de-coeur",
      label: "Favorites",
      description:
        "A curated selection of beloved houses, highly rated by our most loyal customers.",
      image: "/images/dropdown-3.webp",
      buttonText: "Discover the selection",
      link: "/brands/favorites",
      order: 2,
    },
  ],
  isActive: true,
};

const maisonData = {
  menuKey: "maison",
  menuLabel: "Home & wellness",
  items: [
    {
      id: "cheveux",
      label: "Hair perfumes",
      description:
        "Delicate mists that fragrance your hair without weighing it down, for a subtle trail with every movement.",
      image: "/images/dropdown-4.webp",
      buttonText: "Discover the mists",
      link: "/shop?category=hair",
      order: 0,
    },
    {
      id: "bougies",
      label: "Candles",
      description:
        "Create a warm atmosphere with our scented candles, inspired by your favorite accords.",
      image: "/images/dropdown-1.webp",
      buttonText: "View candles",
      link: "/shop?category=candles",
      order: 1,
    },
    {
      id: "ambiance",
      label: "Home fragrances",
      description:
        "Diffusers, sprays and home rituals to fragrance every room with elegance.",
      image: "/images/dropdown-3.webp",
      buttonText: "Fragrance your home",
      link: "/shop?category=home",
      order: 2,
    },
    {
      id: "corps",
      label: "Body care",
      description:
        "Lotions, oils and rituals to extend your perfume on skin and elevate the gesture.",
      image: "/images/dropdown-2.jpg",
      buttonText: "View body care",
      link: "/shop?category=body",
      order: 3,
    },
  ],
  isActive: true,
};

export async function POST() {
  try {
    await connectToDatabase();

    // Check if dropdowns already exist
    const existingCount = await NavDropdown.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          message: "Nav dropdowns already seeded",
          count: existingCount,
        },
        { status: 200 }
      );
    }

    // Seed dropdowns
    await NavDropdown.insertMany([marquesData, maisonData]);

    return NextResponse.json({
      message: "Nav dropdowns seeded successfully",
      count: 2,
    });
  } catch (error) {
    console.error("Error seeding nav dropdowns:", error);
    return NextResponse.json(
      { error: "Failed to seed nav dropdowns" },
      { status: 500 }
    );
  }
}
