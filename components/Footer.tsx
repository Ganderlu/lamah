import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#050505", borderTop: "1px solid rgba(57,255,20,0.15)", py: 10 }}>
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Column 1: Brand */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 160,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#111",
                  borderRadius: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: "1.8rem",
                    color: "#39FF14",
                    letterSpacing: "0.1em",
                  }}
                >
                  LAMAH
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "#A0A0A0", mb: 3 }}>
              Every piece we design carries a purpose. Wear the mindset. Live the movement.
            </Typography>
            <Stack direction="row" spacing={2}>
              <MuiLink href="#" sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
                <Instagram size={22} />
              </MuiLink>
              <MuiLink href="#" sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
                <Music2 size={22} />
              </MuiLink>
              <MuiLink href="#" sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
                <Facebook size={22} />
              </MuiLink>
              <MuiLink href="#" sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
                <Twitter size={22} />
              </MuiLink>
              <MuiLink href="#" sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
                <Youtube size={22} />
              </MuiLink>
            </Stack>
          </Grid>

          {/* Column 2: Shop */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                mb: 3,
                letterSpacing: "0.1em",
              }}
            >
              Shop
            </Typography>
            <Stack spacing={2}>
              <Link href="/men" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Men
                </Typography>
              </Link>
              <Link href="/women" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Women
                </Typography>
              </Link>
              <Link href="/hoodies" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Hoodies
                </Typography>
              </Link>
              <Link href="/accessories" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Accessories
                </Typography>
              </Link>
              <Link href="/new-arrivals" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  New Arrivals
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Column 3: Customer Care */}
          <Grid item xs={12} sm={6} md={2}>
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
              <Link href="/size-guide" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Size Guide
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Column 4: Company */}
          <Grid item xs={12} sm={6} md={2}>
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
              <Link href="/about" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  About
                </Typography>
              </Link>
              <Link href="/our-story" passHref style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                  Our Story
                </Typography>
              </Link>
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

          {/* Column 5: Social */}
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
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
              Join the movement on social media.
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Footer */}
        <Box
          sx={{
            mt: 10,
            pt: 4,
            borderTop: "1px solid rgba(57,255,20,0.1)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
            © {new Date().getFullYear()} Lamah Clothing Co. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link href="/terms" passHref style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                Terms
              </Typography>
            </Link>
            <Link href="/privacy" passHref style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}>
                Privacy
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
