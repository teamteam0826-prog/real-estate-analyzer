'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from 'recharts';

interface PriceBarChartProps {
    inputUnitPrice: number;
    marketMedianUnitPrice: number;
    marketAverageUnitPrice: number;
}

export default function PriceBarChart({
    inputUnitPrice,
    marketMedianUnitPrice,
    marketAverageUnitPrice,
}: PriceBarChartProps) {
    const data = [
        {
            name: 'あなたの物件',
            value: Math.round(inputUnitPrice * 10) / 10,
        },
        {
            name: 'エリア中央値',
            value: Math.round(marketMedianUnitPrice * 10) / 10,
        },
        {
            name: 'エリア平均',
            value: Math.round(marketAverageUnitPrice * 10) / 10,
        },
    ];

    const colors = ['#3B82F6', '#10B981', '#8B5CF6'];

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 13, fill: '#64748B', fontWeight: 600 }}
                        axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#94A3B8' }}
                        axisLine={{ stroke: '#CBD5E1' }}
                        label={{
                            value: '万円/㎡',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: 12, fill: '#94A3B8' },
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0F172A',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                            fontSize: '14px',
                            padding: '12px 16px',
                        }}
                        formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()} 万円/㎡`, '平米単価']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                        <LabelList
                            dataKey="value"
                            position="top"
                            style={{ fontSize: '14px', fontWeight: 700, fill: '#334155' }}
                            formatter={((v: unknown) => `${Number(v).toLocaleString()}`) as never}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
