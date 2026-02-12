import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "不動産投資アナライザー | Real Estate Investment Analyzer",
  description:
    "行政オープンデータ（国土交通省 不動産取引価格情報）を活用し、物件の割安・割高を瞬時に判定する投資意思決定サポートツール",
  keywords: ["不動産", "投資", "分析", "相場", "国土交通省", "MCP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* ヘッダー */}
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    RE Analyzer
                  </h1>
                  <p className="text-[10px] text-slate-400 -mt-0.5">
                    不動産投資分析ツール
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MCP Connected
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="min-h-[calc(100vh-4rem)] bg-grid-pattern">
          {children}
        </main>

        {/* フッター */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-slate-500">
              データ提供: 国土交通省 不動産情報ライブラリ（reinfolib） | MCP Protocol 経由で取得
            </p>
            <p className="text-xs text-slate-600 mt-1">
              ※ 本ツールは投資判断の参考情報であり、投資の最終判断はご自身の責任で行ってください。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
