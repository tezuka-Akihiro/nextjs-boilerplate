import "./globals.css";

export const metadata = {
  title: "Next.js Universal Boilerplate",
  description: "A minimalist Next.js boilerplate for local development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
