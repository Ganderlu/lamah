import type { Product } from "@/types/product";
import type { NewArrival } from "@/types/newArrival";
import type { Category } from "@/types/category";
import type { Collection } from "@/types/collection";
import { fetchProducts } from "./products";
import { fetchNewArrivals } from "./newArrivals";
import { fetchCategories } from "./categories";
import { fetchCollections } from "./collections";

export type SearchResultType = "product" | "newArrival" | "category" | "collection";

export interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  price?: number;
  image?: string;
  href: string;
  score: number;
  badges: string[];
}

const DEFAULT_PLACEHOLDER = "/images/lamahwhiteb.png";

const normalizeText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const scoreField = (
  fieldValue: string,
  tokens: string[],
  baseWeight: number,
  exactBonus: number
): number => {
  if (!fieldValue) return 0;
  const normalized = normalizeText(fieldValue);
  if (!normalized) return 0;

  let score = 0;
  const fullQuery = tokens.join(" ");

  if (normalized === fullQuery) {
    score += exactBonus;
  }
  if (normalized.startsWith(fullQuery)) {
    score += baseWeight * 1.2;
  }
  if (normalized.includes(fullQuery)) {
    score += baseWeight;
  }

  tokens.forEach((token) => {
    if (!token) return;
    if (normalized === token) {
      score += exactBonus / tokens.length;
    }
    if (normalized.startsWith(token)) {
      score += baseWeight * 0.6;
    }
    if (normalized.includes(token)) {
      score += baseWeight * 0.4;
    }

    const re = new RegExp(escapeRegExp(token), "gi");
    const matches = normalized.match(re);
    if (matches) {
      score += Math.min(matches.length, 3) * baseWeight * 0.08;
    }
  });

  return score;
};

export const mapProductToResult = (product: Product): SearchResultItem => ({
  type: "product",
  id: product.id ?? product.sku,
  title: product.name,
  subtitle: [product.brand, product.category, product.collection]
    .filter(Boolean)
    .join(" • "),
  price: product.discountPrice ?? product.price,
  image: product.thumbnail || DEFAULT_PLACEHOLDER,
  href: `/shop?product=${encodeURIComponent(product.id ?? "")}`,
  score: 0,
  badges: [
    product.category,
    ...(product.featured ? ["Featured"] : []),
    ...(product.tags?.slice(0, 1) ?? []),
  ].filter(Boolean),
});

export const mapNewArrivalToResult = (arrival: NewArrival): SearchResultItem => ({
  type: "newArrival",
  id: arrival.id ?? arrival.sku,
  title: arrival.productName,
  subtitle: [arrival.category, arrival.collection]
    .filter(Boolean)
    .join(" • "),
  price: arrival.discountPrice ?? arrival.price,
  image: arrival.thumbnail || DEFAULT_PLACEHOLDER,
  href: `/shop?arrival=${encodeURIComponent(arrival.id ?? "")}`,
  score: 0,
  badges: [
    "New",
    arrival.category ?? "",
    ...(arrival.featured ? ["Featured"] : []),
  ].filter(Boolean),
});

export const mapCategoryToResult = (category: Category): SearchResultItem => ({
  type: "category",
  id: category.id ?? category.slug,
  title: category.name,
  subtitle: `Category • ${category.productCount ?? 0} items`,
  image: category.image || DEFAULT_PLACEHOLDER,
  href: `/categories/${encodeURIComponent(category.slug)}`,
  score: 0,
  badges: ["Category", ...(category.featured ? ["Featured"] : [])],
});

export const mapCollectionToResult = (collection: Collection): SearchResultItem => ({
  type: "collection",
  id: collection.id ?? collection.slug,
  title: collection.name,
  subtitle: `Collection • ${collection.productCount ?? 0} items`,
  image: collection.coverImage || DEFAULT_PLACEHOLDER,
  href: `/collections/${encodeURIComponent(collection.slug)}`,
  score: 0,
  badges: ["Collection", ...(collection.featured ? ["Featured"] : [])],
});

interface ScoredItem {
  score: number;
  result: SearchResultItem;
}

const scoreProduct = (product: Product, tokens: string[]): number => {
  const weights = {
    name: 100,
    sku: 70,
    tags: 45,
    category: 40,
    collection: 38,
    brand: 35,
    description: 18,
    colors: 15,
    sizes: 10,
    exact: 220,
  };

  let score = 0;
  score += scoreField(product.name, tokens, weights.name, weights.exact);
  score += scoreField(product.sku, tokens, weights.sku, weights.exact);
  score += scoreField(product.category, tokens, weights.category, weights.exact);
  score += scoreField(product.collection, tokens, weights.collection, weights.exact);
  score += scoreField(product.brand, tokens, weights.brand, weights.exact);
  score += scoreField(product.description, tokens, weights.description, weights.exact);
  score += scoreField(product.tags.join(" "), tokens, weights.tags, weights.exact);
  score += scoreField(product.colors.join(" "), tokens, weights.colors, weights.exact);
  score += scoreField(product.sizes.join(" "), tokens, weights.sizes, weights.exact);

  if (product.featured) score += 5;
  if (product.status === "Active") score += 10;

  return score;
};

const scoreNewArrival = (arrival: NewArrival, tokens: string[]): number => {
  const weights = {
    productName: 100,
    sku: 70,
    tags: 45,
    category: 40,
    collection: 38,
    description: 18,
    colors: 15,
    sizes: 10,
    exact: 220,
  };

  let score = 0;
  score += scoreField(arrival.productName, tokens, weights.productName, weights.exact);
  score += scoreField(arrival.sku, tokens, weights.sku, weights.exact);
  score += scoreField(arrival.category ?? "", tokens, weights.category, weights.exact);
  score += scoreField(arrival.collection ?? "", tokens, weights.collection, weights.exact);
  score += scoreField(arrival.description ?? "", tokens, weights.description, weights.exact);
  score += scoreField((arrival.tags ?? []).join(" "), tokens, weights.tags, weights.exact);
  score += scoreField((arrival.colors ?? []).join(" "), tokens, weights.colors, weights.exact);
  score += scoreField((arrival.sizes ?? []).join(" "), tokens, weights.sizes, weights.exact);

  if (arrival.featured) score += 5;
  if (arrival.status === "Active") score += 10;
  score += 18;

  return score;
};

const scoreCategory = (category: Category, tokens: string[]): number => {
  const weights = {
    name: 90,
    slug: 70,
    description: 20,
    seo: 25,
    exact: 200,
  };

  let score = 0;
  score += scoreField(category.name, tokens, weights.name, weights.exact);
  score += scoreField(category.slug, tokens, weights.slug, weights.exact);
  score += scoreField(category.description, tokens, weights.description, weights.exact);
  score += scoreField(category.seoTitle ?? "", tokens, weights.seo, weights.exact);
  score += scoreField(category.seoDescription ?? "", tokens, weights.seo, weights.exact);

  if (category.featured) score += 6;
  if (category.status === "Active") score += 8;

  return score;
};

const scoreCollection = (collection: Collection, tokens: string[]): number => {
  const weights = {
    name: 90,
    slug: 70,
    description: 20,
    seo: 25,
    exact: 200,
  };

  let score = 0;
  score += scoreField(collection.name, tokens, weights.name, weights.exact);
  score += scoreField(collection.slug, tokens, weights.slug, weights.exact);
  score += scoreField(collection.description, tokens, weights.description, weights.exact);
  score += scoreField(collection.seoTitle ?? "", tokens, weights.seo, weights.exact);
  score += scoreField(collection.seoDescription ?? "", tokens, weights.seo, weights.exact);

  if (collection.featured) score += 6;
  if (collection.status === "Active") score += 8;

  return score;
};

interface SearchDataSet {
  products: Product[];
  newArrivals: NewArrival[];
  categories: Category[];
  collections: Collection[];
}

export const loadSearchData = async (): Promise<SearchDataSet> => {
  const [products, newArrivals, categories, collections] = await Promise.all([
    fetchProducts("Active"),
    fetchNewArrivals("Active"),
    fetchCategories("Active"),
    fetchCollections("Active"),
  ]);

  return { products, newArrivals, categories, collections };
};

export const executeSearch = (
  data: SearchDataSet,
  rawQuery: string,
  options?: {
    types?: SearchResultType[];
    limit?: number;
  }
): SearchResultItem[] => {
  const query = rawQuery?.trim() ?? "";
  if (!query) return [];

  const tokens = normalizeText(query)
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return [];

  const allowed = new Set<SearchResultType>(
    options?.types ?? ["product", "newArrival", "category", "collection"]
  );

  const scored: ScoredItem[] = [];

  if (allowed.has("product")) {
    data.products.forEach((product) => {
      const score = scoreProduct(product, tokens);
      if (score > 0) {
        const mapped = mapProductToResult(product);
        scored.push({ score, result: { ...mapped, score } });
      }
    });
  }

  if (allowed.has("newArrival")) {
    data.newArrivals.forEach((arrival) => {
      const score = scoreNewArrival(arrival, tokens);
      if (score > 0) {
        const mapped = mapNewArrivalToResult(arrival);
        scored.push({ score, result: { ...mapped, score } });
      }
    });
  }

  if (allowed.has("category")) {
    data.categories.forEach((category) => {
      const score = scoreCategory(category, tokens);
      if (score > 0) {
        const mapped = mapCategoryToResult(category);
        scored.push({ score, result: { ...mapped, score } });
      }
    });
  }

  if (allowed.has("collection")) {
    data.collections.forEach((collection) => {
      const score = scoreCollection(collection, tokens);
      if (score > 0) {
        const mapped = mapCollectionToResult(collection);
        scored.push({ score, result: { ...mapped, score } });
      }
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const limit = options?.limit ?? 50;
  return scored.slice(0, limit).map((s) => s.result);
};

export const groupResultsByType = (results: SearchResultItem[]) => {
  const groups: Record<SearchResultType, SearchResultItem[]> = {
    product: [],
    newArrival: [],
    category: [],
    collection: [],
  };

  results.forEach((result) => {
    groups[result.type].push(result);
  });

  return groups;
};

export const formatCurrency = (value?: number): string => {
  if (value == null || Number.isNaN(value)) return "";
  return `$${value.toFixed(2)}`;
};
