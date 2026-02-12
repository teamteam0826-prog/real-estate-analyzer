'use client';

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
    ZAxis,
} from 'recharts';
import { TransactionRecord } from '@/lib/types';

interface ScatterPlotProps {
    transactions: TransactionRecord[];
    inputAge: number;
    inputUnitPrice: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: TransactionRecord & { isInput?: boolean };
    }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 text-sm">
            {data.isInput ? (
                <p className="font-bold text-red-400 mb-2">★ あなたの物件</p>
            ) : (
                <p className="font-bold text-blue-300 mb-2">周辺取引事例</p>
            )}
            <div className="space-y-1 text-slate-300">
                <p>平米単価: <span className="text-white font-semibold">{data.unitPrice.toLocaleString()} 万円/㎡</span></p>
                <p>築年数: <span className="text-white font-semibold">{data.age} 年</span></p>
                {data.district && <p>地区: {data.district}</p>}
                {data.period && <p>取引時期: {data.period}</p>}
                <p>面積: {data.area} ㎡</p>
                <p>取引価格: {data.price.toLocaleString()} 万円</p>
            </div>
        </div>
    );
};

export default function ScatterPlot({
    transactions,
    inputAge,
    inputUnitPrice,
}: ScatterPlotProps) {
    // 入力物件データ
    const inputData = [
        {
            age: inputAge,
            unitPrice: inputUnitPrice,
            area: 0,
            price: 0,
            district: '',
            period: '',
            type: '',
            isInput: true,
        },
    ];

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                        dataKey="age"
                        type="number"
                        name="築年数"
                        unit="年"
                        tick={{ fontSize: 12, fill: '#94A3B8' }}
                        axisLine={{ stroke: '#CBD5E1' }}
                        label={{
                            value: '築年数（年）',
                            position: 'insideBottomRight',
                            offset: -10,
                            style: { fontSize: 12, fill: '#94A3B8' },
                        }}
                    />
                    <YAxis
                        dataKey="unitPrice"
                        type="number"
                        name="平米単価"
                        unit="万円/㎡"
                        tick={{ fontSize: 12, fill: '#94A3B8' }}
                        axisLine={{ stroke: '#CBD5E1' }}
                        label={{
                            value: '平米単価（万円/㎡）',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: 12, fill: '#94A3B8' },
                        }}
                    />
                    <ZAxis range={[40, 400]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                    />

                    {/* 参考線: 入力物件の平米単価 */}
                    <ReferenceLine
                        y={inputUnitPrice}
                        stroke="#EF4444"
                        strokeDasharray="5 5"
                        strokeWidth={1.5}
                        label={{
                            value: `あなた: ${inputUnitPrice.toLocaleString()}万円/㎡`,
                            position: 'right',
                            fill: '#EF4444',
                            fontSize: 11,
                        }}
                    />

                    {/* 周辺取引事例 */}
                    <Scatter
                        name="周辺取引事例"
                        data={transactions}
                        fill="#3B82F6"
                        fillOpacity={0.5}
                        stroke="#2563EB"
                        strokeWidth={1}
                    />

                    {/* 入力物件（赤色で強調） */}
                    <Scatter
                        name="あなたの物件"
                        data={inputData}
                        fill="#EF4444"
                        fillOpacity={0.9}
                        stroke="#DC2626"
                        strokeWidth={2}
                        shape="star"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
