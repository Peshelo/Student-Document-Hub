import { Inter } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/TopHeader";
import FooterBar from "@/components/FooterBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Document Hub",
  description: "A platform for students to share educational resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <TopHeader/>
        {children}
        <FooterBar/>
        </body>
    </html>
  );
}
