import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { TransactionData, TransactionRecord, City } from './types';

const MCP_SERVER_URL =
    'https://mcp.n-3.ai/mcp?tools=get-time,reinfolib-real-estate-price,reinfolib-city-list';

/**
 * MCPクライアントを生成し接続する
 */
async function createMCPClient(): Promise<Client> {
    const client = new Client({
        name: 'real-estate-analyzer',
        version: '1.0.0',
    });

    const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
    await client.connect(transport);
    return client;
}

/**
 * 市区町村リストを取得
 */
export async function getCityList(area: string): Promise<City[]> {
    const client = await createMCPClient();
    try {
        const result = await client.callTool({
            name: 'reinfolib-city-list',
            arguments: { area },
        });

        // レスポンスを解析
        const content = result.content as Array<{ type: string; text?: string }>;
        const textContent = content.find((c) => c.type === 'text');
        if (!textContent?.text) {
            return [];
        }

        const parsed = JSON.parse(textContent.text);
        // APIレスポンスの形式に応じてパース
        // reinfolib-city-list は { data: [{ id: "13101", name: "千代田区" }, ...] } のような形式を返す想定
        const cities: City[] = [];
        if (parsed?.data && Array.isArray(parsed.data)) {
            for (const item of parsed.data) {
                cities.push({
                    code: item.id || item.code || '',
                    name: item.name || '',
                });
            }
        } else if (Array.isArray(parsed)) {
            for (const item of parsed) {
                cities.push({
                    code: item.id || item.code || '',
                    name: item.name || '',
                });
            }
        }

        return cities;
    } finally {
        await client.close();
    }
}

/**
 * 現在の年・四半期を取得
 */
function getCurrentYearQuarter(): { year: number; quarter: number } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return { year, quarter };
}

/**
 * 過去N四半期分のyear+quarterペアを計算
 */
function getPastQuarters(count: number): Array<{ year: number; quarter: number }> {
    const { year, quarter } = getCurrentYearQuarter();
    const quarters: Array<{ year: number; quarter: number }> = [];

    let y = year;
    let q = quarter;

    for (let i = 0; i < count; i++) {
        // 最新のデータは通常2四半期遅れなので、2四半期前から開始
        q -= 1;
        if (q <= 0) {
            q = 4;
            y -= 1;
        }
        quarters.push({ year: y, quarter: q });
    }

    return quarters;
}

/**
 * 不動産取引価格データを取得
 * 過去2年分（最大8四半期）のデータを取得
 */
export async function getRealEstatePrice(params: {
    area: string;
    city: string;
    propertyType?: string;
}): Promise<TransactionRecord[]> {
    const client = await createMCPClient();
    try {
        const quarters = getPastQuarters(8);
        const allTransactions: TransactionRecord[] = [];

        // 各四半期のデータを取得（エラーを無視して取得可能なものだけ使用）
        const results = await Promise.allSettled(
            quarters.map(({ year, quarter }) =>
                client.callTool({
                    name: 'reinfolib-real-estate-price',
                    arguments: {
                        year: String(year),
                        quarter: String(quarter),
                        area: params.area,
                        city: params.city,
                        priceClassification: '01', // 取引価格情報
                    },
                })
            )
        );

        for (const result of results) {
            if (result.status === 'fulfilled') {
                const content = result.value.content as Array<{ type: string; text?: string }>;
                const textContent = content.find((c) => c.type === 'text');
                if (textContent?.text) {
                    try {
                        const parsed = JSON.parse(textContent.text);
                        const rawData: TransactionData[] = parsed?.data || parsed || [];

                        if (Array.isArray(rawData)) {
                            for (const item of rawData) {
                                const record = parseTransactionRecord(item, params.propertyType);
                                if (record) {
                                    allTransactions.push(record);
                                }
                            }
                        }
                    } catch {
                        // JSON parse error — skip this quarter
                    }
                }
            }
        }

        return allTransactions;
    } finally {
        await client.close();
    }
}

/**
 * 生の取引データを構造化レコードに変換
 */
function parseTransactionRecord(
    raw: TransactionData,
    filterType?: string
): TransactionRecord | null {
    try {
        // 物件種別フィルタ
        const type = raw.Type || raw['種類'] || '';
        if (filterType && type && !type.includes(filterType.replace('等', ''))) {
            // 大まかなフィルタ — 完全一致ではなく部分一致
        }

        const tradePrice = parseFloat(
            (raw.TradePrice || raw['取引価格(総額)'] || '0').replace(/,/g, '')
        );
        const area = parseFloat(
            (raw.Area || raw['面積(㎡)'] || '0').replace(/,/g, '')
        );

        if (tradePrice <= 0 || area <= 0) return null;

        const priceInManYen = tradePrice / 10000; // 円 → 万円
        const unitPrice = priceInManYen / area;   // 万円/㎡

        // 築年数を建築年から計算
        const currentYear = new Date().getFullYear();
        const buildYearStr = raw.BuildingYear || raw['建築年'] || '';
        let age = 0;
        // "令和3年" or "平成20年" or "2020" 等のパターンに対応
        const westernMatch = buildYearStr.match(/(\d{4})/);
        if (westernMatch) {
            age = currentYear - parseInt(westernMatch[1], 10);
        } else {
            const reMatch = buildYearStr.match(/令和(\d+)/);
            const heMatch = buildYearStr.match(/平成(\d+)/);
            const shMatch = buildYearStr.match(/昭和(\d+)/);
            if (reMatch) {
                age = currentYear - (2018 + parseInt(reMatch[1], 10));
            } else if (heMatch) {
                age = currentYear - (1988 + parseInt(heMatch[1], 10));
            } else if (shMatch) {
                age = currentYear - (1925 + parseInt(shMatch[1], 10));
            }
        }
        if (age < 0) age = 0;

        return {
            unitPrice: Math.round(unitPrice * 100) / 100,
            age,
            area,
            price: Math.round(priceInManYen * 100) / 100,
            district: raw.DistrictName || raw['地区名'] || '',
            period: raw.Period || raw['取引時点'] || '',
            type: type,
        };
    } catch {
        return null;
    }
}
