import { TransactionRecord, RankInfo, Rank, AnalysisResult, PropertyInput } from './types';

/**
 * 中央値を計算
 */
function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * エリア相場単価（中央値）を計算
 */
export function calculateMedianUnitPrice(transactions: TransactionRecord[]): number {
    const unitPrices = transactions
        .map((t) => t.unitPrice)
        .filter((p) => p > 0 && isFinite(p));
    return median(unitPrices);
}

/**
 * エリア平均単価を計算
 */
export function calculateAverageUnitPrice(transactions: TransactionRecord[]): number {
    const unitPrices = transactions
        .map((t) => t.unitPrice)
        .filter((p) => p > 0 && isFinite(p));
    if (unitPrices.length === 0) return 0;
    return unitPrices.reduce((sum, p) => sum + p, 0) / unitPrices.length;
}

/**
 * 乖離率を計算（%）
 * (入力物件の平米単価 - エリア相場単価) / エリア相場単価 * 100
 */
export function calculateDeviationRate(
    inputUnitPrice: number,
    marketUnitPrice: number
): number {
    if (marketUnitPrice === 0) return 0;
    return ((inputUnitPrice - marketUnitPrice) / marketUnitPrice) * 100;
}

/**
 * ランク判定
 */
export function determineRank(deviationRate: number): RankInfo {
    const ranks: Record<Rank, RankInfo> = {
        S: {
            rank: 'S',
            label: 'Sランク',
            color: '#10B981',
            bgColor: '#ECFDF5',
            description: '非常に割安（買い推奨）',
        },
        A: {
            rank: 'A',
            label: 'Aランク',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            description: '割安',
        },
        B: {
            rank: 'B',
            label: 'Bランク',
            color: '#6B7280',
            bgColor: '#F9FAFB',
            description: '適正価格',
        },
        C: {
            rank: 'C',
            label: 'Cランク',
            color: '#EF4444',
            bgColor: '#FEF2F2',
            description: '割高注意',
        },
    };

    if (deviationRate <= -10) return ranks.S;
    if (deviationRate <= -5) return ranks.A;
    if (deviationRate <= 5) return ranks.B;
    return ranks.C;
}

/**
 * 物件分析のメイン関数
 */
export function analyzeProperty(
    input: PropertyInput,
    transactions: TransactionRecord[]
): AnalysisResult {
    const inputUnitPrice = input.price / input.area; // 万円/㎡

    const marketMedianUnitPrice = calculateMedianUnitPrice(transactions);
    const marketAverageUnitPrice = calculateAverageUnitPrice(transactions);
    const deviationRate = calculateDeviationRate(inputUnitPrice, marketMedianUnitPrice);
    const rankInfo = determineRank(deviationRate);

    return {
        input,
        inputUnitPrice: Math.round(inputUnitPrice * 100) / 100,
        marketMedianUnitPrice: Math.round(marketMedianUnitPrice * 100) / 100,
        marketAverageUnitPrice: Math.round(marketAverageUnitPrice * 100) / 100,
        deviationRate: Math.round(deviationRate * 100) / 100,
        rankInfo,
        transactions,
        totalTransactionCount: transactions.length,
    };
}
