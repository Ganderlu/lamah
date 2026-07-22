import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import Providers from "./providers";
import SetFavicon from "@/components/SetFavicon";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lamah Clothing Co. | Premium Streetwear",
  description: "Lamah Clothing Co. - Luxury streetwear designed to inspire, built to last.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505]">
        <Providers>
          <SetFavicon />
          {children}
        </Providers>
      </body>
    </html>
  );
}
