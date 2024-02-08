import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Connections Demo",
  description: "It's a demo. What more do you want?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen justify-center items-center bg-background text-highlight font-sans">
          <header className="fixed top-0 w-full h-12 flex items-center justify-between px-4">
            <Link href="/">
              <h1 className="text-lg font-semibold">
                Financial Connections Demo
              </h1>
            </Link>
            {/* Hamburger menu; uncomment lg:hidden when we figure out what it should do */}
            <div className="cursor-pointer lg:hidden">
              <div className="w-6 h-1 bg-white mb-1"></div>
              <div className="w-6 h-1 bg-white mb-1"></div>
              <div className="w-6 h-1 bg-white"></div>
            </div>
          </header>
          <main className="flex flex-col justify-center items-center flex-1 text-center m-24">
            {children}
          </main>
          <footer className="fixed bottom-0 w-full h-12 flex items-center justify-center bg-green-800">
            <p className="text-sm">© 2024 Stripe. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
