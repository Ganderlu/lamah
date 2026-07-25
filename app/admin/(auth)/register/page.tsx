"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  UserPlus,
  Phone,
  User,
  Shield,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/store/admin";
import type { AdminRole } from "@/types/admin";

const roleOptions: { value: AdminRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "inventory_manager", label: "Inventory Manager" },
  { value: "marketing_manager", label: "Marketing Manager" },
  { value: "customer_support", label: "Customer Support" },
];

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(60, { message: "First name is too long" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(60, { message: "Last name is too long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z
      .string()
      .min(6, { message: "Please enter a valid phone number" })
      .max(20, { message: "Phone number is too long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .max(120),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    role: z.enum(
      ["super_admin", "manager", "director", "inventory_manager", "marketing_manager", "customer_support"],
      { required_error: "Please select a role" }
    ),
    terms: z.boolean({
      required_error: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "You must accept the Terms of Service and Privacy Policy",
    path: ["terms"],
  });

type RegisterInputs = z.infer<typeof registerSchema>;

const features = [
  {
    icon: <Shield size={20} />,
    t: "Secure & Protected",
    d: "Enterprise-grade security for your account.",
  },
  {
    icon: <LayoutDashboard size={20} />,
    t: "Powerful Dashboard",
    d: "Manage your store with insights and ease.",
  },
  {
    icon: <Users size={20} />,
    t: "Team Management",
    d: "Add and manage your team members.",
  },
  {
    icon: <Settings size={20} />,
    t: "Advanced Controls",
    d: "Full control over products, orders, customers and more.",
  },
];

export default function AdminRegisterPage() {
  const router = useRouter();
  const { directorVerified, clearDirectorVerified } = useAdminStore();

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    success: boolean;
  }>({ open: false, message: "", success: true });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "super_admin",
      terms: false,
    },
  });

  const passwordValue = watch("password");
  const roleValue = watch("role");
  const termsValue = watch("terms");
  const passwordStrength = useMemo(() => {
    const pw = passwordValue;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s += 1;
    if (/[0-9]/.test(pw)) s += 1;
    if (/[^A-Za-z0-9]/.test(pw)) s += 1;
    return s;
  }, [passwordValue]);

  /* Security Guard: redirect unauthenticated visitors back to login */
  useEffect(() => {
    if (!directorVerified) {
      router.replace("/admin/login");
    }
  }, [directorVerified, router]);

  if (!directorVerified) {
    return null;
  }

  const onSubmit = async (data: RegisterInputs) => {
    setSubmitting(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCred.user.uid;

      const adminsRef = doc(db, "admins", uid);
      const existing = await getDoc(adminsRef);
      if (existing.exists()) {
        // Unlikely, since Firebase auth would throw if email exists, but guard Firestore.
        throw new Error("An admin profile already exists for this account.");
      }

      const nowISO = new Date().toISOString();

      await setDoc(adminsRef, {
        uid,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        role: data.role,
        status: "active",
        profileImage: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdAtISO: nowISO,
        updatedAtISO: nowISO,
      });

      clearDirectorVerified();

      setSnackbar({
        open: true,
        message: "Admin account created successfully! Redirecting to login...",
        success: true,
      });

      try {
        await auth.signOut();
      } catch (_) {}

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1400);
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg = err?.message || "Failed to create admin account. Please try again.";
      if (err?.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in instead.";
      } else if (err?.code === "auth/operation-not-allowed") {
        msg = "Email sign-ups are not currently enabled.";
      } else if (err?.code === "auth/weak-password") {
        msg = "Please choose a stronger password.";
      }
      setSnackbar({ open: true, message: msg, success: false });
    } finally {
      setSubmitting(false);
    }
  };

  const pwColor =
    passwordStrength === 0
      ? "rgba(160,160,160,0.4)"
      : passwordStrength === 1
      ? "#EF4444"
      : passwordStrength === 2
      ? "#F59E0B"
      : passwordStrength === 3
      ? "#3B82F6"
      : "#39FF14";
  const pwLabel =
    passwordStrength === 0
      ? ""
      : passwordStrength === 1
      ? "Weak"
      : passwordStrength === 2
      ? "Fair"
      : passwordStrength === 3
      ? "Good"
      : "Strong";

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
                minHeight: { xs: 360, md: 880 },
                order: { xs: 1, md: 1 },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at bottom left, rgba(57,255,20,0.2) 0%, transparent 50%), radial-gradient(circle at top right, rgba(57,255,20,0.08) 0%, transparent 38%), linear-gradient(180deg, #060606 0%, #0A0A0A 100%)",
                }}
              />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop"
                alt="Lamah Model"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: 0.22,
                  filter: "contrast(1.05) saturate(1.1) brightness(0.92)",
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  p: { xs: 4, md: 6 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
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

                <Box>
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
                      Create your admin account and start managing your store with power and precision.
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                  >
                    <Stack spacing={2.5}>
                      {features.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
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

                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    color: "rgba(160,160,160,0.55)",
                    letterSpacing: "0.04em",
                    mt: 4,
                  }}
                >
                  © 2026 Lamah Clothing Co. All rights reserved.
                </Typography>
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
                order: { xs: 2, md: 2 },
              }}
            >
              <Box
                sx={{
                  maxWidth: 600,
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
                      fontSize: { xs: "2.25rem", md: "2.75rem" },
                      color: "#fff",
                      letterSpacing: "0.12em",
                      mb: 1,
                    }}
                  >
                    CREATE ADMIN ACCOUNT
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      mb: 5,
                      fontSize: "1.05rem",
                    }}
                  >
                    Fill in your details to get started.
                  </Typography>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <Stack spacing={3}>
                    {/* First / Last Name */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          autoComplete="given-name"
                          {...register("firstName")}
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          InputLabelProps={{
                            sx: {
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <User size={18} style={{ color: "#39FF14" }} />
                              </InputAdornment>
                            ),
                            sx: inputSx,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          autoComplete="family-name"
                          {...register("lastName")}
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          InputLabelProps={{
                            sx: {
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <User size={18} style={{ color: "#39FF14" }} />
                              </InputAdornment>
                            ),
                            sx: inputSx,
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Email */}
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
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
                        sx: inputSx,
                      }}
                    />

                    {/* Phone */}
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      autoComplete="tel"
                      {...register("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputLabelProps={{
                        sx: {
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={18} style={{ color: "#39FF14" }} />
                          </InputAdornment>
                        ),
                        sx: inputSx,
                      }}
                    />

                    {/* Password + Confirm */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type={showPw ? "text" : "password"}
                          autoComplete="new-password"
                          {...register("password")}
                          error={!!errors.password}
                          helperText={errors.password?.message}
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
                                  onClick={() => setShowPw((p) => !p)}
                                  edge="end"
                                  sx={{
                                    color: "#A0A0A0",
                                    "&:hover": { color: "#39FF14" },
                                  }}
                                  tabIndex={-1}
                                >
                                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: inputSx,
                          }}
                        />
                        {/* Strength */}
                        <Box sx={{ mt: 1.25, px: 0.5 }}>
                          <Stack direction="row" spacing={1} sx={{ mb: 0.75 }}>
                            {[0, 1, 2, 3].map((i) => (
                              <Box
                                key={i}
                                sx={{
                                  flex: 1,
                                  height: 4,
                                  borderRadius: 999,
                                  bgcolor:
                                    passwordStrength > i ? pwColor : "rgba(160,160,160,0.2)",
                                  transition: "all 0.2s ease",
                                }}
                              />
                            ))}
                          </Stack>
                          {pwLabel && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                color: pwColor,
                                letterSpacing: "0.04em",
                              }}
                            >
                              {pwLabel}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type={showConfirmPw ? "text" : "password"}
                          autoComplete="new-password"
                          {...register("confirmPassword")}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
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
                                  onClick={() => setShowConfirmPw((p) => !p)}
                                  edge="end"
                                  sx={{
                                    color: "#A0A0A0",
                                    "&:hover": { color: "#39FF14" },
                                  }}
                                  tabIndex={-1}
                                >
                                  {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: inputSx,
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Role */}
                    <TextField
                      select
                      fullWidth
                      label="Role"
                      value={roleValue ?? ""}
                      {...register("role")}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      InputLabelProps={{
                        sx: {
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        },
                      }}
                      SelectProps={{
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
                          "& .MuiSelect-icon": {
                            color: "#39FF14",
                          },
                        },
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "#0F0F0F",
                              borderRadius: 3,
                              border: "1px solid rgba(57,255,20,0.15)",
                              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                              mt: 1,
                              "& .MuiMenuItem-root": {
                                fontFamily: "Poppins, sans-serif",
                                color: "#fff",
                                py: 1.5,
                                px: 2.5,
                                borderRadius: 2,
                                mx: 0.5,
                                my: 0.25,
                                "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                                  bgcolor: "rgba(57,255,20,0.1)",
                                  color: "#39FF14",
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {roleOptions.map((r) => (
                        <MenuItem key={r.value} value={r.value}>
                          {r.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    {/* Terms */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!termsValue}
                            {...register("terms")}
                            sx={{
                              color: "rgba(57,255,20,0.4)",
                              "&.Mui-checked": {
                                color: "#39FF14",
                              },
                              "& .MuiSvgIcon-root": {
                                borderRadius: 1.5,
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#A0A0A0",
                              fontSize: "0.95rem",
                              lineHeight: 1.6,
                            }}
                          >
                            I agree to the{" "}
                            <span style={{ color: "#39FF14", fontWeight: 600 }}>
                              Terms of Service
                            </span>{" "}
                            and{" "}
                            <span style={{ color: "#39FF14", fontWeight: 600 }}>
                              Privacy Policy
                            </span>
                            .
                          </Typography>
                        }
                        sx={{ m: 0 }}
                      />
                      {errors.terms && (
                        <FormHelperText
                          error
                          sx={{
                            ml: 4.5,
                            mt: 0.5,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.8rem",
                          }}
                        >
                          {errors.terms.message}
                        </FormHelperText>
                      )}
                    </Box>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      variant="contained"
                      fullWidth
                      startIcon={<UserPlus size={20} />}
                      sx={{
                        bgcolor: "#39FF14",
                        color: "#000",
                        borderRadius: 3.5,
                        py: 2,
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        textTransform: "none",
                        boxShadow: "0 0 36px rgba(57,255,20,0.3)",
                        mt: 1,
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
                      {submitting ? "Creating Account..." : "Create Admin Account"}
                    </Button>

                    {/* Sign In */}
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          fontSize: "0.98rem",
                        }}
                      >
                        Already have an account?
                      </Typography>
                      <Button
                        component={Link}
                        href="/admin/login"
                        variant="text"
                        sx={{
                          color: "#39FF14",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "0.98rem",
                          p: 0,
                          minWidth: 0,
                          "&:hover": { bgcolor: "transparent" },
                        }}
                      >
                        Sign In
                      </Button>
                    </Stack>
                  </Stack>
                </motion.form>
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

const inputSx = {
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
};
