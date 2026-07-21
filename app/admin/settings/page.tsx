
"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Save,
  Settings as SettingsIcon,
  Store,
  CreditCard,
  Truck,
  FileText,
  Bell,
  Shield,
  Key,
  Monitor,
  RefreshCw,
  Copy,
  CheckCircle2,
  Home,
  Upload,
  Trash2,
  Cloud,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Settings } from "@/types/settings";
import { fetchSettings, updateSettings, defaultSettings } from "@/lib/settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [copiedKeys, setCopiedKeys] = useState<string[]>([]);
  const [showKeys, setShowKeys] = useState<string[]>([]);

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const settingsData = await fetchSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading settings: ", error);
      setSnackbar({
        open: true,
        message: "Failed to load settings",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle copy to clipboard
  const handleCopy = async (text: string, keyId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKeys([...copiedKeys, keyId]);
    setTimeout(() => {
      setCopiedKeys((prev) => prev.filter((k) => k !== keyId));
    }, 2000);
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      await updateSettings(settings.id, settings);
      setSnackbar({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving settings: ", error);
      setSnackbar({
        open: true,
        message: "Failed to save settings",
        severity: "error",
      });
    }
  };

  // Handle input change
  const handleChange = (
    field: keyof Settings | string,
    value: any,
    parent?: string
  ) => {
    if (parent) {
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [field]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Toggle key visibility
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) =>
      prev.includes(keyId) ? prev.filter((k) => k !== keyId) : [...prev, keyId]
    );
  };

  return (
    <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%", overflowX: "hidden" }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                letterSpacing: "0.1em",
                mb: 1,
              }}
            >
              Settings
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#A0A0A0" }}>›</Typography>
              <Typography
                sx={{
                  color: "#39FF14",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                Settings
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={16} />}
              onClick={loadData}
              sx={{
                borderColor: "rgba(57,255,20,0.3)",
                color: "#39FF14",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  borderColor: "#39FF14",
                  bgcolor: "rgba(57,255,20,0.05)",
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSave}
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#2dd610",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </motion.div>

      {loading ? (
        <Box sx={{ p: 8, textAlign: "center" }}>
          <CircularProgress sx={{ color: "#39FF14" }} />
        </Box>
      ) : (
        <>
          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card
              sx={{
                background: "#111111",
                border: "1px solid rgba(57,255,20,0.15)",
                borderRadius: 3,
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#39FF14",
                    },
                    "& .MuiTab-root": {
                      color: "#A0A0A0",
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      "&.Mui-selected": {
                        color: "#39FF14",
                      },
                    },
                  }}
                >
                  <Tab
                    icon={<SettingsIcon size={18} />}
                    iconPosition="start"
                    label="General"
                  />
                  <Tab
                    icon={<Store size={18} />}
                    iconPosition="start"
                    label="Store Information"
                  />
                  <Tab
                    icon={<CreditCard size={18} />}
                    iconPosition="start"
                    label="Payment"
                  />
                  <Tab
                    icon={<Truck size={18} />}
                    iconPosition="start"
                    label="Shipping"
                  />
                  <Tab
                    icon={<FileText size={18} />}
                    iconPosition="start"
                    label="Tax"
                  />
                  <Tab
                    icon={<Bell size={18} />}
                    iconPosition="start"
                    label="Notifications"
                  />
                  <Tab
                    icon={<Shield size={18} />}
                    iconPosition="start"
                    label="Security"
                  />
                  <Tab
                    icon={<Key size={18} />}
                    iconPosition="start"
                    label="API Keys"
                  />
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Content */}
          <Box sx={{ mt: 4 }}>
            {/* General Settings */}
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Card
                      sx={{
                        background: "#111111",
                        border: "1px solid rgba(57,255,20,0.15)",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              fontFamily: "Poppins, sans-serif",
                              mb: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SettingsIcon size={20} color="#39FF14" />
                              General Settings
                            </Box>
                          </Typography>
                          <Typography
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.875rem",
                            }}
                          >
                            Update your store preferences and configurations.
                          </Typography>
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Store Name"
                              value={settings.storeName}
                              onChange={(e) => handleChange("storeName", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "rgba(57,255,20,0.4)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#39FF14",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Store Email"
                              value={settings.storeEmail}
                              onChange={(e) => handleChange("storeEmail", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Support Email"
                              value={settings.supportEmail}
                              onChange={(e) => handleChange("supportEmail", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={settings.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ color: "#A0A0A0" }}>Currency</InputLabel>
                              <Select
                                value={settings.currency}
                                onChange={(e) => handleChange("currency", e.target.value)}
                                sx={{
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                }}
                              >
                                <MenuItem value="NGN">NGN - Nigerian Naira</MenuItem>
                                <MenuItem value="USD">USD - US Dollar</MenuItem>
                                <MenuItem value="EUR">EUR - Euro</MenuItem>
                                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ color: "#A0A0A0" }}>Timezone</InputLabel>
                              <Select
                                value={settings.timezone}
                                onChange={(e) => handleChange("timezone", e.target.value)}
                                sx={{
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                }}
                              >
                                <MenuItem value="Africa/Lagos">Africa/Lagos (UTC+1)</MenuItem>
                                <MenuItem value="America/New_York">America/New_York (UTC-5)</MenuItem>
                                <MenuItem value="Europe/London">Europe/London (UTC+0)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ color: "#A0A0A0" }}>Language</InputLabel>
                              <Select
                                value={settings.language}
                                onChange={(e) => handleChange("language", e.target.value)}
                                sx={{
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                }}
                              >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Store Description"
                              value={settings.description}
                              onChange={(e) => handleChange("description", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        background: "#111111",
                        border: "1px solid rgba(57,255,20,0.15)",
                        borderRadius: 3,
                        mb: 4,
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            mb: 2,
                          }}
                        >
                          Store Logo
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Avatar
                            src={settings.logo || "/images/lamahwhiteb.png"}
                            sx={{
                              width: 150,
                              height: 150,
                              bgcolor: "rgba(57,255,20,0.1)",
                              border: "2px dashed rgba(57,255,20,0.3)",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<Upload size={16} />}
                              sx={{
                                borderColor: "rgba(57,255,20,0.3)",
                                color: "#39FF14",
                                textTransform: "none",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              Change Logo
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Trash2 size={16} />}
                              sx={{
                                borderColor: "rgba(239,68,68,0.3)",
                                color: "#EF4444",
                                textTransform: "none",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        background: "#111111",
                        border: "1px solid rgba(57,255,20,0.15)",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            mb: 3,
                          }}
                        >
                          Maintenance Mode
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={false}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Enable maintenance mode to restrict store access"
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Store Information */}
            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Store size={20} color="#39FF14" />
                          Store Information
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Manage your store's address, legal, and social media information.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Store Address"
                          value={settings.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={settings.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="State"
                          value={settings.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={settings.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={settings.postalCode}
                          onChange={(e) => handleChange("postalCode", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Business Registration Number"
                          value={settings.businessNumber}
                          onChange={(e) => handleChange("businessNumber", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="VAT Number"
                          value={settings.vatNumber}
                          onChange={(e) => handleChange("vatNumber", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Website URL"
                          value={settings.websiteUrl}
                          onChange={(e) => handleChange("websiteUrl", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 3 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            mb: 3,
                          }}
                        >
                          Social Media Links
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Facebook"
                          value={settings.facebook}
                          onChange={(e) => handleChange("facebook", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Instagram"
                          value={settings.instagram}
                          onChange={(e) => handleChange("instagram", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="TikTok"
                          value={settings.tiktok}
                          onChange={(e) => handleChange("tiktok", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="YouTube"
                          value={settings.youtube}
                          onChange={(e) => handleChange("youtube", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Twitter"
                          value={settings.twitter}
                          onChange={(e) => handleChange("twitter", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Settings */}
            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CreditCard size={20} color="#39FF14" />
                          Payment Gateways
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Manage which payment methods are available on your store.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.paymentSettings.stripe}
                              onChange={(e) =>
                                handleChange("stripe", e.target.checked, "paymentSettings")
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Stripe"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.paymentSettings.flutterwave}
                              onChange={(e) =>
                                handleChange("flutterwave", e.target.checked, "paymentSettings")
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Flutterwave"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.paymentSettings.paystack}
                              onChange={(e) =>
                                handleChange("paystack", e.target.checked, "paymentSettings")
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Paystack"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.paymentSettings.paypal}
                              onChange={(e) =>
                                handleChange("paypal", e.target.checked, "paymentSettings")
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="PayPal"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.paymentSettings.cashOnDelivery}
                              onChange={(e) =>
                                handleChange(
                                  "cashOnDelivery",
                                  e.target.checked,
                                  "paymentSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Cash on Delivery"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Shipping Settings */}
            {activeTab === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Truck size={20} color="#39FF14" />
                          Shipping Settings
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Configure shipping costs, free shipping thresholds, and delivery options.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Default Shipping Fee"
                          type="number"
                          value={settings.shippingSettings.defaultShippingFee}
                          onChange={(e) =>
                            handleChange(
                              "defaultShippingFee",
                              Number(e.target.value),
                              "shippingSettings"
                            )
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Free Shipping Threshold"
                          type="number"
                          value={settings.shippingSettings.freeShippingThreshold}
                          onChange={(e) =>
                            handleChange(
                              "freeShippingThreshold",
                              Number(e.target.value),
                              "shippingSettings"
                            )
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Estimated Delivery Time"
                          value={settings.shippingSettings.estimatedDelivery}
                          onChange={(e) =>
                            handleChange(
                              "estimatedDelivery",
                              e.target.value,
                              "shippingSettings"
                            )
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.shippingSettings.enablePickup}
                              onChange={(e) =>
                                handleChange(
                                  "enablePickup",
                                  e.target.checked,
                                  "shippingSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Enable Pickup"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.shippingSettings.enableDelivery}
                              onChange={(e) =>
                                handleChange(
                                  "enableDelivery",
                                  e.target.checked,
                                  "shippingSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Enable Delivery"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 3,
                        }}
                      >
                        Courier Services
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.shippingSettings.courierServices.dhl}
                                onChange={(e) =>
                                  handleChange(
                                    "dhl",
                                    e.target.checked,
                                    "shippingSettings.courierServices"
                                  )
                                }
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#39FF14",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: "#39FF14",
                                  },
                                }}
                              />
                            }
                            label="DHL"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.shippingSettings.courierServices.fedex}
                                onChange={(e) =>
                                  handleChange(
                                    "fedex",
                                    e.target.checked,
                                    "shippingSettings.courierServices"
                                  )
                                }
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#39FF14",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: "#39FF14",
                                  },
                                }}
                              />
                            }
                            label="FedEx"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.shippingSettings.courierServices.ups}
                                onChange={(e) =>
                                  handleChange(
                                    "ups",
                                    e.target.checked,
                                    "shippingSettings.courierServices"
                                  )
                                }
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#39FF14",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: "#39FF14",
                                  },
                                }}
                              />
                            }
                            label="UPS"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.shippingSettings.courierServices.gigLogistics}
                                onChange={(e) =>
                                  handleChange(
                                    "gigLogistics",
                                    e.target.checked,
                                    "shippingSettings.courierServices"
                                  )
                                }
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#39FF14",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: "#39FF14",
                                  },
                                }}
                              />
                            }
                            label="GIG Logistics"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tax Settings */}
            {activeTab === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FileText size={20} color="#39FF14" />
                          Tax Settings
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Configure tax rates and VAT settings for your store.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.taxSettings.enableTax}
                              onChange={(e) =>
                                handleChange("enableTax", e.target.checked, "taxSettings")
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Enable Tax Calculation"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Tax Percentage (%)"
                          type="number"
                          value={settings.taxSettings.taxPercentage}
                          onChange={(e) =>
                            handleChange(
                              "taxPercentage",
                              Number(e.target.value),
                              "taxSettings"
                            )
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="VAT Percentage (%)"
                          type="number"
                          value={settings.taxSettings.vat}
                          onChange={(e) =>
                            handleChange("vat", Number(e.target.value), "taxSettings")
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Country Tax Rules"
                          value={settings.taxSettings.countryTaxRules}
                          onChange={(e) =>
                            handleChange("countryTaxRules", e.target.value, "taxSettings")
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Bell size={20} color="#39FF14" />
                          Notification Settings
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Choose which notifications you want to receive.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notificationSettings.emailNotifications}
                              onChange={(e) =>
                                handleChange(
                                  "emailNotifications",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Email Notifications"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notificationSettings.smsNotifications}
                              onChange={(e) =>
                                handleChange(
                                  "smsNotifications",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="SMS Notifications"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notificationSettings.orderNotifications}
                              onChange={(e) =>
                                handleChange(
                                  "orderNotifications",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Order Notifications"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notificationSettings.lowStockAlerts}
                              onChange={(e) =>
                                handleChange(
                                  "lowStockAlerts",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Low Stock Alerts"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                settings.notificationSettings.customerRegistrationAlerts
                              }
                              onChange={(e) =>
                                handleChange(
                                  "customerRegistrationAlerts",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Customer Registration Alerts"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                settings.notificationSettings.newsletterNotifications
                              }
                              onChange={(e) =>
                                handleChange(
                                  "newsletterNotifications",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Newsletter Notifications"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notificationSettings.adminLoginAlerts}
                              onChange={(e) =>
                                handleChange(
                                  "adminLoginAlerts",
                                  e.target.checked,
                                  "notificationSettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Admin Login Alerts"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Shield size={20} color="#39FF14" />
                          Security Settings
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Manage your account security preferences.
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securitySettings.twoFactorAuth}
                              onChange={(e) =>
                                handleChange(
                                  "twoFactorAuth",
                                  e.target.checked,
                                  "securitySettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Enable Two-Factor Authentication"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Session Timeout (minutes)"
                          type="number"
                          value={settings.securitySettings.sessionTimeout}
                          onChange={(e) =>
                            handleChange(
                              "sessionTimeout",
                              Number(e.target.value),
                              "securitySettings"
                            )
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securitySettings.deviceManagement}
                              onChange={(e) =>
                                handleChange(
                                  "deviceManagement",
                                  e.target.checked,
                                  "securitySettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Device Management"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securitySettings.loginHistory}
                              onChange={(e) =>
                                handleChange(
                                  "loginHistory",
                                  e.target.checked,
                                  "securitySettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Login History"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securitySettings.backupAuthCodes}
                              onChange={(e) =>
                                handleChange(
                                  "backupAuthCodes",
                                  e.target.checked,
                                  "securitySettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Backup Authentication Codes"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securitySettings.securityLogs}
                              onChange={(e) =>
                                handleChange(
                                  "securityLogs",
                                  e.target.checked,
                                  "securitySettings"
                                )
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#39FF14",
                                },
                              }}
                            />
                          }
                          label="Security Logs"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 3 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            mb: 3,
                          }}
                        >
                          Change Admin Password
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type="password"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              bgcolor: "rgba(5,5,5,0.5)",
                              "& fieldset": {
                                borderColor: "rgba(57,255,20,0.2)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#A0A0A0",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* API Keys Settings */}
            {activeTab === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Key size={20} color="#39FF14" />
                          API Keys & Integrations
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        Manage your API keys and integration credentials.
                      </Typography>
                    </Box>

                    {/* Cloudinary Section */}
                    <Box sx={{ mb: 6 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Cloud size={18} color="#39FF14" />
                        Cloudinary
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Cloud Name"
                            value={settings.apiKeys.cloudinary.cloudName}
                            onChange={(e) =>
                              handleChange(
                                "cloudName",
                                e.target.value,
                                "apiKeys.cloudinary"
                              )
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                bgcolor: "rgba(5,5,5,0.5)",
                                "& fieldset": {
                                  borderColor: "rgba(57,255,20,0.2)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#A0A0A0",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              label="API Key"
                              type={showKeys.includes("cloudinaryApiKey") ? "text" : "password"}
                              value={settings.apiKeys.cloudinary.apiKey}
                              onChange={(e) =>
                                handleChange(
                                  "apiKey",
                                  e.target.value,
                                  "apiKeys.cloudinary"
                                )
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() =>
                                toggleKeyVisibility("cloudinaryApiKey")
                              }
                              sx={{ color: "#A0A0A0" }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                            <Tooltip title="Copy">
                              <IconButton
                                onClick={() =>
                                  handleCopy(
                                    settings.apiKeys.cloudinary.apiKey,
                                    "cloudinaryApiKey"
                                  )
                                }
                                sx={{ color: "#A0A0A0" }}
                              >
                                {copiedKeys.includes("cloudinaryApiKey") ? (
                                  <CheckCircle size={18} color="#39FF14" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              label="API Secret"
                              type={showKeys.includes("cloudinaryApiSecret") ? "text" : "password"}
                              value={settings.apiKeys.cloudinary.apiSecret}
                              onChange={(e) =>
                                handleChange(
                                  "apiSecret",
                                  e.target.value,
                                  "apiKeys.cloudinary"
                                )
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() =>
                                toggleKeyVisibility("cloudinaryApiSecret")
                              }
                              sx={{ color: "#A0A0A0" }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                            <Tooltip title="Copy">
                              <IconButton
                                onClick={() =>
                                  handleCopy(
                                    settings.apiKeys.cloudinary.apiSecret,
                                    "cloudinaryApiSecret"
                                  )
                                }
                                sx={{ color: "#A0A0A0" }}
                              >
                                {copiedKeys.includes("cloudinaryApiSecret") ? (
                                  <CheckCircle size={18} color="#39FF14" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Stripe Section */}
                    <Box sx={{ mb: 6 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CreditCard size={18} color="#39FF14" />
                        Stripe
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              label="Public Key"
                              type={showKeys.includes("stripePublicKey") ? "text" : "password"}
                              value={settings.apiKeys.stripe.publicKey}
                              onChange={(e) =>
                                handleChange(
                                  "publicKey",
                                  e.target.value,
                                  "apiKeys.stripe"
                                )
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() =>
                                toggleKeyVisibility("stripePublicKey")
                              }
                              sx={{ color: "#A0A0A0" }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                            <Tooltip title="Copy">
                              <IconButton
                                onClick={() =>
                                  handleCopy(
                                    settings.apiKeys.stripe.publicKey,
                                    "stripePublicKey"
                                  )
                                }
                                sx={{ color: "#A0A0A0" }}
                              >
                                {copiedKeys.includes("stripePublicKey") ? (
                                  <CheckCircle size={18} color="#39FF14" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              label="Secret Key"
                              type={showKeys.includes("stripeSecretKey") ? "text" : "password"}
                              value={settings.apiKeys.stripe.secretKey}
                              onChange={(e) =>
                                handleChange(
                                  "secretKey",
                                  e.target.value,
                                  "apiKeys.stripe"
                                )
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() =>
                                toggleKeyVisibility("stripeSecretKey")
                              }
                              sx={{ color: "#A0A0A0" }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                            <Tooltip title="Copy">
                              <IconButton
                                onClick={() =>
                                  handleCopy(
                                    settings.apiKeys.stripe.secretKey,
                                    "stripeSecretKey"
                                  )
                                }
                                sx={{ color: "#A0A0A0" }}
                              >
                                {copiedKeys.includes("stripeSecretKey") ? (
                                  <CheckCircle size={18} color="#39FF14" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                              fullWidth
                              label="Webhook Secret"
                              type={showKeys.includes("stripeWebhookSecret") ? "text" : "password"}
                              value={settings.apiKeys.stripe.webhookSecret}
                              onChange={(e) =>
                                handleChange(
                                  "webhookSecret",
                                  e.target.value,
                                  "apiKeys.stripe"
                                )
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(5,5,5,0.5)",
                                  "& fieldset": {
                                    borderColor: "rgba(57,255,20,0.2)",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#A0A0A0",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() =>
                                toggleKeyVisibility("stripeWebhookSecret")
                              }
                              sx={{ color: "#A0A0A0" }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                            <Tooltip title="Copy">
                              <IconButton
                                onClick={() =>
                                  handleCopy(
                                    settings.apiKeys.stripe.webhookSecret,
                                    "stripeWebhookSecret"
                                  )
                                }
                                sx={{ color: "#A0A0A0" }}
                              >
                                {copiedKeys.includes("stripeWebhookSecret") ? (
                                  <CheckCircle size={18} color="#39FF14" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* System Status Section */}
                    <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 3 }} />
                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Monitor size={18} color="#39FF14" />
                        System Status
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Card
                            sx={{
                              background: "rgba(57,255,20,0.05)",
                              border: "1px solid rgba(57,255,20,0.2)",
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Website Status
                                </Typography>
                                <Chip
                                  label="Live"
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(57,255,20,0.1)",
                                    color: "#39FF14",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card
                            sx={{
                              background: "rgba(57,255,20,0.05)",
                              border: "1px solid rgba(57,255,20,0.2)",
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Database
                                </Typography>
                                <Chip
                                  label="Connected"
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(57,255,20,0.1)",
                                    color: "#39FF14",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card
                            sx={{
                              background: "rgba(57,255,20,0.05)",
                              border: "1px solid rgba(57,255,20,0.2)",
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Payment Gateway
                                </Typography>
                                <Chip
                                  label="Active"
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(57,255,20,0.1)",
                                    color: "#39FF14",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Box>

          {/* Store Status & System Info Sidebar */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 3,
                      }}
                    >
                      Store Status
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Store Mode
                        </Typography>
                        <Chip
                          label="Live"
                          size="small"
                          sx={{
                            bgcolor: "rgba(57,255,20,0.1)",
                            color: "#39FF14",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Last Backup
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          May 20, 2026 10:30 AM
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Storage Used
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          2.45 GB / 20 GB
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Registered Users
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          1,248
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Total Orders
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          3,560
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: "#111111",
                    border: "1px solid rgba(57,255,20,0.15)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 3,
                      }}
                    >
                      System Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Application Version
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          1.0.0
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Environment
                        </Typography>
                        <Chip
                          label="Production"
                          size="small"
                          sx={{
                            bgcolor: "rgba(57,255,20,0.1)",
                            color: "#39FF14",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Node.js Version
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          18.17.0
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Next.js Version
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          14.0.0
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Last Deployment
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          May 20, 2026 09:00 AM
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === "success" ? "#39FF14" : "#EF4444",
            color: "#000",
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

