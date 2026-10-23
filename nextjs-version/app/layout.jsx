import './globals.css';

export const metadata = {
  title: 'Welcome ItzFizz – Scroll-Driven Hero',
  description: 'Scroll-driven hero animation built with Next.js, React, GSAP and Tailwind.',
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#07080d' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
