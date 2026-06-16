import { Montserrat, Dancing_Script } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import "./globals.css";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata = {
  title: "Berseni - A World of Art For Everyone",
  description: "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.",
  keywords: "seni, lukis, kelas online, workshop offline, lukisan indonesia, belajar melukis, berseni, shopee, lynk.id",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${montserrat.variable} ${dancingScript.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}

