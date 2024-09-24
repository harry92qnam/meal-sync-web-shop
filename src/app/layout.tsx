import TanStackProvider from '@/configs/providers/TanStackProvider';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import NextUIProvider from '@/configs/providers/NextUIProvider';
import './globals.css';
const roboto = Roboto({
  subsets: ['vietnamese'],
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'MealSync Web for Shop',
    template: 'MealSync',
  },
  description: 'Meal Service Platform in the National University Dormitory area',
  icons: {
    icon: '/images/logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <NextUIProvider>
          <TanStackProvider>{children}</TanStackProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
