import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Flashcard Frenzy",
  description: "Multiplayer flashcard game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar /> {/* client component inside server layout */}
        <main className="p-6">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
