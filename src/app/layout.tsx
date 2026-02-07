import NavbarWrapper from '@/components/NavbarWrapper';
import { ThemeProvider } from "@/components/ThemeProvider";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
