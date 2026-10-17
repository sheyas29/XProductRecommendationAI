import mockJson from "./mockData.json";

/**
 * Exact mockData structure requested by user prompt
 */
export const mockData = {
  Jeans: [
    {
      priceRange: "500-1000",
      image: "https://picsum.photos/seed/jeans1/400/300",
      brand: "Wrogn",
      link: "https://www.wrogn.in",
    },
    {
      priceRange: "1000-1500",
      image: "https://picsum.photos/seed/jeans2/400/300",
      brand: "Levi's",
      link: "https://www.levi.in",
    },
    {
      priceRange: "1500-2000",
      image: "https://picsum.photos/seed/jeans3/400/300",
      brand: "Pepe Jeans",
      link: "https://www.pepejeans.in",
    },
  ],

  Smartphone: [
    {
      priceRange: "5000-10000",
      image: "https://picsum.photos/seed/smartphone1/400/300",
      brand: "Redmi Note",
      link: "https://www.mi.com",
    },
    {
      priceRange: "10000-20000",
      image: "https://picsum.photos/seed/smartphone2/400/300",
      brand: "Realme Pro",
      link: "https://www.realme.com",
    },
    {
      priceRange: "20000-50000",
      image: "https://picsum.photos/seed/smartphone3/400/300",
      brand: "OnePlus Nord",
      link: "https://www.oneplus.in",
    },
  ],

  Laptop: [
    {
      priceRange: "25000-50000",
      image: "https://picsum.photos/seed/laptop1/400/300",
      brand: "Lenovo IdeaPad",
      link: "https://www.lenovo.com",
    },
    {
      priceRange: "50000-80000",
      image: "https://picsum.photos/seed/laptop2/400/300",
      brand: "HP Pavilion",
      link: "https://www.hp.com",
    },
    {
      priceRange: "80000-150000",
      image: "https://picsum.photos/seed/laptop3/400/300",
      brand: "MacBook Air M2",
      link: "https://www.apple.com",
    },
  ],

  "T-shirt": [
    {
      priceRange: "300-700",
      image: "https://picsum.photos/seed/tshirt1/400/300",
      brand: "Roadster",
      link: "https://www.myntra.com",
    },
    {
      priceRange: "700-1200",
      image: "https://picsum.photos/seed/tshirt2/400/300",
      brand: "Puma Classic",
      link: "https://www.puma.com",
    },
    {
      priceRange: "1200-2000",
      image: "https://picsum.photos/seed/tshirt3/400/300",
      brand: "Tommy Hilfiger",
      link: "https://www.tommyhilfiger.in",
    },
  ],
};

export const FALLBACK_RESPONSE = mockJson.fallbackResponse;
export const PRODUCT_CATALOG = mockJson.products;

/**
 * Find product key from user text (e.g. "Jeans", "jeans", "t-shirt", "t shirt")
 */
export function identifyProduct(input) {
  if (!input) return null;
  const cleaned = input.trim().toLowerCase();

  if (cleaned.includes("jeans") || cleaned === "jeans") return "Jeans";
  if (cleaned.includes("smartphone") || cleaned.includes("phone") || cleaned.includes("mobile")) return "Smartphone";
  if (cleaned.includes("laptop") || cleaned.includes("computer")) return "Laptop";
  if (cleaned.includes("t-shirt") || cleaned.includes("tshirt") || cleaned.includes("t shirt")) return "T-shirt";

  return null;
}

/**
 * Match budget range for a specific product
 * Handles strings like "500 - 1000", "500-1000", "500 to 1000", or single number like "800"
 */
export function matchBudget(productKey, budgetInput) {
  if (!productKey || !budgetInput) return null;
  const productData = PRODUCT_CATALOG[productKey];
  if (!productData) return null;

  const cleaned = budgetInput.trim().replace(/\s+/g, "");

  // 1. Direct priceRange match (e.g., "500-1000")
  const exactMatch = productData.ranges.find(
    (r) => r.priceRange === cleaned || r.displayRange.replace(/\s+/g, "") === cleaned
  );
  if (exactMatch) return exactMatch;

  // 2. Parse numbers from input
  const numbers = budgetInput.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;

  if (numbers.length >= 2) {
    const minVal = parseInt(numbers[0], 10);
    const maxVal = parseInt(numbers[1], 10);

    // Look for range that matches or overlaps
    const matchedRange = productData.ranges.find((r) => {
      return (
        (minVal >= r.min && minVal <= r.max) ||
        (maxVal >= r.min && maxVal <= r.max) ||
        (minVal <= r.min && maxVal >= r.max) ||
        (minVal === r.min && maxVal === r.max)
      );
    });

    if (matchedRange) return matchedRange;
  } else if (numbers.length === 1) {
    const val = parseInt(numbers[0], 10);
    const matchedRange = productData.ranges.find((r) => val >= r.min && val <= r.max);
    if (matchedRange) return matchedRange;
  }

  return null;
}
