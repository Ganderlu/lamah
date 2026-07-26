"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from "react";
import { Instagram, Youtube, Twitch, X, Facebook } from "lucide-react";
import { fetchSettings } from "@/lib/settings";

const TiktokIcon = ({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z" />
    <path d="M15 8.5a3.5 3.5 0 0 0 5 3.5" />
    <path d="M9 11.5a3.5 3.5 0 1 0 3.5 3.5V8" />
  </svg>
);

type SocialLink = {
  key: "instagram" | "youtube" | "twitter" | "twitch" | "facebook" | "tiktok";
  label: string;
  Icon: ComponentType<{ size?: number | string } & SVGProps<SVGSVGElement>>;
  /** Fallback URL from defaultSettings; overridden from the admin settings doc when present */
  fallback: string;
};

const ORDERED_SOCIALS: SocialLink[] = [
  {
    key: "instagram",
    label: "Instagram",
    Icon: Instagram,
    fallback: "https://www.instagram.com/notlamarama/",
  },
  {
    key: "tiktok",
    label: "TikTok",
    Icon: TiktokIcon,
    fallback: "",
  },
  {
    key: "facebook",
    label: "Facebook",
    Icon: Facebook,
    fallback: "",
  },
  {
    key: "twitch",
    label: "Twitch",
    Icon: Twitch,
    fallback:
      "https://www.twitch.tv/r/e/eyJsb2NhdGlvbiI6ImNoYW5uZWxfbmFtZSIsImVtYWlsX2lkIjoiODU4MzIwNDctYmJmOC00MTU5LWJhODctMzVmMTIxZjQ4MWUzIiwibmFtZSI6ImxvZ2luX2NoYW5nZSIsInNvdXJjZV9lbWFpbCI6IiIsImN0YV92YWx1ZSI6IiIsImNoYW5uZWwiOiIiLCJsb2dpbiI6IiJ9/1177990052/30f5746a5e55a7d532394c0440a72b5c667cc09e7a9024c0b23b2ce0300f8d57/notlamarama?ignore_query=true&tt_content=login_change&tt_email_id=85832047-bbf8-4159-ba87-35f121f481e3&tt_medium=email",
  },
  {
    key: "twitter",
    label: "X",
    Icon: X,
    fallback: "https://x.com/notlamarama",
  },
  {
    key: "youtube",
    label: "YouTube",
    Icon: Youtube,
    fallback:
      "https://m.youtube.com/channel/UC0hT2jgzSioOqkkCcQRN8Rg?ra=m",
  },
];

export default function Footer() {
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolvedUrls, setResolvedUrls] = useState<Record<SocialLink["key"], string>>({
    instagram: ORDERED_SOCIALS[0].fallback,
    tiktok: ORDERED_SOCIALS[1].fallback,
    facebook: ORDERED_SOCIALS[2].fallback,
    twitch: ORDERED_SOCIALS[3].fallback,
    twitter: ORDERED_SOCIALS[4].fallback,
    youtube: ORDERED_SOCIALS[5].fallback,
  });

  useEffect(() => {
    let cancelled = false;
    setHydrated(true);

    async function load() {
      // Skip entirely if there's no Firebase client config available, to avoid
      // noisy Firebase init errors at runtime on freshly-cloned environments.
      const hasFirebaseConfig = Boolean(
        typeof process !== "undefined" &&
          (process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      );
      if (!hasFirebaseConfig) return;

      try {
        setLoading(true);
        const settings = await fetchSettings();
        if (cancelled) return;
        setResolvedUrls((prev) => {
          const next: typeof prev = { ...prev };
          (Object.keys(next) as Array<SocialLink["key"]>).forEach((key) => {
            const value = (settings as unknown as Record<string, unknown>)[key];
            if (typeof value === "string" && value.trim()) {
              next[key] = value.trim();
            }
          });
          return next;
        });
      } catch (err) {
        // Fall back to Footer's baked-in links (no user-visible error)
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Footer] Could not load social links from settings:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const socialRows = useMemo(() => {
    return ORDERED_SOCIALS.map((item) => {
      const url = resolvedUrls[item.key] || item.fallback;
      return { ...item, url };
    }).filter((item) => Boolean(item.url && item.url.trim()));
  }, [resolvedUrls]);

  return (
    <Box sx={{ bgcolor: "#050505", borderTop: "1px solid rgba(57,255,20,0.15)", py: 10 }}>
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Column 1: Brand */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <Link href="/" passHref>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <Image
                    src="/images/lamahhlogo.png"
                    alt="Lamah Clothing Co."
                    width={80}
                    height={32}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Link>
            </Box>
            <Typography variant="body2" sx={{ color: "#A0A0A0", mb: 3 }}>
              Every piece we design carries a purpose. Wear the mindset. Live the movement.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ minHeight: 28 }}>
              {!hydrated || loading ? (
                socialRows.map((item) => (
                  <Skeleton
                    key={item.key}
                    variant="circular"
                    width={28}
                    height={28}
                    sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                  />
                ))
              ) : (
                socialRows.map((item) => {
                  const { Icon, url, label } = item;
                  return (
                    <MuiLink
                      key={item.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      sx={{
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        "&:hover": { color: "#39FF14" },
                      }}
                    >
                      <Icon size={22} />
                    </MuiLink>
                  );
                })
              )}
            </Stack>
          </Grid>

          {/* Column 2: Customer Care */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                mb: 3,
                letterSpacing: "0.1em",
              }}
            >
              Customer Care
            </Typography>
            <Stack spacing={2}>
              <Link href="/contact" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Contact
                </Typography>
              </Link>
              <Link href="/faq" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  FAQ
                </Typography>
              </Link>
              <Link href="/shipping" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Shipping
                </Typography>
              </Link>
              <Link href="/returns" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Returns
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Column 3: Company */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                mb: 3,
                letterSpacing: "0.1em",
              }}
            >
              Company
            </Typography>
            <Stack spacing={2}>
              <Link href="/careers" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Careers
                </Typography>
              </Link>
              <Link href="/press" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Press
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Column 4: Movement Mantra */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                border: "1px solid rgba(57,255,20,0.15)",
                borderRadius: "18px",
                p: 4,
                background:
                  "linear-gradient(135deg, rgba(57,255,20,0.06), rgba(0,0,0,0))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2.5,
                minHeight: "100%",
              }}
            >
              {(["LOVE", "ACCEPT", "MOTIVATE", "ASPIRE", "HEAL"] as const).map(
                (word) => (
                  <Typography
                    key={word}
                    variant="h4"
                    component="div"
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#39FF14",
                      letterSpacing: "0.18em",
                      textShadow:
                        "0 0 6px rgba(57,255,20,0.55), 0 0 18px rgba(57,255,20,0.35), 0 0 36px rgba(57,255,20,0.18)",
                      lineHeight: 1,
                    }}
                  >
                    {word}
                  </Typography>
                )
              )}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 10,
            pt: 4,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6E6E6E",
              fontFamily: "Inter, sans-serif",
            }}
          >
            © {new Date().getFullYear()} Lamah Clothing Co. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="/privacy" passHref style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6E6E6E", "&:hover": { color: "#39FF14" } }}>
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" passHref style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6E6E6E", "&:hover": { color: "#39FF14" } }}>
                Terms
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
