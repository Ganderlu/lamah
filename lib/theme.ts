import { createTheme } from "@mui/material/styles";

const lamahTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#39FF14", // Neon Green
    },
    secondary: {
      main: "#1E1E1E",
    },
    error: {
      main: "#FF4D4F",
    },
    warning: {
      main: "#F5A623",
    },
    success: {
      main: "#39FF14",
    },
    background: {
      default: "#050505",
      paper: "#111111",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9E9E9E",
    },
    divider: "rgba(57,255,20,0.15)",
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontFamily: "Bebas Neue, cursive",
      fontWeight: 700,
      fontSize: "4rem",
      letterSpacing: "0.1em",
    },
    h2: {
      fontFamily: "Bebas Neue, cursive",
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "0.08em",
    },
    h3: {
      fontFamily: "Bebas Neue, cursive",
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "0.06em",
    },
    h4: {
      fontFamily: "Bebas Neue, cursive",
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "0.04em",
    },
    h5: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "Poppins, sans-serif",
    },
    body2: {
      fontFamily: "Poppins, sans-serif",
    },
    button: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    caption: {
      fontFamily: "Poppins, sans-serif",
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 32px",
          textTransform: "none",
        },
        containedPrimary: {
          boxShadow: "0 0 20px rgba(57,255,20,0.25)",
          "&:hover": {
            boxShadow: "0 0 30px rgba(57,255,20,0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: "#111111",
          border: "1px solid rgba(57,255,20,0.15)",
          "&:hover": {
            boxShadow: "0 0 30px rgba(57,255,20,0.1)",
            border: "1px solid rgba(57,255,20,0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(5,5,5,0.9)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(57,255,20,0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(57,255,20,0.2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(57,255,20,0.4)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#39FF14",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "none",
        },
        head: {
          color: "#9E9E9E",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: "#111111",
          "&:hover": {
            backgroundColor: "rgba(57,255,20,0.05)",
          },
        },
      },
    },
  },
});

export default lamahTheme;
