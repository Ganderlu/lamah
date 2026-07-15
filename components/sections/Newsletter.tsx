"use client";

import { Box, Container, Typography, TextField, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <Box sx={{ py: 16, bgcolor: "#080808" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              bgcolor: "#111111",
              border: "1px solid rgba(57,255,20,0.15)",
              borderRadius: "24px",
              p: { xs: 6, md: 10 },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              JOIN THE LAMAH COMMUNITY
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#A0A0A0",
                mb: 6,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Subscribe to get exclusive access to new drops, special offers, and behind-the-scenes content.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              maxWidth="600px"
              mx="auto"
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#050505",
                    borderColor: "rgba(57,255,20,0.3)",
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "rgba(57,255,20,0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(57,255,20,0.6)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#39FF14",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#A0A0A0",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#39FF14",
                  color: "#050505",
                  "&:hover": { bgcolor: "#2ed611" },
                  px: 6,
                  py: 1.5,
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
