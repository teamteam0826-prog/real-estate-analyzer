import { NextRequest, NextResponse } from 'next/server';
import { getCityList } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const area = searchParams.get('area');

        if (!area) {
            return NextResponse.json(
                { error: '都道府県コード（area）は必須です' },
                { status: 400 }
            );
        }

        const cities = await getCityList(area);
        return NextResponse.json({ cities });
    } catch (error) {
        console.error('市区町村リスト取得エラー:', error);
        return NextResponse.json(
            {
                error: '市区町村リストの取得に失敗しました',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
