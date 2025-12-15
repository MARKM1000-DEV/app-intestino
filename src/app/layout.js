import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. CORREÇÃO: O Viewport agora deve ser exportado separadamente
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Impede zoom no mobile (sensação de app nativo)
  themeColor: "#2563eb", // Cor da barra de status no Android
};

export const metadata = {
  title: "Saúde Intestinal",
  description: "Rastreamento diário de saúde",
  manifest: "/manifest.json",
  // 2. CORREÇÃO: Links para os ícones (resolve os erros 404)
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png", // Ícone para iPhone/iPad
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saúde",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}