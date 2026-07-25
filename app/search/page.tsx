"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  Divider,
  Card,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Search as SearchIcon,
  X,
  ArrowUpRight,
  Tag,
  ShoppingBag,
  Sparkles,
  Grid3X3,
  Layers,
  ChevronRight,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ui/ProductCard";
import {
  executeSearch,
  formatCurrency,
  groupResultsByType,
  loadSearchData,
  type SearchResultItem,
  type SearchResultType,
} from "@/lib/search";

const TYPE_FILTERS: Array<{
  value: "all" | SearchResultType;
  label: string;
  icon: typeof Tag;
  accent: string;
}> = [
  { value: "all", label: "All Results", icon: Sparkles, accent: "#39FF14" },
  { value: "product", label: "Products", icon: ShoppingBag, accent: "#39FF14" },
  { value: "newArrival", label: "New Arrivals", icon: Sparkles, accent: "#00E5FF" },
  { value: "category", label: "Categories", icon: Grid3X3, accent: "#FF5DF6" },
  { value: "collection", label: "Collections", icon: Layers, accent: "#FFC857" },
];

type CardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") ?? "";
  const typeParam = (searchParams?.get("type") as "all" | SearchResultType | null) ?? "all";

  const [query, setQuery] = useState(q);
  const [activeType, setActiveType] = useState<"all" | SearchResultType>(
    TYPE_FILTERS.some((f) => f.value === typeParam) ? typeParam : "all"
  );
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const dataRef = useRef<any>(null);

  const runSearch = useCallback(
    (data: any, text: string, type: "all" | SearchResultType) => {
      const trimmed = text.trim();
      if (!trimmed || !data) {
        setResults([]);
        return;
      }
      const typed = executeSearch(data, trimmed, {
        types: type === "all" ? undefined : [type],
        limit: 200,
      });
      setResults(typed);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await loadSearchData();
        if (cancelled) return;
        dataRef.current = data;
        setDataReady(true);
        runSearch(data, query, activeType);
      } catch (error) {
        console.error("Failed to load search data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dataReady) return;
    runSearch(dataRef.current, query, activeType);
  }, [query, activeType, dataReady, runSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeType !== "all") params.set("type", activeType);
    const queryString = params.toString();
    const nextUrl = `/search${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [query, activeType]);

  const grouped = useMemo(() => groupResultsByType(results), [results]);

  const productCards: CardProps[] = useMemo(() => {
    const list: SearchResultItem[] =
      activeType === "all"
        ? [...grouped.product, ...grouped.newArrival]
        : activeType === "product"
        ? grouped.product
        : activeType === "newArrival"
        ? grouped.newArrival
        : [];
    return list.map((item) => ({
      id: item.id,
      name: item.title,
      price: item.price ?? 0,
      image: item.image ?? "/images/lamahwhiteb.png",
      isNew: item.type === "newArrival",
    }));
  }, [activeType, grouped]);

  const showProductGrid =
    activeType === "all" || activeType === "product" || activeType === "newArrival";
  const showDirectories = activeType === "all" || activeType === "category" || activeType === "collection";

  const categoryItems = activeType === "all" || activeType === "category" ? grouped.category : [];
  const collectionItems =
    activeType === "all" || activeType === "collection" ? grouped.collection : [];

  const renderDirectoryCard = (
    item: SearchResultItem,
    index: number,
    accent: string,
    kindLabel: string
  ) => (
    <Grid item xs={12} sm={6} md={4} key={`${item.type}-${item.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      >
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            bgcolor: "#111111",
            border: `1px solid ${accent}22`,
            height: 260,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              borderColor: accent,
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 30px ${accent}22`,
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: 0.65,
            }}
          >
            <Image
              src={item.image ?? "/images/lamahwhiteb.png"}
              alt={item.title}
              fill
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.0) 25%, rgba(5,5,5,0.95) 100%)",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
            }}
          >
            <Box>
              <Chip
                label={kindLabel}
                size="small"
                sx={{
                  bgcolor: `${accent}1F`,
                  color: accent,
                  border: `1px solid ${accent}55`,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  mb: 1.5,
                  "& .MuiChip-label": { px: 1.25 },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: "1.8rem",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  color: "#B5B5B5",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.82rem",
                  mb: 2,
                }}
              >
                {item.subtitle}
              </Typography>
              <Button
                component={Link}
                href={item.href}
                size="small"
                endIcon={<ArrowUpRight size={14} />}
                sx={{
                  borderRadius: "999px",
                  px: 2,
                  py: 0.75,
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  alignSelf: "flex-start",
                  "&:hover": {
                    bgcolor: accent,
                    color: "#050505",
                    borderColor: accent,
                    boxShadow: `0 0 20px ${accent}55`,
                  },
                }}
              >
                Browse
              </Button>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Grid>
  );

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 3, md: 6 },
            py: { xs: 10, md: 14 },
            background:
              "radial-gradient(circle at 20% 0%, rgba(57,255,20,0.18) 0%, transparent 35%), radial-gradient(circle at 80% 30%, rgba(0,229,255,0.1) 0%, transparent 30%), linear-gradient(180deg, #050505 0%, #0B0B0B 100%)",
            borderBottom: "1px solid rgba(57,255,20,0.08)",
          }}
        >
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Breadcrumbs
                separator={<ChevronRight size={14} color="#8E8E8E" />}
                sx={{ mb: 3 }}
              >
                <MuiLink
                  component={Link}
                  href="/"
                  underline="none"
                  sx={{
                    color: "#8E8E8E",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.82rem",
                    "&:hover": { color: "#39FF14" },
                  }}
                >
                  <Home size={14} /> Home
                </MuiLink>
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.82rem",
                  }}
                >
                  Search
                </Typography>
              </Breadcrumbs>

              <Chip
                label={loading ? "INDEXING CATALOG" : "UNIFIED SEARCH"}
                sx={{
                  mb: 3,
                  bgcolor: "rgba(57,255,20,0.12)",
                  color: "#39FF14",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.1em",
                  border: "1px solid rgba(57,255,20,0.25)",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "2.8rem", md: "5.5rem" },
                  color: "#fff",
                  letterSpacing: "0.18em",
                  mb: 2,
                  lineHeight: 0.95,
                }}
              >
                FIND ANYTHING
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 760,
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  mb: 5,
                }}
              >
                One search box for the entire storefront. Match products by name, SKU, tag, category,
                collection, or brand and jump to the exact page instantly.
              </Typography>

              <TextField
                fullWidth
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the entire catalog… Try ‘hoodie’ or a SKU like LMH-TS-0241"
                autoComplete="off"
                spellCheck={false}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      {loading && !dataReady ? (
                        <CircularProgress size={20} sx={{ color: "#39FF14" }} />
                      ) : (
                        <SearchIcon size={20} color="#39FF14" />
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: query ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setQuery("")}
                        edge="end"
                        sx={{ color: "#8E8E8E", "&:hover": { color: "#fff" } }}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "22px",
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    px: 1.5,
                    py: 0.75,
                    transition: "all 0.2s ease",
                    backdropFilter: "blur(12px)",
                    "&:hover, &.Mui-focused": {
                      borderColor: "rgba(57,255,20,0.55)",
                      boxShadow: "0 0 0 5px rgba(57,255,20,0.08)",
                      bgcolor: "rgba(255,255,255,0.06)",
                    },
                    "& fieldset": { border: "none" },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1.05rem",
                    py: 1.5,
                  },
                }}
              />

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {[
                    "Hoodies",
                    "Tees",
                    "Streetwear",
                    "Cargo",
                    "Jackets",
                    "Limited",
                  ].map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      clickable
                      onClick={() => setQuery(suggestion)}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.04)",
                        color: "#C5C5C5",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.78rem",
                        "&:hover": {
                          bgcolor: "rgba(57,255,20,0.08)",
                          color: "#39FF14",
                          borderColor: "rgba(57,255,20,0.3)",
                        },
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ flex: 1 }} />
                <Chip
                  label={`${results.length} result${results.length === 1 ? "" : "s"}`}
                  sx={{
                    bgcolor: "rgba(57,255,20,0.1)",
                    color: "#39FF14",
                    border: "1px solid rgba(57,255,20,0.25)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                />
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box
            sx={{
              mb: 6,
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
              pb: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Tabs
              value={activeType}
              onChange={(_, value) => setActiveType(value)}
              sx={{
                minHeight: 44,
                "& .MuiTabs-flexContainer": { gap: 0.5 },
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              {TYPE_FILTERS.map((tab) => {
                const Icon = tab.icon;
                const selected = activeType === tab.value;
                return (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    disableRipple
                    icon={<Icon size={15} />}
                    iconPosition="start"
                    label={tab.label}
                    sx={{
                      minHeight: 44,
                      borderRadius: "999px",
                      px: 2.25,
                      py: 1,
                      mr: 0.75,
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.86rem",
                      fontWeight: selected ? 600 : 500,
                      color: selected ? tab.accent : "#8E8E8E",
                      bgcolor: selected ? `${tab.accent}1A` : "rgba(255,255,255,0.03)",
                      border: selected
                        ? `1px solid ${tab.accent}66`
                        : "1px solid rgba(255,255,255,0.06)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: selected ? `${tab.accent}22` : "rgba(255,255,255,0.07)",
                        color: selected ? tab.accent : "#fff",
                      },
                      "& .MuiTab-iconWrapper": { mr: 0.75 },
                    }}
                  />
                );
              })}
            </Tabs>
          </Box>

          {loading && !dataReady ? (
            <Box sx={{ py: 16, display: "flex", justifyContent: "center" }}>
              <CircularProgress sx={{ color: "#39FF14" }} size={42} />
            </Box>
          ) : !query.trim() ? (
            <Box
              sx={{
                py: 12,
                px: 4,
                textAlign: "center",
                borderRadius: "24px",
                border: "1px solid rgba(57,255,20,0.12)",
                background:
                  "linear-gradient(180deg, rgba(17,17,17,0.92) 0%, rgba(5,5,5,0.98) 100%)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: "2rem",
                  letterSpacing: "0.1em",
                  mb: 1.5,
                }}
              >
                TYPE A KEYWORD TO BEGIN
              </Typography>
              <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                Start typing a product name, SKU, category, or collection in the search box above.
              </Typography>
            </Box>
          ) : results.length === 0 ? (
            <Box
              sx={{
                py: 14,
                px: 4,
                textAlign: "center",
                borderRadius: "24px",
                border: "1px dashed rgba(57,255,20,0.25)",
                background: "rgba(10,10,10,0.6)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1.2rem",
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                No matches for “{query}”
              </Typography>
              <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif", mb: 3 }}>
                Double-check your spelling, try a shorter keyword, or browse the store instead.
              </Typography>
              <Box sx={{ display: "inline-flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                  component={Link}
                  href="/shop"
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    px: 3,
                    py: 1.25,
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    bgcolor: "#39FF14",
                    color: "#050505",
                    "&:hover": { bgcolor: "#32E312" },
                  }}
                >
                  Browse all products
                </Button>
                <Button
                  onClick={() => setQuery("")}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    px: 3,
                    py: 1.25,
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  Clear search
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {showProductGrid && productCards.length > 0 && (
                <>
                  <SectionHeader
                    title={
                      activeType === "newArrival"
                        ? "Matching New Arrivals"
                        : activeType === "product"
                        ? "Matching Products"
                        : "Matching Products & Drops"
                    }
                    count={productCards.length}
                    accent="#39FF14"
                  />
                  <Grid container spacing={4} sx={{ mb: 10 }}>
                    {productCards.map((product, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.04 }}
                        >
                          <ProductCard {...product} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {showDirectories && (categoryItems.length > 0 || collectionItems.length > 0) && (
                <>
                  {categoryItems.length > 0 && (
                    <>
                      <SectionHeader
                        title="Matching Categories"
                        count={categoryItems.length}
                        accent="#FF5DF6"
                      />
                      <Grid container spacing={4} sx={{ mb: 10 }}>
                        {categoryItems.map((item, idx) =>
                          renderDirectoryCard(item, idx, "#FF5DF6", "CATEGORY")
                        )}
                      </Grid>
                    </>
                  )}

                  {collectionItems.length > 0 && (
                    <>
                      <SectionHeader
                        title="Matching Collections"
                        count={collectionItems.length}
                        accent="#FFC857"
                      />
                      <Grid container spacing={4}>
                        {collectionItems.map((item, idx) =>
                          renderDirectoryCard(item, idx, "#FFC857", "COLLECTION")
                        )}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}

function SectionHeader({
  title,
  count,
  accent,
}: {
  title: string;
  count: number;
  accent: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 4,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 34,
          borderRadius: 999,
          bgcolor: accent,
          boxShadow: `0 0 16px ${accent}`,
        }}
      />
      <Typography
        variant="h2"
        sx={{
          fontFamily: "Bebas Neue, cursive",
          fontSize: { xs: "2rem", md: "2.75rem" },
          color: "#fff",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </Typography>
      <Chip
        label={count}
        sx={{
          bgcolor: `${accent}1A`,
          color: accent,
          border: `1px solid ${accent}55`,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
        }}
      />
      <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.06)" }} />
    </Box>
  );
}
