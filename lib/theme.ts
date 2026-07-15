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
    background: {
      default: "#050505",
      paper: "#111111",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0A0",
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
    body1: {
      fontFamily: "Poppins, sans-serif",
    },
    button: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
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
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: "#111111",
          border: "1px solid rgba(57,255,20,0.15)",
        },
      },
    },
  },
});

export default lamahTheme;
