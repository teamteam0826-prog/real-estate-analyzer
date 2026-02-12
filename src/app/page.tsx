import PropertyForm from '@/components/PropertyForm';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヒーローセクション */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          国土交通省オープンデータ × MCP
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          不動産投資
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            アナライザー
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          物件情報を入力するだけで、行政データに基づいた
          <br className="hidden sm:block" />
          <strong className="text-slate-700">周辺相場との比較分析</strong>を瞬時に実行します
        </p>
      </div>

      {/* 特長バッジ */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in delay-200">
        {[
          { icon: '🏛️', text: '国土交通省データ連携' },
          { icon: '📊', text: 'S〜Cランク判定' },
          { icon: '🔍', text: '過去2年分の取引分析' },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/60 text-sm text-slate-600 shadow-sm"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* フォーム */}
      <div className="animate-fade-in-up delay-300">
        <PropertyForm />
      </div>
    </div>
  );
}
