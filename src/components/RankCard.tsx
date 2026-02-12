'use client';

import { RankInfo } from '@/lib/types';

interface RankCardProps {
    rankInfo: RankInfo;
    deviationRate: number;
    inputUnitPrice: number;
    marketMedianUnitPrice: number;
}

export default function RankCard({
    rankInfo,
    deviationRate,
    inputUnitPrice,
    marketMedianUnitPrice,
}: RankCardProps) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl p-8 text-center"
            style={{ backgroundColor: rankInfo.bgColor }}
        >
            {/* 背景装飾 */}
            <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-10 translate-x-10"
                style={{ backgroundColor: rankInfo.color }}
            />
            <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-8 -translate-x-8"
                style={{ backgroundColor: rankInfo.color }}
            />

            {/* ランク表示 */}
            <div className="relative z-10">
                <div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 text-white text-5xl font-black shadow-lg"
                    style={{ backgroundColor: rankInfo.color }}
                >
                    {rankInfo.rank}
                </div>

                <h2 className="text-2xl font-bold mb-2" style={{ color: rankInfo.color }}>
                    {rankInfo.label}
                </h2>

                <p className="text-lg font-medium text-slate-700 mb-6">
                    {rankInfo.description}
                </p>

                {/* 乖離率 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">あなたの平米単価</p>
                        <p className="text-xl font-bold text-slate-900">
                            {inputUnitPrice.toLocaleString('ja-JP', { maximumFractionDigits: 1 })}
                            <span className="text-xs text-slate-500 ml-1">万円/㎡</span>
                        </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">エリア相場（中央値）</p>
                        <p className="text-xl font-bold text-slate-900">
                            {marketMedianUnitPrice.toLocaleString('ja-JP', { maximumFractionDigits: 1 })}
                            <span className="text-xs text-slate-500 ml-1">万円/㎡</span>
                        </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">乖離率</p>
                        <p
                            className="text-xl font-bold"
                            style={{ color: rankInfo.color }}
                        >
                            {deviationRate > 0 ? '+' : ''}
                            {deviationRate.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
