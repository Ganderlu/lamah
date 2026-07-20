"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Grid2 as Grid,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  Plus,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  ShieldCheck,
  Lock,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { auth } from "@/firebase/client";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/addresses";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import type { Address } from "@/types/address";

type Filter = "All" | "Saved" | "Default";

export default function AddressesPage() {
  const profile = useAuthStore((state) => state.profile);
  const userId = auth.currentUser?.uid || "";
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuAddress, setCurrentMenuAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    street: "",
    apartment: "",
    postalCode: "",
    addressType: "Home" as "Home" | "Office" | "Other",
    isDefault: false,
  });

  // Load addresses
  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await fetchAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Failed to load addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      await createAddress({ ...formData, userId });
      setAddModalOpen(false);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  const handleEditAddress = async () => {
    if (!editAddress) return;
    try {
      await updateAddress(editAddress.id!, userId, formData);
      setEditAddress(null);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleDeleteAddress = async () => {
    if (!deleteAddressId) return;
    try {
      await deleteAddress(deleteAddressId);
      setDeleteAddressId(null);
      loadAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      city: "",
      street: "",
      apartment: "",
      postalCode: "",
      addressType: "Home",
      isDefault: false,
    });
  };

  const openEditModal = (address: Address) => {
    setEditAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      email: address.email,
      country: address.country,
      state: address.state,
      city: address.city,
      street: address.street,
      apartment: address.apartment || "",
      postalCode: address.postalCode,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setAnchorEl(null);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteAddressId(id);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, address: Address) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenuAddress(address);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenuAddress(null);
  };

  const filteredAddresses = addresses.filter((addr) => {
    if (filter === "Default") return addr.isDefault;
    return true;
  });

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Bebas Neue, sans-serif",
                color: "#fff",
                mb: 1,
              }}
            >
              My Addresses
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Manage your saved delivery addresses.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              borderRadius: "18px",
              px: 3,
              py: 1.5,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#2dd610",
                boxShadow: "0 0 30px rgba(57,255,20,0.3)",
              },
            }}
          >
            Add New Address
          </Button>
        </Box>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 4,
            borderBottom: "1px solid rgba(57,255,20,0.15)",
            bgcolor: "#090909",
            borderRadius: "18px",
            px: 2,
            py: 1,
          }}
        >
          {["All", "Saved", "Default"].map((tab) => (
            <Box
              key={tab}
              onClick={() => setFilter(tab as Filter)}
              sx={{
                pb: 1,
                px: 2,
                cursor: "pointer",
                borderBottom: 2,
                borderColor: filter === tab ? "#39FF14" : "transparent",
                color: filter === tab ? "#39FF14" : "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
                fontWeight: filter === tab ? 700 : 500,
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#39FF14",
                },
              }}
            >
              {tab} Addresses
            </Box>
          ))}
        </Box>
      </motion.div>

      {/* Address Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card
                  sx={{
                    bgcolor: "#111111",
                    borderRadius: "18px",
                    border: "1px solid rgba(57,255,20,0.15)",
                  }}
                >
                  <CardContent>
                    <Skeleton variant="rounded" height={24} width={80} sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ fontSize: "1.25rem", mb: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Skeleton variant="rounded" height={36} width={80} />
                      <Skeleton variant="rounded" height={36} width={80} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredAddresses.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 12,
              textAlign: "center",
            }}
          >
            <MapPin size={80} color="#39FF14" strokeWidth={1.5} sx={{ mb: 4 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Bebas Neue, sans-serif",
                color: "#fff",
                mb: 2,
              }}
            >
              No Addresses Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
                mb: 4,
                maxWidth: 400,
              }}
            >
              Save an address for faster checkout.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => setAddModalOpen(true)}
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                fontWeight: 700,
                fontFamily: "Poppins, sans-serif",
                borderRadius: "18px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#2dd610",
                  boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                },
              }}
            >
              Add Address
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredAddresses.map((address, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={address.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    sx={{
                      bgcolor: "#111111",
                      borderRadius: "18px",
                      border: "1px solid rgba(57,255,20,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#39FF14",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          {address.isDefault && (
                            <Chip
                              label="Default"
                              sx={{
                                bgcolor: "#39FF14",
                                color: "#000",
                                fontWeight: 700,
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.75rem",
                              }}
                            />
                          )}
                          <Chip
                            label={address.addressType}
                            sx={{
                              bgcolor: address.isDefault
                                ? "rgba(57,255,20,0.1)"
                                : "rgba(255,255,255,0.05)",
                              color: address.isDefault ? "#39FF14" : "#A0A0A0",
                              fontWeight: 500,
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.75rem",
                              border: "1px solid rgba(57,255,20,0.2)",
                            }}
                          />
                        </Box>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, address)}
                          sx={{ color: "#A0A0A0" }}
                        >
                          <MoreVertical size={20} />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 2,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: "rgba(57,255,20,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <MapPin
                            size={20}
                            color={address.isDefault ? "#39FF14" : "#A0A0A0"}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {address.addressType}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              mb: 0.5,
                            }}
                          >
                            {address.fullName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              mb: 0.5,
                            }}
                          >
                            {address.street}
                            {address.apartment && `, ${address.apartment}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              mb: 0.5,
                            }}
                          >
                            {address.city}, {address.state} {address.postalCode}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              mb: 0.5,
                            }}
                          >
                            {address.country}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#39FF14",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {address.phone}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Edit size={16} />}
                          onClick={() => openEditModal(address)}
                          fullWidth
                          sx={{
                            borderColor: "rgba(57,255,20,0.3)",
                            color: "#fff",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontFamily: "Poppins, sans-serif",
                            "&:hover": {
                              borderColor: "#39FF14",
                              bgcolor: "rgba(57,255,20,0.1)",
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Trash2 size={16} />}
                          onClick={() => openDeleteDialog(address.id!)}
                          fullWidth
                          sx={{
                            borderColor: "rgba(239,68,68,0.3)",
                            color: "#EF4444",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontFamily: "Poppins, sans-serif",
                            "&:hover": {
                              borderColor: "#EF4444",
                              bgcolor: "rgba(239,68,68,0.1)",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>

      {/* Security Card */}
      {filteredAddresses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            sx={{
              mt: 6,
              bgcolor: "#090909",
              borderRadius: "18px",
              border: "1px solid rgba(57,255,20,0.15)",
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(57,255,20,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={32} color="#39FF14" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Your addresses are secure
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  We use industry-standard security to keep your addresses safe and protected.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Lock size={20} color="#39FF14" />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Encrypted
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ShieldCheck size={20} color="#39FF14" />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Secure
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EyeOff size={20} color="#39FF14" />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Private
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </motion.div>
      )}

      {/* Address Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => currentMenuAddress && openEditModal(currentMenuAddress)}>
          <Edit size={16} style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => currentMenuAddress?.id && openDeleteDialog(currentMenuAddress.id)}
          sx={{ color: "#EF4444" }}
        >
          <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Address Modal */}
      <Dialog
        open={addModalOpen || !!editAddress}
        onClose={() => {
          setAddModalOpen(false);
          setEditAddress(null);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
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
            fontSize: "2rem",
          }}
        >
          {editAddress ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Country"
                fullWidth
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Street Address"
                fullWidth
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Apartment (optional)"
                fullWidth
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
                label="Postal Code"
                fullWidth
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111111",
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
                  Address Type
                </InputLabel>
                <Select
                  value={formData.addressType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      addressType: e.target.value as "Home" | "Office" | "Other",
                    })
                  }
                  label="Address Type"
                  sx={{
                    color: "#fff",
                    bgcolor: "#111111",
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
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#39FF14",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        bgcolor: "#39FF14",
                        opacity: 0.5,
                      },
                    }}
                  />
                }
                label="Set as default address"
                sx={{
                  color: "#fff",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setAddModalOpen(false);
              setEditAddress(null);
              resetForm();
            }}
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editAddress ? handleEditAddress : handleAddAddress}
            variant="contained"
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              borderRadius: "12px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#2dd610",
                boxShadow: "0 0 20px rgba(57,255,20,0.3)",
              },
            }}
          >
            {editAddress ? "Save Changes" : "Save Address"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteAddressId}
        onClose={() => setDeleteAddressId(null)}
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
          }}
        >
          Delete Address?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteAddressId(null)}
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAddress}
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
