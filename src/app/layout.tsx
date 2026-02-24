import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Sign In — Olympus",
	description: "Sign in to your Olympus identity platform account.",
	robots: "noindex, nofollow",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`dark ${inter.variable}`}>
			<body className="min-h-screen font-sans antialiased">
				<main>{children}</main>
			</body>
		</html>
	);
}
