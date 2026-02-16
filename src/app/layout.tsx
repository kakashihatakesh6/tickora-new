import NavbarWrapper from '@/components/NavbarWrapper';
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from 'next/script';
import { Toaster } from "@/components/ui/sonner";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarWrapper />
          {children}
          <Toaster />
        </ThemeProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
