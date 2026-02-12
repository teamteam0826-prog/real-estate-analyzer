'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PREFECTURES } from '@/lib/prefectures';
import { PROPERTY_TYPES, City } from '@/lib/types';

export default function PropertyForm() {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [age, setAge] = useState('');

    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    // 都道府県変更時に市区町村リストを取得
    const fetchCities = useCallback(async (areaCode: string) => {
        setLoadingCities(true);
        setCity('');
        setCities([]);
        try {
            const res = await fetch(`/api/cities?area=${areaCode}`);
            const data = await res.json();
            if (data.cities) {
                setCities(data.cities);
            }
        } catch {
            console.error('市区町村リストの取得に失敗');
        } finally {
            setLoadingCities(false);
        }
    }, []);

    useEffect(() => {
        if (prefecture) {
            fetchCities(prefecture);
        }
    }, [prefecture, fetchCities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsAnalyzing(true);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyType,
                    prefecture,
                    city,
                    price: Number(price),
                    area: Number(area),
                    age: Number(age),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || '分析に失敗しました');
                return;
            }

            // 分析結果をsessionStorageに保存してレポートページへ遷移
            sessionStorage.setItem('analysisResult', JSON.stringify(data));
            const prefName = PREFECTURES.find((p) => p.code === prefecture)?.name || '';
            const cityName = cities.find((c) => c.code === city)?.name || '';
            sessionStorage.setItem('locationName', `${prefName} ${cityName}`);
            router.push('/report');
        } catch {
            setError('通信エラーが発生しました。再度お試しください。');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                    物件情報を入力
                </CardTitle>
                <CardDescription className="text-slate-500">
                    分析したい物件の情報を入力すると、周辺相場と比較して割安・割高を判定します
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 物件種別 */}
                    <div className="space-y-2">
                        <Label htmlFor="propertyType" className="text-sm font-semibold text-slate-700">
                            物件種別
                        </Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger id="propertyType" className="h-12 bg-white border-slate-200">
                                <SelectValue placeholder="物件種別を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROPERTY_TYPES.map((pt) => (
                                    <SelectItem key={pt.value} value={pt.value}>
                                        {pt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 都道府県・市区町村 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="prefecture" className="text-sm font-semibold text-slate-700">
                                都道府県
                            </Label>
                            <Select value={prefecture} onValueChange={setPrefecture}>
                                <SelectTrigger id="prefecture" className="h-12 bg-white border-slate-200">
                                    <SelectValue placeholder="都道府県を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREFECTURES.map((pref) => (
                                        <SelectItem key={pref.code} value={pref.code}>
                                            {pref.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                                市区町村
                            </Label>
                            <Select value={city} onValueChange={setCity} disabled={!prefecture || loadingCities}>
                                <SelectTrigger id="city" className="h-12 bg-white border-slate-200">
                                    <SelectValue
                                        placeholder={
                                            loadingCities
                                                ? '読込中...'
                                                : !prefecture
                                                    ? '都道府県を先に選択'
                                                    : '市区町村を選択'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 価格・面積・築年数 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                                物件価格（万円）
                            </Label>
                            <div className="relative">
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="3,000"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-12 bg-white border-slate-200 pr-12"
                                    min={0}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    万円
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                                専有面積
                            </Label>
                            <div className="relative">
                                <Input
                                    id="area"
                                    type="number"
                                    placeholder="60"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="h-12 bg-white border-slate-200 pr-12"
                                    min={0}
                                    step="0.01"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    ㎡
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age" className="text-sm font-semibold text-slate-700">
                                築年数
                            </Label>
                            <div className="relative">
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="10"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="h-12 bg-white border-slate-200 pr-12"
                                    min={0}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    年
                                </span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            isAnalyzing || !propertyType || !prefecture || !city || !price || !area || age === ''
                        }
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300"
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center gap-3">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        className="opacity-25"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        className="opacity-75"
                                    />
                                </svg>
                                分析中...（MCP経由でデータ取得中）
                            </span>
                        ) : (
                            '📊 投資分析を実行'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
