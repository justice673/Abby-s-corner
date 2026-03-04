export const categoryLabels: Record<string, string> = {
  femme: "Women's perfumes",
  homme: "Men's perfumes",
  unisexe: "Unisex",
  maison: "Home & wellness",
  coffrets: "Gift sets",
};

export type Product = {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  tags: string[];
  condition: string;
  category: string;
  price: number;
  tete: string;
  coeur: string;
  fond: string;
  volume: string;
  stockLeft: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  description?: string;
};

const productImages = [
  "/images/product-1.jpg",
  "/images/product-2.jpg",
  "/images/product-3.png",
  "/images/product-4.jpg",
  "/images/product-5.webp",
  "/images/product-6.png",
  "/images/product-7.webp",
  "/images/product-8.webp",
  "/images/product-9.avif",
  "/images/product-10.png",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Terre d'Hermès",
    fullName: "TERRE D'HERMÈS - EAU DE PARFUM",
    brand: "HERMÈS",
    tags: ["Boisé", "Épicé"],
    condition: "Very good condition",
    category: "homme",
    price: 55800,
    tete: "Pamplemousse",
    coeur: "Épices",
    fond: "Bois de cèdre",
    volume: "100 ml",
    stockLeft: 14,
    image: "/images/product-1.jpg",
    images: [productImages[0], productImages[1], productImages[2], productImages[3]],
    rating: 4.8,
    reviewCount: 24,
    description:
      "Terre d'Hermès is a woody spicy perfume that evokes a journey through the lands. An intense and sophisticated fragrance.",
  },
  {
    id: "2",
    name: "Black Orchid",
    fullName: "BLACK ORCHID - EAU DE PARFUM",
    brand: "TOM FORD",
    tags: ["Oriental", "Fleuri"],
    condition: "New with tag",
    category: "femme",
    price: 78720,
    tete: "Truffe noire",
    coeur: "Orchidée",
    fond: "Patchouli",
    volume: "50 ml",
    stockLeft: 8,
    image: "/images/product-2.jpg",
    images: [productImages[1], productImages[2], productImages[3], productImages[4]],
    rating: 4.9,
    reviewCount: 42,
    description:
      "Black Orchid is a sensual and mysterious fragrance, combining dark floral notes with oriental accords.",
  },
  {
    id: "3",
    name: "N°5",
    fullName: "N°5 - EAU DE PARFUM",
    brand: "CHANEL",
    tags: ["Fleuri", "Aldéhydé"],
    condition: "New with tag",
    category: "femme",
    price: 62320,
    tete: "Aldéhydes",
    coeur: "Iris",
    fond: "Vanille",
    volume: "100 ml",
    stockLeft: 22,
    image: "/images/product-3.png",
    images: [productImages[2], productImages[3], productImages[4], productImages[5]],
    rating: 4.7,
    reviewCount: 36,
    description:
      "Chanel N°5, a timeless icon of women's perfumery. An aldehydic floral composition of rare elegance.",
  },
  {
    id: "4",
    name: "Sauvage",
    fullName: "SAUVAGE - EAU DE TOILETTE",
    brand: "DIOR",
    tags: ["Boisé", "Frais"],
    condition: "Very good condition",
    category: "homme",
    price: 51168,
    tete: "Bergamote",
    coeur: "Poivre",
    fond: "Ambroxan",
    volume: "100 ml",
    stockLeft: 5,
    image: "/images/product-4.jpg",
    images: [productImages[3], productImages[4], productImages[5], productImages[6]],
    rating: 4.6,
    reviewCount: 19,
    description:
      "Dior Sauvage, a fresh and spicy fragrance that embodies freedom and adventure.",
  },
  {
    id: "5",
    name: "Wood Sage & Sea Salt",
    fullName: "WOOD SAGE & SEA SALT - EAU DE COLOGNE",
    brand: "JO MALONE",
    tags: ["Frais", "Aromatique"],
    condition: "New with tag",
    category: "unisexe",
    price: 40672,
    tete: "Feuilles de sauge",
    coeur: "Varech",
    fond: "Vétiver",
    volume: "30 ml",
    stockLeft: 18,
    image: "/images/product-5.webp",
    images: [productImages[4], productImages[5], productImages[6], productImages[7]],
    rating: 4.5,
    reviewCount: 12,
    description:
      "A fresh and aromatic fragrance that evokes seaside walks.",
  },
  {
    id: "6",
    name: "Gypsy Water",
    fullName: "GYPSY WATER - EAU DE PARFUM",
    brand: "BYREDO",
    tags: ["Boisé", "Ambré"],
    condition: "Very good condition",
    category: "unisexe",
    price: 88560,
    tete: "Citron",
    coeur: "Pin",
    fond: "Vanille",
    volume: "50 ml",
    stockLeft: 11,
    image: "/images/product-6.png",
    images: [productImages[5], productImages[6], productImages[7], productImages[8]],
    rating: 4.8,
    reviewCount: 34,
    description:
      "Gypsy Water captures the nomadic spirit with woody, amber notes and a touch of vanilla.",
  },
  {
    id: "7",
    name: "Santal 33",
    fullName: "SANTAL 33 - EAU DE PARFUM",
    brand: "LE LABO",
    tags: ["Boisé", "Cuir"],
    condition: "New with tag",
    category: "unisexe",
    price: 108240,
    tete: "Cardamome",
    coeur: "Iris",
    fond: "Santal",
    volume: "50 ml",
    stockLeft: 3,
    image: "/images/product-7.webp",
    images: [productImages[6], productImages[7], productImages[8], productImages[9]],
    rating: 4.9,
    reviewCount: 28,
    description:
      "Santal 33, an iconic fragrance with notes of sandalwood, leather and cardamom.",
  },
  {
    id: "8",
    name: "Aventus",
    fullName: "AVENTUS - EAU DE PARFUM",
    brand: "CREED",
    tags: ["Boisé", "Fruité"],
    condition: "Very good condition",
    category: "homme",
    price: 144320,
    tete: "Ananas",
    coeur: "Bouleau",
    fond: "Mousse de chêne",
    volume: "100 ml",
    stockLeft: 7,
    image: "/images/product-8.webp",
    images: [productImages[7], productImages[8], productImages[9], productImages[0]],
    rating: 4.9,
    reviewCount: 41,
    description:
      "Creed Aventus, a legendary fragrance with fruity and woody notes.",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getSimilarProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}
