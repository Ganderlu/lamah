"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Divider,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  LogIn,
  KeyRound,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/store/admin";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const directorCodeSchema = z.object({
  code: z.string().min(6, { message: "Please enter a valid code" }),
});

type LoginInputs = z.infer<typeof loginSchema>;
type DirectorCodeInputs = z.infer<typeof directorCodeSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [directorLoading, setDirectorLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    success: boolean;
  }>({ open: false, message: "", success: true });

  const { setDirectorVerified, isDirectorCodeValid } = useAdminStore();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const {
    register: codeRegister,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
    reset: resetCode,
    watch: watchCode,
  } = useForm<DirectorCodeInputs>({
    resolver: zodResolver(directorCodeSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });

  const onLoginSubmit = async (data: LoginInputs) => {
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setSnackbar({
        open: true,
        message: "Signed in successfully! Redirecting...",
        success: true,
      });
      setTimeout(() => {
        router.push(redirect || "/admin");
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      const msg =
        err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password" || err?.code === "auth/user-not-found"
          ? "Invalid email or password. Please try again."
          : err?.message || "Sign-in failed. Please try again.";
      setSnackbar({ open: true, message: msg, success: false });
    } finally {
      setLoginLoading(false);
    }
  };

  const onDirectorSubmit = async (data: DirectorCodeInputs) => {
    setDirectorLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (isDirectorCodeValid(data.code)) {
        setDirectorVerified(true);
        setSnackbar({
          open: true,
          message: "Code verified! Redirecting to admin registration...",
          success: true,
        });
        setTimeout(() => {
          router.push("/admin/register");
        }, 900);
      } else {
        setSnackbar({
          open: true,
          message: "Invalid Manager/Director code. Please verify and try again.",
          success: false,
        });
      }
    } finally {
      setDirectorLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Card
          sx={{
            borderRadius: 5,
            border: "1px solid rgba(57,255,20,0.12)",
            bgcolor: "#050505",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(57,255,20,0.06)",
          }}
        >
          <Grid container>
            {/* LEFT PROMO PANEL */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                position: "relative",
                bgcolor: "#090909",
                minHeight: { xs: 320, md: 760 },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at bottom left, rgba(57,255,20,0.18) 0%, transparent 48%), radial-gradient(circle at top right, rgba(57,255,20,0.08) 0%, transparent 38%), linear-gradient(180deg, #060606 0%, #0A0A0A 100%)",
                }}
              />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1600&auto=format&fit=crop"
                alt="Lamah Model"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.28,
                  filter: "contrast(1.05) saturate(1.1)",
                }}
              />
              <Box sx={{ position: "relative", height: "100%", p: { xs: 4, md: 6 } }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 48,
                      position: "relative",
                      mb: { xs: 6, md: 10 },
                    }}
                  >
                    <Image
                      src="/images/lamahhlogo.png"
                      alt="LAMAH CLOTHING CO."
                      fill=""
                      sizes="120px"
                      priority
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                </motion.div>

                <Box sx={{ position: "absolute", left: { md: 48 }, bottom: { md: 80 } }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        fontSize: { xs: "2.5rem", md: "3.75rem" },
                        color: "#FFFFFF",
                        letterSpacing: "0.18em",
                        lineHeight: 0.95,
                        mb: 1,
                      }}
                    >
                      WELCOME TO
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        fontSize: { xs: "2.5rem", md: "3.75rem" },
                        color: "#39FF14",
                        letterSpacing: "0.18em",
                        lineHeight: 0.95,
                        textShadow: "0 0 40px rgba(57,255,20,0.5)",
                        mb: 3,
                      }}
                    >
                      LAMAH CLOTHING CO.
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                        maxWidth: 420,
                        mb: { xs: 4, md: 6 },
                      }}
                    >
                      Control the future of your brand. Run products, orders, customers, and teams — with precision, security, and power.
                    </Typography>

                    <Stack spacing={2.5}>
                      {[
                        {
                          icon: <ShieldCheck size={20} />,
                          t: "Secure & Protected",
                          d: "Enterprise-grade security for your account.",
                        },
                        {
                          icon: <Lock size={20} />,
                          t: "Role-Based Access",
                          d: "Granular permissions for every team member.",
                        },
                      ].map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        >
                          <Stack direction="row" spacing={2.5} alignItems="flex-start">
                            <Box
                              sx={{
                                p: 1.25,
                                borderRadius: 3,
                                bgcolor: "rgba(57,255,20,0.1)",
                                color: "#39FF14",
                                flexShrink: 0,
                                mt: 0.2,
                              }}
                            >
                              {f.icon}
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                  mb: 0.25,
                                }}
                              >
                                {f.t}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#A0A0A0",
                                  fontFamily: "Poppins, sans-serif",
                                  lineHeight: 1.5,
                                }}
                              >
                                {f.d}
                              </Typography>
                            </Box>
                          </Stack>
                        </motion.div>
                      ))}
                    </Stack>
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 20, md: 32 },
                    left: { xs: 32, md: 48 },
                    right: { xs: 32, md: 48 },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      color: "rgba(160,160,160,0.55)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    © 2026 Lamah Clothing Co. All rights reserved.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* RIGHT FORM PANEL */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                bgcolor: "#070707",
                borderLeft: { md: "1px solid rgba(57,255,20,0.08)" },
                p: { xs: 3.5, sm: 6, md: 8 },
              }}
            >
              <Box
                sx={{
                  maxWidth: 560,
                  mx: "auto",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Chip
                      label="ADMIN PORTAL"
                      sx={{
                        bgcolor: "rgba(57,255,20,0.1)",
                        color: "#39FF14",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        border: "1px solid rgba(57,255,20,0.22)",
                        borderRadius: 999,
                      }}
                    />
                    <Button
                      component={Link}
                      href="/"
                      variant="text"
                      size="small"
                      sx={{
                        color: "#A0A0A0",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": { color: "#fff", bgcolor: "transparent" },
                      }}
                    >
                      Back to Store
                      <ArrowRight size={14} style={{ marginLeft: 6 }} />
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      bgcolor: "rgba(57,255,20,0.1)",
                      color: "#39FF14",
                      boxShadow: "0 0 40px rgba(57,255,20,0.2)",
                      mb: 3,
                    }}
                  >
                    <ShieldCheck size={28} />
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      color: "#fff",
                      letterSpacing: "0.12em",
                      mb: 1,
                    }}
                  >
                    ADMIN SIGN IN
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      mb: 5,
                      fontSize: "1.05rem",
                    }}
                  >
                    Enter your credentials to access the Lamah dashboard.
                  </Typography>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  onSubmit={handleLoginSubmit(onLoginSubmit)}
                  noValidate
                >
                  <Stack spacing={3} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      {...loginRegister("email")}
                      error={!!loginErrors.email}
                      helperText={loginErrors.email?.message}
                      InputLabelProps={{
                        sx: {
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} style={{ color: "#39FF14" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          borderRadius: 4,
                          "& fieldset": {
                            borderColor: "rgba(57,255,20,0.12)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(57,255,20,0.3)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#39FF14",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...loginRegister("password")}
                      error={!!loginErrors.password}
                      helperText={loginErrors.password?.message}
                      InputLabelProps={{
                        sx: {
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={18} style={{ color: "#39FF14" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((p) => !p)}
                              edge="end"
                              sx={{ color: "#A0A0A0", "&:hover": { color: "#39FF14" } }}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: "rgba(255,255,255,0.03)",
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          borderRadius: 4,
                          "& fieldset": {
                            borderColor: "rgba(57,255,20,0.12)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(57,255,20,0.3)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#39FF14",
                          },
                        },
                      }}
                    />
                  </Stack>

                  <Button
                    type="submit"
                    disabled={loginLoading}
                    variant="contained"
                    fullWidth
                    startIcon={<LogIn size={18} />}
                    sx={{
                      bgcolor: "#39FF14",
                      color: "#000",
                      borderRadius: 3.5,
                      py: 1.9,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 0 36px rgba(57,255,20,0.3)",
                      mb: 2.5,
                      "&:hover": {
                        bgcolor: "#32e012",
                        boxShadow: "0 0 50px rgba(57,255,20,0.5)",
                      },
                      "&:disabled": {
                        bgcolor: "rgba(57,255,20,0.3)",
                        color: "#000",
                      },
                    }}
                  >
                    {loginLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 6 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                        fontSize: "0.95rem",
                      }}
                    >
                      Forgot password?
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "0.95rem",
                        p: 0,
                        minWidth: 0,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                      onClick={() =>
                        setSnackbar({
                          open: true,
                          message:
                            "Please contact an existing Super Admin to reset your password.",
                          success: false,
                        })
                      }
                    >
                      Request reset
                    </Button>
                  </Stack>
                </motion.form>

                {/* DIRECTOR SIGNUP SECTION */}
                  <Divider sx={{ borderColor: "rgba(57,255,20,0.08)", mb: 5 }}>
                    <Chip
                      label="Manager / Director Access"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.03)",
                        color: "#A0A0A0",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        fontSize: "0.75rem",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 999,
                      }}
                    />
                  </Divider>

                  <Card
                    sx={{
                      borderRadius: 4,
                      border: "1px solid rgba(57,255,20,0.12)",
                      bgcolor: "rgba(57,255,20,0.03)",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: "rgba(57,255,20,0.1)",
                            color: "#39FF14",
                          }}
                        >
                          <ShieldAlert size={22} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              mb: 0.25,
                            }}
                          >
                            Enter Manager / Director Code
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            Create a new admin account if you have an access code.
                          </Typography>
                        </Box>
                      </Stack>

                      <motion.form onSubmit={handleCodeSubmit(onDirectorSubmit)} noValidate>
                        <TextField
                          fullWidth
                          label="Manager / Director Code"
                          autoFocus={false}
                          {...codeRegister("code")}
                          error={!!codeErrors.code}
                          helperText={codeErrors.code?.message}
                          placeholder="LAMAH-XXXX-XXXX"
                          InputLabelProps={{
                            sx: {
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <KeyRound size={18} style={{ color: "#39FF14" }} />
                              </InputAdornment>
                            ),
                            sx: {
                              bgcolor: "rgba(255,255,255,0.03)",
                              color: "#fff",
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              letterSpacing: "0.04em",
                              borderRadius: 4,
                              textTransform: "uppercase",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.14)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(57,255,20,0.35)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#39FF14",
                              },
                            },
                          }}
                          sx={{ mb: 3 }}
                        />
                        <Button
                          type="submit"
                          disabled={directorLoading}
                          variant="outlined"
                          fullWidth
                          endIcon={<ArrowRight size={18} />}
                          sx={{
                            borderRadius: 3.5,
                            color: "#39FF14",
                            borderColor: "rgba(57,255,20,0.35)",
                            py: 1.7,
                            fontFamily: "Bebas Neue, cursive",
                            fontWeight: 500,
                            fontSize: "1.1rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            "&:hover": {
                              borderColor: "#39FF14",
                              bgcolor: "rgba(57,255,20,0.08)",
                              boxShadow: "0 0 30px rgba(57,255,20,0.18)",
                            },
                            "&:disabled": {
                              color: "rgba(57,255,20,0.5)",
                              borderColor: "rgba(57,255,20,0.2)",
                            },
                          }}
                        >
                          {directorLoading ? "Verifying..." : "DIRECTOR SIGNUP"}
                        </Button>
                      </motion.form>
                    </CardContent>
                  </Card>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.success ? "success" : "error"}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.95rem",
            bgcolor: snackbar.success ? "rgba(57,255,20,0.08)" : "rgba(239,68,68,0.08)",
            color: snackbar.success ? "#39FF14" : "#EF4444",
            border: `1px solid ${
              snackbar.success ? "rgba(57,255,20,0.3)" : "rgba(239,68,68,0.3)"
            }`,
            borderRadius: 3,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
