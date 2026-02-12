'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RankCard from '@/components/RankCard';
import PriceBarChart from '@/components/PriceBarChart';
import ScatterPlot from '@/components/ScatterPlot';
import { AnalysisResult } from '@/lib/types';
import { PREFECTURES } from '@/lib/prefectures';

export default function ReportPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        const stored = sessionStorage.getItem('analysisResult');
        const storedLocation = sessionStorage.getItem('locationName');
        if (stored) {
            setResult(JSON.parse(stored));
        }
        if (storedLocation) {
            setLocationName(storedLocation);
        }
    }, []);

    if (!result) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="animate-fade-in-up">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        分析結果がありません
                    </h2>
                    <p className="text-slate-500 mb-8">
                        まず物件情報を入力して分析を実行してください
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                        ← 入力画面に戻る
                    </Button>
                </div>
            </div>
        );
    }

    const prefName = PREFECTURES.find((p) => p.code === result.input.prefecture)?.name || '';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ヘッダー */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in-up">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-slate-900">分析レポート</h1>
                        <Badge
                            className="text-sm font-bold px-3 py-1"
                            style={{
                                backgroundColor: result.rankInfo.bgColor,
                                color: result.rankInfo.color,
                                borderColor: result.rankInfo.color,
                            }}
                        >
                            {result.rankInfo.label}
                        </Badge>
                    </div>
                    <p className="text-slate-500">
                        {locationName || prefName} / {result.input.propertyType}
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="mt-4 sm:mt-0 border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                    ← 新しい分析
                </Button>
            </div>

            {/* 入力物件サマリー */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in delay-100">
                {[
                    { label: '物件価格', value: `${result.input.price.toLocaleString()} 万円`, icon: '💰' },
                    { label: '専有面積', value: `${result.input.area} ㎡`, icon: '📐' },
                    { label: '築年数', value: `${result.input.age} 年`, icon: '🏠' },
                    { label: '取引事例数', value: `${result.totalTransactionCount} 件`, icon: '📋' },
                ].map((item) => (
                    <Card key={item.label} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="pt-5 pb-4 px-5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{item.icon}</span>
                                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                            </div>
                            <p className="text-xl font-bold text-slate-900">{item.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ランク判定カード */}
            <div className="mb-8 animate-fade-in-up delay-200">
                <RankCard
                    rankInfo={result.rankInfo}
                    deviationRate={result.deviationRate}
                    inputUnitPrice={result.inputUnitPrice}
                    marketMedianUnitPrice={result.marketMedianUnitPrice}
                />
            </div>

            {/* グラフセクション */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 価格比較棒グラフ */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in delay-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                📊
                            </span>
                            平米単価の比較
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PriceBarChart
                            inputUnitPrice={result.inputUnitPrice}
                            marketMedianUnitPrice={result.marketMedianUnitPrice}
                            marketAverageUnitPrice={result.marketAverageUnitPrice}
                        />
                    </CardContent>
                </Card>

                {/* 散布図 */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in delay-400">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                🔍
                            </span>
                            市場ポジショニング
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScatterPlot
                            transactions={result.transactions}
                            inputAge={result.input.age}
                            inputUnitPrice={result.inputUnitPrice}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* 取引データ詳細テーブル */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in delay-400">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            📋
                        </span>
                        取引事例一覧（直近データ）
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full text-sm min-w-[1200px]">
                            <thead>
                                <tr className="border-b-2 border-slate-200 bg-slate-50/80">
                                    {[
                                        { label: '市区町村', align: 'left' },
                                        { label: '地区名', align: 'left' },
                                        { label: '種別', align: 'left' },
                                        { label: '取引価格', align: 'right' },
                                        { label: '面積', align: 'right' },
                                        { label: '平米単価', align: 'right' },
                                        { label: '間取り', align: 'left' },
                                        { label: '建物構造', align: 'left' },
                                        { label: '建築年', align: 'left' },
                                        { label: '築年数', align: 'right' },
                                        { label: '用途', align: 'left' },
                                        { label: '前面道路', align: 'left' },
                                        { label: '土地形状', align: 'left' },
                                        { label: '都市計画', align: 'left' },
                                        { label: '取引時期', align: 'left' },
                                        { label: '備考', align: 'left' },
                                    ].map((col) => (
                                        <th
                                            key={col.label}
                                            className={`text-${col.align} py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap`}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.transactions.slice(0, 50).map((t, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors"
                                    >
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.municipality || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-700 font-medium whitespace-nowrap">{t.district || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.type || '-'}</td>
                                        <td className="py-2.5 px-3 text-right text-slate-900 font-semibold whitespace-nowrap">
                                            {t.price.toLocaleString()} 万円
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-slate-600 whitespace-nowrap">{t.area} ㎡</td>
                                        <td className="py-2.5 px-3 text-right text-slate-900 font-semibold whitespace-nowrap">
                                            {t.unitPrice.toLocaleString()} 万円/㎡
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.floorPlan || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.structure || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.buildingYear || '-'}</td>
                                        <td className="py-2.5 px-3 text-right text-slate-600 whitespace-nowrap">{t.age} 年</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.use || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.frontRoad || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.landShape || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.classification || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{t.period || '-'}</td>
                                        <td className="py-2.5 px-3 text-slate-500 text-xs max-w-[200px] truncate" title={t.remarks || ''}>
                                            {t.remarks || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {result.transactions.length > 50 && (
                            <p className="text-center text-sm text-slate-400 mt-4">
                                他 {result.transactions.length - 50} 件の取引事例があります
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 免責事項 */}
            <div className="mt-8 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 text-sm text-amber-800">
                <p className="font-semibold mb-1">⚠️ 免責事項</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                    本レポートは国土交通省の不動産取引価格情報（MCP経由取得）に基づく参考情報です。
                    実際の投資判断は、物件の個別状況、市場動向、専門家の助言等を総合的に考慮の上、ご自身の責任において行ってください。
                    データの正確性・最新性は保証いたしません。
                </p>
            </div>
        </div>
    );
}
