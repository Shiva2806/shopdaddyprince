export interface CollectionDetail {
  title: string;
  description: string;
  image: string; // High-quality Unsplash image placeholder
}

export const COLLECTION_CONTENT: Record<string, CollectionDetail> = {
  // ─── Main Categories ──────────────────────────────────────────────────────────
  "paintings": {
    title: "Paintings",
    description: "Discover museum-worthy artworks curated from traditional Indian artistic schools. Each piece preserves heritage, craftsmanship, and storytelling refined across generations.",
    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1200&q=80"
  },
  "home-decor": {
    title: "Home Decor",
    description: "Enrich your living spaces with hand-carved panels, heritage hangings, and traditional showpieces. Every piece brings the warm soul of Indian craftsmanship into the modern home.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
  },
  "regional-arts": {
    title: "Regional Crafts",
    description: "Journey through India's artistic landscape. From the ancient scrolls of Odisha to the woodcraft of Andhra Pradesh, celebrate the regional legacy of native masters.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"
  },
  "brass": {
    title: "Brass & Bronze",
    description: "Experience the timeless lustre of hand-cast brass idols and artifacts. Sculpted using ancient lost-wax casting techniques, these pieces represent divine beauty and structural perfection.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"
  },
  "vintage": {
    title: "Vintage Archives",
    description: "Timeless heirlooms and architectural salvaged elements. Hand-restored antiques that carry the whispers of bygone eras, adding heritage character to contemporary spaces.",
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80"
  },
  "sale": {
    title: "The Archive Sale",
    description: "An exclusive opportunity to acquire curated Indian heritage crafts, paintings, and home accents at preferential pricing. Rare legacy pieces seeking their next home.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80"
  },

  // ─── Subcategories ────────────────────────────────────────────────────────────
  "traditional": {
    title: "Traditional Paintings",
    description: "Ancient themes and classical methodologies. Exquisite works reflecting deep spiritual devotion and complex iconography, painted on organic mediums using natural pigments.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"
  },
  "abstracts": {
    title: "Abstract Art",
    description: "Modern interpretations of traditional Indian motifs and color stories. A contemporary dialogue where texture, form, and emotion interact on canvas.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"
  },
  "portraits": {
    title: "Heritage Portraits",
    description: "Capturing the regal dignity and character of historic figures, royal courts, and community elders. Meticulous line work and fine detailing that tell a thousand stories.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
  },
  "caricatures": {
    title: "Indian Caricatures",
    description: "Playful, whimsical, and satirical visual commentaries. Bringing humor and vibrant folklore characters to life through expressive lines and folk aesthetic sensibilities.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"
  },
  "kalamkari": {
    title: "Kalamkari Art",
    description: "The fine art of drawing with bamboo pens and organic vegetable dyes. Discover hand-painted mythological panels and scrolls carrying 23 steps of traditional refinement.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80"
  },
  "kondapalli": {
    title: "Kondapalli Toys",
    description: "Whimsical softwood figurines hand-carved in Andhra Pradesh. Coated with local paste and painted with vegetable colors, depicting scenes from daily life and mythology.",
    image: "https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?auto=format&fit=crop&w=1200&q=80"
  },
  "cheriyal": {
    title: "Cheriyal Masks",
    description: "Stunning, expressive narrative masks crafted from sawdust, tamarind seed paste, and khadi. Painted in vibrant primary colors to illustrate epic folk tales.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80"
  },
  "cheriyal masks": {
    title: "Cheriyal Masks",
    description: "Stunning, expressive narrative masks crafted from sawdust, tamarind seed paste, and khadi. Painted in vibrant primary colors to illustrate epic folk tales.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80"
  },
  "warli": {
    title: "Warli Paintings",
    description: "Scribbles of sacred tribal expression from Maharashtra. Utilizing simple geometric shapes (circle, triangle, square) on cow dung-smeared mud walls with rice flour paste.",
    image: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=1200&q=80"
  },
  "warli paintings": {
    title: "Warli Paintings",
    description: "Scribbles of sacred tribal expression from Maharashtra. Utilizing simple geometric shapes (circle, triangle, square) on cow dung-smeared mud walls with rice flour paste.",
    image: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=1200&q=80"
  },
  "patachitra": {
    title: "Patachitra scrolls",
    description: "Ancient scroll paintings from Odisha and Bengal. Elaborate mythological narratives depicted on hand-processed cloth canvases using highly detailed brushes and natural colors.",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1200&q=80"
  },
  "lippan": {
    title: "Lippan Art",
    description: "Traditional mud-and-mirror relief art from the Kutch desert. Intricate white mud textures inlaid with shimmering mirrors, reflecting light to illuminate cozy interior spaces.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  "lippan art": {
    title: "Lippan Art",
    description: "Traditional mud-and-mirror relief art from the Kutch desert. Intricate white mud textures inlaid with shimmering mirrors, reflecting light to illuminate cozy interior spaces.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  "bistar": {
    title: "Bistar Art",
    description: "Ancestral tribal metalwork and crafts. Utilizing specialized alloy mixtures to create slender, stylized representations of wildlife, deities, and community rituals.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
  },
  "bistar art": {
    title: "Bistar Art",
    description: "Ancestral tribal metalwork and crafts. Utilizing specialized alloy mixtures to create slender, stylized representations of wildlife, deities, and community rituals.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
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
    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1200&q=80"
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
