"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2 as Grid,
  Tabs,
  Tab,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  Camera,
  User,
  ShieldCheck,
  Download,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Globe,
  DollarSign,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import { useAuthStore } from "@/lib/store/auth";
import { auth } from "@/firebase/client";
import { fetchUserProfile, updateUserProfile } from "@/lib/users";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import type { AuthUserProfile } from "@/lib/store/auth";

type ActiveTab =
  | "profile"
  | "security"
  | "password"
  | "notifications"
  | "privacy"
  | "connected";

export default function AccountSettingsPage() {
  const { profile, setProfile } = useAuthStore();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    photoURL: "",
  });

  const [preferencesForm, setPreferencesForm] = useState({
    language: "en",
    currency: "USD",
  });

  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        try {
          const fetchedProfile = await fetchUserProfile(user.uid);
          if (fetchedProfile) {
            setProfile(fetchedProfile);
            setProfileForm({
              firstName: fetchedProfile.firstName || "",
              lastName: fetchedProfile.lastName || "",
              email: fetchedProfile.email || user.email || "",
              phone: fetchedProfile.phone || "",
              dateOfBirth: "",
              gender: fetchedProfile.gender || "",
              photoURL: fetchedProfile.photoURL || "",
            });
          } else {
            const displayName = user.displayName?.split(" ") || ["", ""];
            setProfileForm({
              firstName: displayName[0] || "",
              lastName: displayName[1] || "",
              email: user.email || "",
              phone: "",
              dateOfBirth: "",
              gender: "",
              photoURL: user.photoURL || "",
            });
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user?.uid, setProfile]);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        gender: profileForm.gender,
        photoURL: profileForm.photoURL,
      } as AuthUserProfile;

      await updateUserProfile(user.uid, {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        gender: profileForm.gender,
        photoURL: profileForm.photoURL,
      });

      setProfile(updatedProfile);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (result: any) => {
    setUploadingImage(true);
    try {
      const imageUrl = result.info.secure_url;
      setProfileForm((prev) => ({ ...prev, photoURL: imageUrl }));
      setSnackbar({
        open: true,
        message: "Profile image uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to upload image. Please try again.",
        severity: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const tabLabels: { [key in ActiveTab]: string } = {
    profile: "Profile Information",
    security: "Security",
    password: "Password",
    notifications: "Notifications",
    privacy: "Privacy",
    connected: "Connected Accounts",
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Bebas Neue, sans-serif",
              color: "#fff",
              mb: 1,
            }}
          >
            Account Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Manage your account information and security settings.
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box
          sx={{
            mb: 4,
            borderBottom: 1,
            borderColor: "rgba(57,255,20,0.15)",
            bgcolor: "#090909",
            borderRadius: "18px",
            px: 2,
            overflowX: "auto",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue as ActiveTab)}
            sx={{
              "& .MuiTabs-indicator": {
                bgcolor: "#39FF14",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                color: "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.875rem",
                py: 2,
                "&.Mui-selected": {
                  color: "#39FF14",
                  fontWeight: 700,
                },
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {(Object.keys(tabLabels) as ActiveTab[]).map((tab) => (
              <Tab key={tab} label={tabLabels[tab]} value={tab} />
            ))}
          </Tabs>
        </Box>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === "profile" && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <User size={24} color="#39FF14" />
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Profile Information
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Update your personal information and how others see you.
                      </Typography>
                    </Box>
                  </Box>

                  {loading ? (
                    <>
                      <Box sx={{ display: "flex", mb: 4, justifyContent: "center" }}>
                        <Skeleton variant="circular" width={120} height={120} />
                      </Box>
                      <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
                      <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
                      <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
                      <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mb: 4,
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={profileForm.photoURL}
                            sx={{
                              width: 120,
                              height: 120,
                              border: "3px solid #39FF14",
                              boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                              bgcolor: "#090909",
                              color: "#fff",
                            }}
                          >
                            <User size={48} />
                          </Avatar>
                          <CldUploadWidget
                            uploadPreset={
                              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                            }
                            options={{
                              folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
                            }}
                            onSuccess={handleImageUpload}
                          >
                            {({ open }) => (
                              <IconButton
                                onClick={() => open()}
                                disabled={uploadingImage}
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                  bgcolor: "#39FF14",
                                  color: "#000",
                                  "&:hover": {
                                    bgcolor: "#2dd610",
                                  },
                                  "&.Mui-disabled": {
                                    bgcolor: "rgba(57,255,20,0.3)",
                                  },
                                }}
                              >
                                <Camera size={16} />
                              </IconButton>
                            )}
                          </CldUploadWidget>
                        </Box>
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {profileForm.firstName} {profileForm.lastName}
                          </Typography>
                          <Chip
                    label={profile?.membershipLevel || "Silver Member"}
                    sx={{
                      mt: 1,
                      bgcolor: "rgba(57,255,20,0.1)",
                      color: "#39FF14",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  />
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="First Name"
                            fullWidth
                            value={profileForm.firstName}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                firstName: e.target.value,
                              })
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#39FF14",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#39FF14",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#39FF14",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Last Name"
                            fullWidth
                            value={profileForm.lastName}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                lastName: e.target.value,
                              })
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#39FF14",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#39FF14",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#39FF14",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Email Address"
                            fullWidth
                            value={profileForm.email}
                            disabled
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Phone Number"
                            fullWidth
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                phone: e.target.value,
                              })
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#39FF14",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#39FF14",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#39FF14",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            value={profileForm.dateOfBirth}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                dateOfBirth: e.target.value,
                              })
                            }
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#39FF14",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#39FF14",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#39FF14",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel
                              sx={{
                                color: "#A0A0A0",
                                "&.Mui-focused": { color: "#39FF14" },
                              }}
                            >
                              Gender
                            </InputLabel>
                            <Select
                              value={profileForm.gender}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  gender: e.target.value,
                                })
                              }
                              label="Gender"
                              sx={{
                                color: "#fff",
                                bgcolor: "#090909",
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.15)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#39FF14",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#39FF14",
                                },
                                ".MuiSvgIcon-root": { color: "#fff" },
                              }}
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                              <MenuItem value="prefer-not-to-say">
                                Prefer not to say
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="contained"
                          onClick={handleSaveProfile}
                          disabled={saving}
                          startIcon={!saving && <CheckCircle2 size={16} />}
                          sx={{
                            bgcolor: "#39FF14",
                            color: "#000",
                            fontWeight: 700,
                            fontFamily: "Poppins, sans-serif",
                            borderRadius: "12px",
                            px: 4,
                            py: 1.5,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#2dd610",
                              boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                            },
                            "&.Mui-disabled": {
                              bgcolor: "rgba(57,255,20,0.3)",
                            },
                          }}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card
                sx={{
                  mt: 3,
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <SettingsIcon size={24} color="#39FF14" />
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Account Preferences
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Manage your language, currency and other preferences.
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          sx={{
                            color: "#A0A0A0",
                            "&.Mui-focused": { color: "#39FF14" },
                          }}
                        >
                          Language
                        </InputLabel>
                        <Select
                          value={preferencesForm.language}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              language: e.target.value,
                            })
                          }
                          label="Language"
                          sx={{
                            color: "#fff",
                            bgcolor: "#090909",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(57,255,20,0.15)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#39FF14",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#39FF14",
                            },
                            ".MuiSvgIcon-root": { color: "#fff" },
                          }}
                          startAdornment={
                            <Globe size={20} style={{ marginRight: 8, color: "#A0A0A0" }} />
                          }
                        >
                          <MenuItem value="en">English (US)</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                          <MenuItem value="fr">Français</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          sx={{
                            color: "#A0A0A0",
                            "&.Mui-focused": { color: "#39FF14" },
                          }}
                        >
                          Currency
                        </InputLabel>
                        <Select
                          value={preferencesForm.currency}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              currency: e.target.value,
                            })
                          }
                          label="Currency"
                          sx={{
                            color: "#fff",
                            bgcolor: "#090909",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(57,255,20,0.15)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#39FF14",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#39FF14",
                            },
                            ".MuiSvgIcon-root": { color: "#fff" },
                          }}
                          startAdornment={
                            <DollarSign size={20} style={{ marginRight: 8, color: "#A0A0A0" }} />
                          }
                        >
                          <MenuItem value="USD">USD ($)</MenuItem>
                          <MenuItem value="EUR">EUR (€)</MenuItem>
                          <MenuItem value="GBP">GBP (£)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <ShieldCheck size={24} color="#39FF14" />
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Account Summary
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Your account overview and status.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Membership Level
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle2 size={16} color="#39FF14" />
                        <Typography
                          sx={{
                            color: "#39FF14",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                          }}
                        >
                          {profile?.membershipLevel || "Silver Member"}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ borderColor: "rgba(57,255,20,0.15)" }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Total Orders
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        0 {/* TODO: Fetch from orders collection */}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: "rgba(57,255,20,0.15)" }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Wishlist Items
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        0 {/* TODO: Fetch from wishlist */}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: "rgba(57,255,20,0.15)" }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Reward Points
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {profile?.rewardPoints || 0}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: "rgba(57,255,20,0.15)" }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Account Status
                      </Typography>
                      <Chip
                        label="Active"
                        sx={{
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  mt: 3,
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <ZapIcon size={24} color="#39FF14" />
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Quick Actions
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Manage your account preferences.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      fullWidth
                      startIcon={<Download size={18} />}
                      sx={{
                        justifyContent: "space-between",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        py: 1.5,
                        textTransform: "none",
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "rgba(57,255,20,0.05)",
                        },
                      }}
                      endIcon={<ChevronRight size={18} />}
                    >
                      Download My Data
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<FileText size={18} />}
                      sx={{
                        justifyContent: "space-between",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        py: 1.5,
                        textTransform: "none",
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "rgba(57,255,20,0.05)",
                        },
                      }}
                      endIcon={<ChevronRight size={18} />}
                    >
                      Export Purchase History
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<LogOut size={18} />}
                      sx={{
                        justifyContent: "space-between",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        py: 1.5,
                        textTransform: "none",
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "rgba(57,255,20,0.05)",
                        },
                      }}
                      endIcon={<ChevronRight size={18} />}
                    >
                      Deactivate Account
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<Trash2 size={18} />}
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{
                        justifyContent: "space-between",
                        color: "#EF4444",
                        fontFamily: "Poppins, sans-serif",
                        py: 1.5,
                        textTransform: "none",
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "rgba(239,68,68,0.05)",
                        },
                      }}
                      endIcon={<ChevronRight size={18} />}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </motion.div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#090909",
            borderRadius: "18px",
            border: "1px solid rgba(57,255,20,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Bebas Neue, sans-serif",
            color: "#fff",
            fontSize: "1.75rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AlertCircle size={24} color="#EF4444" />
          Delete Account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            This action cannot be undone. All your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              borderRadius: "12px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            bgcolor: "#111111",
            color: "#fff",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            "& .MuiAlert-icon": {
              color: snackbar.severity === "success" ? "#39FF14" : "#EF4444",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
