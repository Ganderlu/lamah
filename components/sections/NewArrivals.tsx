import { Box, Container, Typography, Grid } from "@mui/material";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/lib/constants/products";

export default function NewArrivals() {
  return (
    <Box sx={{ py: 12, bgcolor: "#080808" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "Bebas Neue, cursive",
            mb: 8,
          }}
        >
          NEW ARRIVALS
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={2}>
              <ProductCard {...product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
