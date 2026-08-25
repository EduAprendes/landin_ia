import "./globals.css";

export const metadata = {
  title: "Respondia — IA para WhatsApp e Instagram",
  description: "La IA que responde por tu negocio en milisegundos a través de WhatsApp e Instagram, directo a código.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
