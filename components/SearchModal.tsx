"use client";

import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  X,
  Tag,
  ShoppingBag,
  Sparkles,
  Grid3X3,
  Layers,
  ArrowUpRight,
  Command,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  executeSearch,
  formatCurrency,
  groupResultsByType,
  loadSearchData,
  type SearchResultItem,
  type SearchResultType,
} from "@/lib/search";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_TABS: Array<{ value: "all" | SearchResultType; label: string; icon: typeof Tag }> = [
  { value: "all", label: "All", icon: Sparkles },
  { value: "product", label: "Products", icon: ShoppingBag },
  { value: "newArrival", label: "New Arrivals", icon: Sparkles },
  { value: "category", label: "Categories", icon: Grid3X3 },
  { value: "collection", label: "Collections", icon: Layers },
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [activeType, setActiveType] = useState<"all" | SearchResultType>("all");
  const [dataReady, setDataReady] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cacheRef = useRef<{
    products: any[];
    newArrivals: any[];
    categories: any[];
    collections: any[];
  } | null>(null);

  const handleLoadData = useCallback(async () => {
    if (cacheRef.current) {
      setDataReady(true);
      return;
    }
    try {
      setLoading(true);
      const data = await loadSearchData();
      cacheRef.current = data;
      setDataReady(true);
    } catch (error) {
      console.error("Failed to load search data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      handleLoadData();
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, handleLoadData]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!cacheRef.current) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const typedResults = executeSearch(cacheRef.current, trimmed, {
      types: activeType === "all" ? undefined : [activeType],
      limit: 40,
    });
    setResults(typedResults);
  }, [query, activeType]);

  const grouped = useMemo(() => groupResultsByType(results), [results]);

  const handleResultClick = () => {
    onClose();
  };

  const renderEmpty = () => (
    <Box
      sx={{
        py: 10,
        px: 4,
        textAlign: "center",
        borderRadius: "20px",
        border: "1px dashed rgba(57,255,20,0.25)",
        background: "rgba(10,10,10,0.6)",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontFamily: "Poppins, sans-serif",
          fontSize: "1rem",
          mb: 1,
          fontWeight: 600,
        }}
      >
        {loading ? "Loading catalog…" : "No results found"}
      </Typography>
      <Typography
        sx={{
          color: "#8E8E8E",
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.875rem",
        }}
      >
        {loading
          ? "Just a moment while we sync your search index."
          : "Try a different keyword, SKU, or category name."}
      </Typography>
    </Box>
  );

  const renderResultCard = (item: SearchResultItem, index: number) => {
    const isProductLike = item.type === "product" || item.type === "newArrival";
    return (
      <motion.div
        key={`${item.type}-${item.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      >
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            href={item.href}
            onClick={handleResultClick}
            sx={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.06)",
              bgcolor: "rgba(255,255,255,0.02)",
              py: 2,
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              "&:hover": {
                borderColor: "rgba(57,255,20,0.45)",
                bgcolor: "rgba(57,255,20,0.05)",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 64,
                height: 64,
                minWidth: 64,
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(57,255,20,0.15)",
                bgcolor: "#0F0F0F",
              }}
            >
              <Image
                src={item.image || "/images/lamahwhiteb.png"}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#8E8E8E",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.subtitle}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.25 }}>
                  {item.badges.slice(0, 3).map((badge) => (
                    <Chip
                      key={badge}
                      label={badge}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        fontFamily: "Inter, sans-serif",
                        bgcolor: "rgba(57,255,20,0.1)",
                        color: "#39FF14",
                        border: "1px solid rgba(57,255,20,0.25)",
                        height: 22,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  flexShrink: 0,
                }}
              >
                {isProductLike && item.price != null ? (
                  <Typography
                    sx={{
                      color: "#39FF14",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {formatCurrency(item.price)}
                  </Typography>
                ) : null}
                <IconButton
                  size="small"
                  sx={{
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "&:hover": { bgcolor: "rgba(57,255,20,0.12)", color: "#39FF14" },
                  }}
                >
                  <ArrowUpRight size={16} />
                </IconButton>
              </Box>
            </Box>
          </ListItemButton>
        </ListItem>
      </motion.div>
    );
  };

  const renderSection = (
    title: string,
    items: SearchResultItem[],
    accent: string
  ) => {
    if (items.length === 0) return null;
    return (
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 5,
                height: 20,
                borderRadius: 999,
                bgcolor: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
            <Typography
              sx={{
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "0.08em",
              }}
            >
              {title}
            </Typography>
            <Chip
              label={`${items.length}`}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.04)",
                color: "#8E8E8E",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "Inter, sans-serif",
                height: 20,
                fontSize: "0.72rem",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>
        <List sx={{ py: 0 }}>
          {items.slice(0, 5).map((item, idx) => renderResultCard(item, idx))}
          {items.length > 5 && (
            <Box sx={{ mt: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  color: "#8E8E8E",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                +{items.length - 5} more {title.toLowerCase()}. Click{" "}
                <MuiLink
                  component={Link}
                  href={viewAllUrl}
                  onClick={onClose}
                  sx={{
                    color: "#39FF14",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  View all results
                </MuiLink>
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    );
  };

  const viewAllUrl = query.trim()
    ? `/search?q=${encodeURIComponent(query.trim())}` +
      (activeType !== "all" ? `&type=${activeType}` : "")
    : "/search";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disablePortal={false}
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "center",
          pt: { xs: 2, sm: 3, md: 0 },
          pb: { xs: 2, md: 0 },
        },
        "& .MuiBackdrop-root": {
          bgcolor: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(10px)",
        },
      }}
      PaperProps={{
        sx: {
          maxHeight: {
            xs: "calc(100vh - 16px)",
            sm: "calc(100vh - 48px)",
            md: "min(860px, calc(100vh - 80px))",
          },
          width: "100%",
          maxWidth: 960,
          borderRadius: "26px",
          bgcolor: "rgba(8,8,8,0.98)",
          border: "1px solid rgba(57,255,20,0.25)",
          boxShadow:
            "0 30px 90px rgba(0,0,0,0.9), 0 0 60px rgba(57,255,20,0.15)",
          backgroundImage:
            "radial-gradient(circle at top right, rgba(57,255,20,0.16), transparent 42%)",
          overflow: "hidden",
          m: 0,
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: { xs: 2, md: 3 },
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 0.75,
            borderRadius: "14px",
            border: "1px solid rgba(57,255,20,0.3)",
            bgcolor: "rgba(57,255,20,0.08)",
          }}
        >
          <Sparkles size={16} color="#39FF14" />
          <Typography
            sx={{
              color: "#39FF14",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            LAMAH SEARCH
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 0.5,
            borderRadius: "8px",
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Command size={12} color="#8E8E8E" />
          <Typography
            sx={{
              color: "#8E8E8E",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.72rem",
            }}
          >
            Press ESC to close
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton
          onClick={onClose}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
          aria-label="Close search"
        >
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 } }}>
        <TextField
          fullWidth
          inputRef={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, SKUs, categories, collections, brands…"
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
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
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
              borderRadius: "20px",
              bgcolor: "rgba(255,255,255,0.03)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              px: 1,
              py: 0.5,
              transition: "all 0.2s ease",
              "&:hover, &.Mui-focused": {
                borderColor: "rgba(57,255,20,0.5)",
                boxShadow: "0 0 0 3px rgba(57,255,20,0.08)",
                bgcolor: "rgba(255,255,255,0.05)",
              },
              "& fieldset": { border: "none" },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              fontSize: "1rem",
              py: 1.5,
            },
          }}
        />

        <Box
          sx={{
            mt: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflowX: "auto",
            pb: 0.5,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Tabs
            value={activeType}
            onChange={(_, value) => setActiveType(value)}
            sx={{
              minHeight: 40,
              "& .MuiTabs-flexContainer": { gap: 0.5 },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const selected = activeType === tab.value;
              return (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  disableRipple
                  icon={<Icon size={14} />}
                  iconPosition="start"
                  label={tab.label}
                  sx={{
                    minHeight: 40,
                    borderRadius: "999px",
                    px: 1.75,
                    py: 1,
                    mr: 0.5,
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: selected ? 600 : 500,
                    color: selected ? "#39FF14" : "#8E8E8E",
                    bgcolor: selected
                      ? "rgba(57,255,20,0.1)"
                      : "rgba(255,255,255,0.03)",
                    border: selected
                      ? "1px solid rgba(57,255,20,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: selected
                        ? "rgba(57,255,20,0.14)"
                        : "rgba(255,255,255,0.06)",
                      color: selected ? "#39FF14" : "#fff",
                    },
                    "& .MuiTab-iconWrapper": { mr: 0.5 },
                  }}
                />
              );
            })}
          </Tabs>
          <Box sx={{ flex: 1 }} />
          {query.trim() ? (
            <Button
              component={Link}
              href={viewAllUrl}
              onClick={onClose}
              size="small"
              endIcon={<ArrowUpRight size={14} />}
              sx={{
                borderRadius: "999px",
                px: 2.5,
                py: 1,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "#050505",
                bgcolor: "#39FF14",
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#32E312",
                  boxShadow: "0 0 18px rgba(57,255,20,0.35)",
                },
              }}
            >
              View all results
            </Button>
          ) : null}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 1.5 }} />

      <DialogContent
        sx={{
          px: { xs: 2, md: 4 },
          pb: { xs: 2, md: 3 },
          pt: { xs: 1, md: 2 },
          overflowY: "auto",
          flexShrink: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {!dataReady ? (
            <Box
              key="loading"
              sx={{
                py: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={32} sx={{ color: "#39FF14" }} />
              <Typography
                sx={{
                  color: "#8E8E8E",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                Preparing search index…
              </Typography>
            </Box>
          ) : !query.trim() ? (
            <Box
              key="idle"
              sx={{
                py: { xs: 3, md: 5 },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                  letterSpacing: "0.08em",
                  mb: 1,
                }}
              >
                START TYPING TO DISCOVER
              </Typography>
              <Typography
                sx={{
                  color: "#8E8E8E",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "0.82rem", md: "0.9rem" },
                  mb: { xs: 2.5, md: 3 },
                  maxWidth: 620,
                  mx: "auto",
                }}
              >
                Search across your entire catalog — products, new arrivals, categories, and collections.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 1.5,
                  maxWidth: 700,
                  mx: "auto",
                  textAlign: "left",
                }}
              >
                {[
                  { label: "Product name", example: "Oversized Graphic Tee" },
                  { label: "SKU", example: "LMH-TS-0241" },
                  { label: "Category", example: "Hoodies" },
                  { label: "Brand or tag", example: "Streetwear, limited" },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      bgcolor: "rgba(255,255,255,0.02)",
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        mb: 0.6,
                      }}
                    >
                      {item.label.toUpperCase()}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "0.88rem", md: "0.95rem" },
                        fontWeight: 500,
                      }}
                    >
                      {item.example}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderEmpty()}
            </motion.div>
          ) : activeType === "all" ? (
            <motion.div
              key="grouped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {renderSection("Products", grouped.product, "#39FF14")}
              {renderSection("New Arrivals", grouped.newArrival, "#00E5FF")}
              {renderSection("Categories", grouped.category, "#FF5DF6")}
              {renderSection("Collections", grouped.collection, "#FFC857")}
            </motion.div>
          ) : (
            <motion.div
              key="flat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <List sx={{ py: 0 }}>
                {results.map((item, idx) => renderResultCard(item, idx))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
