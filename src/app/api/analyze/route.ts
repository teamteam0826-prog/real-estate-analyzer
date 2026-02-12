import { NextRequest, NextResponse } from 'next/server';
import { getRealEstatePrice } from '@/lib/mcp-client';
import { analyzeProperty } from '@/lib/analysis';
import { PropertyInput } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 入力バリデーション
        const { propertyType, prefecture, city, price, area, age } = body;

        if (!propertyType || !prefecture || !city) {
            return NextResponse.json(
                { error: '物件種別、都道府県、市区町村は必須です' },
                { status: 400 }
            );
        }

        if (!price || price <= 0) {
            return NextResponse.json(
                { error: '物件価格は正の数で入力してください' },
                { status: 400 }
            );
        }

        if (!area || area <= 0) {
            return NextResponse.json(
                { error: '専有面積は正の数で入力してください' },
                { status: 400 }
            );
        }

        if (age === undefined || age === null || age < 0) {
            return NextResponse.json(
                { error: '築年数は0以上の数で入力してください' },
                { status: 400 }
            );
        }

        const input: PropertyInput = {
            propertyType,
            prefecture,
            city,
            price: Number(price),
            area: Number(area),
            age: Number(age),
        };

        // MCP経由で不動産取引価格データを取得
        const transactions = await getRealEstatePrice({
            area: prefecture,
            city,
            propertyType,
        });

        if (transactions.length === 0) {
            return NextResponse.json(
                {
                    error: '該当エリアの取引データが見つかりませんでした。別のエリアまたは物件種別をお試しください。',
                },
                { status: 404 }
            );
        }

        // 分析実行
        const result = analyzeProperty(input, transactions);

        return NextResponse.json(result);
    } catch (error) {
        console.error('分析APIエラー:', error);
        return NextResponse.json(
            {
                error: '分析処理中にエラーが発生しました',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
