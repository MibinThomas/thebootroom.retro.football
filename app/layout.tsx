import { Bebas_Neue, Poppins } from 'next/font/google';
import './globals.css';
import Image from "next/image";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata = {
  title: 'The Bootroom Registration',
  description: 'Register your corporate football team for The Bootroom tournament.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${poppins.variable}`}>
      <body className="font-body bg-background text-foreground min-h-screen">
        {/* Global header centered with logo and site title */}
        <header className="flex flex-col items-center pt-3 pb-1 bg-background">
  <Image
    src="/logo.png"
    alt="The Bootroom logo"
    width={220}
    height={80}
    priority
  />
  <span className="text-2xl font-heading uppercase text-primary leading-tight">
    The Bootroom
  </span>
</header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}