// Single source of truth for every plate style shown in the Navbar "PLATE STYLES"
// dropdown and on the /plate-styles catalogue page. Add a style here (with a real
// `image`) and it will automatically appear in both places — remove the image and
// it automatically disappears from both, so the two never drift out of sync.

export type PlateCategory =
  | "4D"
  | "3D"
  | "Neon"
  | "Gel"
  | "Bubble"
  | "Printed"
  | "Bike"
  | "4x4"
  | "Hex"
  | "Show Plate";

export interface PlateStyle {
  slug: string;
  title: string;
  navGroup: string; // grouping used in the Navbar dropdown
  categories: PlateCategory[];
  badge?: string;
  description: string;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const plateStyles: PlateStyle[] = [
  {
    slug: "4d-3mm",
    title: "4D 3mm Number Plates",
    navGroup: "4D",
    categories: ["4D"],
    badge: "Road Legal",
    isBestSeller: true,
    description:
      "Our most popular style. Laser-cut acrylic characters with 3mm raised depth for a bold, premium look.",
    image: "/plate-styles/4d-3mm/front.png",
  },
  {
    slug: "4d-5mm",
    title: "4D 5mm Number Plates",
    navGroup: "4D",
    categories: ["4D"],
    badge: "Road Legal",
    description:
      "Maximum impact with 5mm raised acrylic characters. The deepest 4D plates we offer.",
    image: "/plate-styles/4d-5mm/front.png",
  },
  {
    slug: "4d-gel-3mm",
    title: "4D Gel 3mm Number Plates",
    navGroup: "4D",
    categories: ["4D", "Gel"],
    badge: "Road Legal",
    description:
      "Acrylic characters finished with a smooth gel resin topping for the ultimate premium look.",
    image: "/plate-styles/4d-gel-3mm/front.png",
  },
  {
    slug: "4d-gel-5mm",
    title: "4D Gel 5mm Number Plates",
    navGroup: "4D",
    categories: ["4D", "Gel"],
    badge: "Road Legal",
    description:
      "5mm acrylic depth combined with gel resin. The pinnacle of number plate styling.",
    image: "/plate-styles/4d-gel-5mm/front.png",
  },
  {
    slug: "neon-4d",
    title: "Neon 4D Number Plates",
    navGroup: "Neon",
    categories: ["Neon", "4D", "Show Plate"],
    badge: "Show Plate",
    isNew: true,
    description:
      "Stunning neon-coloured 4D show plates available in multiple vibrant colour options.",
    image: "/plate-styles/neon-4d/front.png",
  },
  {
    slug: "neon-gel",
    title: "4D Neon Gel Show Plates",
    navGroup: "Neon",
    categories: ["Neon", "Gel", "Show Plate"],
    badge: "Show Plate",
    isNew: true,
    description:
      "Our most eye-catching show plates with glowing gel characters that demand attention.",
    image: "/plate-styles/neon-gel/front.png",
  },
  {
    slug: "standard",
    title: "Standard Plates",
    navGroup: "More Styles",
    categories: ["Printed"],
    badge: "Road Legal",
    description:
      "Our classic standard-size plate. Choose your border and digit style and build it in a couple of clicks.",
    image: "/plate-styles/printed/front.png",
  },
  {
    slug: "hex",
    title: "Hex Plates",
    navGroup: "More Styles",
    categories: ["Hex", "Show Plate"],
    badge: "Show Plate",
    isNew: true,
    description:
      "Hexagon-cut acrylic plates for a unique geometric look, available in multiple digit counts and finishes.",
    image: "/plate-styles/hex/front.png",
  },
  {
    slug: "3d-gel",
    title: "3D Number Plates",
    navGroup: "More Styles",
    categories: ["3D", "Gel"],
    badge: "Road Legal",
    description:
      "Classic gel resin characters with a rounded, domed appearance. A timeless look.",
    image: "/plate-styles/3d-gel/front.png",
  },
  {
    slug: "bubble",
    title: "Bubble Plates",
    navGroup: "More Styles",
    categories: ["Bubble"],
    badge: "Road Legal",
    description:
      "Unique shaped background plate with domed gel characters for a truly distinctive look.",
    image: "/plate-styles/bubble/front.png",
  },
  {
    slug: "bike-4d",
    title: "Motorbike 4D Plates",
    navGroup: "More Styles",
    categories: ["Bike", "4D"],
    badge: "Road Legal",
    description: "Specially designed 4D plates for motorcycles and scooters.",
    image: "/plate-styles/bike-4d/front.png",
  },
  {
    slug: "4x4",
    title: "4x4 Gel Plates",
    navGroup: "More Styles",
    categories: ["4x4", "Gel"],
    badge: "Road Legal",
    description:
      "Oversized 4x4 format plates with premium gel characters for SUVs and trucks.",
    image: "/plate-styles/4x4/front.png",
  },
];

export const filterCategories: PlateCategory[] = [
  "4D",
  "3D",
  "Neon",
  "Gel",
  "Bubble",
  "Printed",
  "Bike",
  "4x4",
  "Hex",
  "Show Plate",
];

export function getNavGroups() {
  const order = ["4D", "Neon", "More Styles"];
  const groups = order
    .map((group) => ({
      group,
      items: plateStyles
        .filter((style) => style.navGroup === group)
        .map((style) => ({
          label: style.title,
          href: `/plate-styles/${style.slug}`,
        })),
    }))
    .filter((group) => group.items.length > 0);

  const moreStyles = groups.find((g) => g.group === "More Styles");
  if (moreStyles) {
    moreStyles.items.push({ label: "All Plate Styles", href: "/plate-styles" });
  } else {
    groups.push({
      group: "More Styles",
      items: [{ label: "All Plate Styles", href: "/plate-styles" }],
    });
  }

  return groups;
}
