'use client';

import { TransactionRecord } from '@/lib/types';

interface TransactionDetailModalProps {
    transaction: TransactionRecord | null;
    onClose: () => void;
}

const fieldGroups = [
    {
        title: '📍 所在地・取引情報',
        icon: 'bg-blue-50',
        fields: [
            { key: 'municipality', label: '市区町村' },
            { key: 'district', label: '地区名' },
            { key: 'type', label: '種別' },
            { key: 'period', label: '取引時期' },
            { key: 'purpose', label: '今後の利用目的' },
        ],
    },
    {
        title: '💰 価格・面積',
        icon: 'bg-emerald-50',
        fields: [
            { key: 'price', label: '取引価格', format: (v: string | number) => `${Number(v).toLocaleString()} 万円` },
            { key: 'area', label: '面積', format: (v: string | number) => `${v} ㎡` },
            { key: 'unitPrice', label: '平米単価', format: (v: string | number) => `${Number(v).toLocaleString()} 万円/㎡` },
            { key: 'totalFloorArea', label: '延床面積', format: (v: string | number) => v ? `${v} ㎡` : '' },
            { key: 'breadth', label: '間口', format: (v: string | number) => v ? `${v} m` : '' },
        ],
    },
    {
        title: '🏗️ 建物情報',
        icon: 'bg-purple-50',
        fields: [
            { key: 'floorPlan', label: '間取り' },
            { key: 'structure', label: '建物構造' },
            { key: 'buildingYear', label: '建築年' },
            { key: 'age', label: '築年数', format: (v: string | number) => `${v} 年` },
            { key: 'use', label: '用途' },
        ],
    },
    {
        title: '🗺️ 土地・道路情報',
        icon: 'bg-amber-50',
        fields: [
            { key: 'landShape', label: '土地の形状' },
            { key: 'frontRoad', label: '前面道路' },
            { key: 'direction', label: '前面道路の方位' },
            { key: 'classification', label: '都市計画' },
        ],
    },
    {
        title: '📝 備考',
        icon: 'bg-slate-50',
        fields: [
            { key: 'remarks', label: '備考' },
        ],
    },
];

export default function TransactionDetailModal({
    transaction,
    onClose,
}: TransactionDetailModalProps) {
    if (!transaction) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* オーバーレイ */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* モーダル本体 */}
            <div
                className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">取引事例 詳細</h3>
                        <p className="text-sm text-slate-300 mt-0.5">
                            {transaction.municipality} {transaction.district} / {transaction.period || '時期不明'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-lg"
                        aria-label="閉じる"
                    >
                        ✕
                    </button>
                </div>

                {/* 価格ハイライト */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-4 border-b border-slate-100">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">取引価格</p>
                            <p className="text-xl font-black text-slate-900">
                                {transaction.price.toLocaleString()}
                                <span className="text-sm font-medium text-slate-500 ml-1">万円</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">平米単価</p>
                            <p className="text-xl font-black text-blue-600">
                                {transaction.unitPrice.toLocaleString()}
                                <span className="text-sm font-medium text-blue-400 ml-1">万円/㎡</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">面積</p>
                            <p className="text-xl font-black text-emerald-600">
                                {transaction.area}
                                <span className="text-sm font-medium text-emerald-400 ml-1">㎡</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 詳細セクション */}
                <div className="overflow-y-auto px-6 py-5 space-y-5" style={{ maxHeight: 'calc(85vh - 220px)' }}>
                    {fieldGroups.map((group) => {
                        const visibleFields = group.fields.filter((f) => {
                            const val = transaction[f.key as keyof TransactionRecord];
                            return val !== undefined && val !== '' && val !== 0;
                        });
                        if (visibleFields.length === 0) return null;

                        return (
                            <div key={group.title}>
                                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <span className={`w-7 h-7 ${group.icon} rounded-lg flex items-center justify-center text-sm`}>
                                        {group.title.split(' ')[0]}
                                    </span>
                                    {group.title.split(' ').slice(1).join(' ')}
                                </h4>
                                <div className="bg-slate-50/70 rounded-xl border border-slate-100 divide-y divide-slate-100">
                                    {visibleFields.map((field) => {
                                        const rawValue = transaction[field.key as keyof TransactionRecord];
                                        const displayValue = field.format
                                            ? field.format(rawValue as string | number)
                                            : String(rawValue);

                                        if (!displayValue) return null;

                                        return (
                                            <div
                                                key={field.key}
                                                className="flex items-center justify-between px-4 py-3"
                                            >
                                                <span className="text-sm text-slate-500 font-medium">{field.label}</span>
                                                <span className="text-sm text-slate-900 font-semibold text-right max-w-[60%]">
                                                    {displayValue}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* フッター */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}
