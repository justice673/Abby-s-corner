export const categoryLabels: Record<string, string> = {
  femme: "Parfums féminins",
  homme: "Parfums masculins",
  unisexe: "Unisexes",
  maison: "Maison & bien-être",
  coffrets: "Coffrets",
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
    condition: "Très bon état",
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
      "Terre d'Hermès est un parfum bois épicé qui évoque un voyage à travers les terres. Une fragrance intense et sophistiquée.",
  },
  {
    id: "2",
    name: "Black Orchid",
    fullName: "BLACK ORCHID - EAU DE PARFUM",
    brand: "TOM FORD",
    tags: ["Oriental", "Fleuri"],
    condition: "Neuf avec étiquette",
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
      "Black Orchid est une fragrance sensuelle et mystérieuse, alliant des notes florales sombres à des accords orientaux.",
  },
  {
    id: "3",
    name: "N°5",
    fullName: "N°5 - EAU DE PARFUM",
    brand: "CHANEL",
    tags: ["Fleuri", "Aldéhydé"],
    condition: "Neuf avec étiquette",
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
      "Le N°5 de Chanel, icône intemporelle de la parfumerie féminine. Une composition florale aldéhydée d'une élégance rare.",
  },
  {
    id: "4",
    name: "Sauvage",
    fullName: "SAUVAGE - EAU DE TOILETTE",
    brand: "DIOR",
    tags: ["Boisé", "Frais"],
    condition: "Très bon état",
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
      "Sauvage de Dior, une fragrance fraîche et épicée qui incarne la liberté et l'aventure.",
  },
  {
    id: "5",
    name: "Wood Sage & Sea Salt",
    fullName: "WOOD SAGE & SEA SALT - EAU DE COLOGNE",
    brand: "JO MALONE",
    tags: ["Frais", "Aromatique"],
    condition: "Neuf avec étiquette",
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
      "Une fragrance fraîche et aromatique qui évoque les promenades en bord de mer.",
  },
  {
    id: "6",
    name: "Gypsy Water",
    fullName: "GYPSY WATER - EAU DE PARFUM",
    brand: "BYREDO",
    tags: ["Boisé", "Ambré"],
    condition: "Très bon état",
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
      "Gypsy Water capture l'esprit nomade avec des notes boisées, ambrées et une touche de vanille.",
  },
  {
    id: "7",
    name: "Santal 33",
    fullName: "SANTAL 33 - EAU DE PARFUM",
    brand: "LE LABO",
    tags: ["Boisé", "Cuir"],
    condition: "Neuf avec étiquette",
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
      "Santal 33, une fragrance iconique aux notes de santal, cuir et cardamome.",
  },
  {
    id: "8",
    name: "Aventus",
    fullName: "AVENTUS - EAU DE PARFUM",
    brand: "CREED",
    tags: ["Boisé", "Fruité"],
    condition: "Très bon état",
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
      "Aventus de Creed, une fragrance légendaire aux notes fruitées et boisées.",
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
