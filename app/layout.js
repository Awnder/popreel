import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

import TopNav from "./components/TopNav";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <TopNav />
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
