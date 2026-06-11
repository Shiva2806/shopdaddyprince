export interface CollectionDetail {
  title: string;
  description: string;
  image: string; // High-quality local banner image
}

export const COLLECTION_CONTENT: Record<string, CollectionDetail> = {
  // ─── Main Categories ──────────────────────────────────────────────────────────
  "paintings": {
    title: "Paintings",
    description: "Discover timeless artworks inspired by Indian culture, spirituality, and heritage. Each piece is curated to bring artistic elegance and storytelling into modern spaces.",
    image: "/images/categories/product_banners/painting.webp"
  },
  "home-decor": {
    title: "Home Decor",
    description: "Curated décor pieces crafted to elevate interiors with warmth, character, and heritage-inspired luxury.",
    image: "/images/categories/product_banners/homedec.webp"
  },
  "regional-arts": {
    title: "Regional Heritage",
    description: "Authentic handcrafted creations celebrating India's diverse regional traditions, artistry, and cultural craftsmanship.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "brass": {
    title: "Brass Collection",
    description: "Exquisite brass sculptures, lamps, and artifacts showcasing enduring Indian craftsmanship and heritage artistry.",
    image: "/images/categories/product_banners/brass.webp"
  },
  "vintage": {
    title: "Vintage Collection",
    description: "Unique vintage-inspired collectibles and decorative treasures that preserve timeless charm and old-world character.",
    image: "/images/categories/product_banners/vintage.webp"
  },
  "sale": {
    title: "The Archive Sale",
    description: "An exclusive opportunity to acquire curated Indian heritage crafts, paintings, and home accents at preferential pricing. Rare legacy pieces seeking their next home.",
    image: "/images/categories/product_banners/painting.webp"
  },

  // ─── Subcategories ────────────────────────────────────────────────────────────
  "traditional": {
    title: "Traditional Paintings",
    description: "Ancient themes and classical methodologies. Exquisite works reflecting deep spiritual devotion and complex iconography, painted on organic mediums using natural pigments.",
    image: "/images/categories/product_banners/painting.webp"
  },
  "abstracts": {
    title: "Abstract Art",
    description: "Modern interpretations of traditional Indian motifs and color stories. A contemporary dialogue where texture, form, and emotion interact on canvas.",
    image: "/images/categories/product_banners/painting.webp"
  },
  "portraits": {
    title: "Heritage Portraits",
    description: "Capturing the regal dignity and character of historic figures, royal courts, and community elders. Meticulous line work and fine detailing that tell a thousand stories.",
    image: "/images/categories/product_banners/painting.webp"
  },
  "caricatures": {
    title: "Indian Caricatures",
    description: "Playful, whimsical, and satirical visual commentaries. Bringing humor and vibrant folklore characters to life through expressive lines and folk aesthetic sensibilities.",
    image: "/images/categories/product_banners/painting.webp"
  },
  "kalamkari": {
    title: "Kalamkari Art",
    description: "The fine art of drawing with bamboo pens and organic vegetable dyes. Discover hand-painted mythological panels and scrolls carrying 23 steps of traditional refinement.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "kondapalli": {
    title: "Kondapalli Toys",
    description: "Whimsical softwood figurines hand-carved in Andhra Pradesh. Coated with local paste and painted with vegetable colors, depicting scenes from daily life and mythology.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "cheriyal": {
    title: "Cheriyal Masks",
    description: "Stunning, expressive narrative masks crafted from sawdust, tamarind seed paste, and khadi. Painted in vibrant primary colors to illustrate epic folk tales.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "cheriyal masks": {
    title: "Cheriyal Masks",
    description: "Stunning, expressive narrative masks crafted from sawdust, tamarind seed paste, and khadi. Painted in vibrant primary colors to illustrate epic folk tales.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "warli": {
    title: "Warli Paintings",
    description: "Scribbles of sacred tribal expression from Maharashtra. Utilizing simple geometric shapes (circle, triangle, square) on cow dung-smeared mud walls with rice flour paste.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "warli paintings": {
    title: "Warli Paintings",
    description: "Scribbles of sacred tribal expression from Maharashtra. Utilizing simple geometric shapes (circle, triangle, square) on cow dung-smeared mud walls with rice flour paste.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "patachitra": {
    title: "Patachitra scrolls",
    description: "Ancient scroll paintings from Odisha and Bengal. Elaborate mythological narratives depicted on hand-processed cloth canvases using highly detailed brushes and natural colors.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "lippan": {
    title: "Lippan Art",
    description: "Traditional mud-and-mirror relief art from the Kutch desert. Intricate white mud textures inlaid with shimmering mirrors, reflecting light to illuminate cozy interior spaces.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "lippan art": {
    title: "Lippan Art",
    description: "Traditional mud-and-mirror relief art from the Kutch desert. Intricate white mud textures inlaid with shimmering mirrors, reflecting light to illuminate cozy interior spaces.",
    image: "/images/categories/product_banners/regional.webp"
  },
  "bistar": {
    title: "Bistar Art",
    description: "Ancestral tribal metalwork and crafts. Utilizing specialized alloy mixtures to create slender, stylized representations of wildlife, deities, and community rituals.",
    image: "/images/categories/product_banners/brass.webp"
  },
  "bistar art": {
    title: "Bistar Art",
    description: "Ancestral tribal metalwork and crafts. Utilizing specialized alloy mixtures to create slender, stylized representations of wildlife, deities, and community rituals.",
    image: "/images/categories/product_banners/brass.webp"
  }
};

/**
 * Resolves title, description, and placeholder image details for a category and optional subcategory.
 * Supports case insensitivity, variations, and provides fallback logic for future subcategories.
 */
export function getCollectionDetail(category: string, subcategory?: string): CollectionDetail {
  const catKey = category.toLowerCase().trim();
  const parentDetail = COLLECTION_CONTENT[catKey] || {
    title: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
    description: `Discover curated museum-worthy works in our ${category} collection, preserving heritage and storytelling refined across generations.`,
    image: "/images/categories/product_banners/painting.webp"
  };

  if (subcategory) {
    const subKey = subcategory.toLowerCase().trim();
    // 1. Exact match
    if (COLLECTION_CONTENT[subKey]) {
      return COLLECTION_CONTENT[subKey];
    }
    // 2. Fuzzy substring match (e.g. "Lippan" matching "lippan art")
    const normalizedSub = subKey.replace(/(art|paintings|scrolls|masks)/g, "").trim();
    if (normalizedSub) {
      for (const [key, val] of Object.entries(COLLECTION_CONTENT)) {
        if (key !== catKey && (key.includes(normalizedSub) || normalizedSub.includes(key))) {
          return val;
        }
      }
    }
    // 3. Dynamic fallback for future subcategories:
    // Uses the parent category's image and builds a custom title/description.
    const cleanSubTitle = subcategory
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: cleanSubTitle,
      description: `Explore our collection of ${cleanSubTitle} — authentic, handpicked legacy works showcasing the finest elements of Indian craftsmanship.`,
      image: parentDetail.image
    };
  }

  return parentDetail;
}
