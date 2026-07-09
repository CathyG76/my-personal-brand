import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cathy G — Personal Brand",
  description: "Content I own, published on my own terms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <header className="border-b" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              Cathy&nbsp;G<span style={{ color: "var(--accent)" }}>.</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="hover:opacity-70">
                Writing
              </Link>
              <Link
                href="/admin"
                className="hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer
          className="border-t text-xs"
          style={{ borderColor: "var(--line)", color: "var(--muted)" }}
        >
          <div className="max-w-3xl mx-auto px-6 py-6">
            © {new Date().getFullYear()} Cathy G. Built and owned by me.
          </div>
        </footer>
      </body>
    </html>
  );
}
