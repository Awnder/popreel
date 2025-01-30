import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopNav from "./components/TopNav";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <TopNav />
          </header>
          <main className="pt-[60px]">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
