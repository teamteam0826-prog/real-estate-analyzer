// ユーザー入力の型
export interface PropertyInput {
    propertyType: string; // 物件種別
    prefecture: string;   // 都道府県コード (例: "13")
    city: string;         // 市区町村コード (例: "13101")
    price: number;        // 物件価格（万円）
    area: number;         // 専有面積（㎡）
    age: number;          // 築年数（年）
}

// MCP取得データの型（不動産取引価格情報）
export interface TransactionData {
    TradePrice: string;          // 取引価格
    Area: string;                // 面積（㎡）
    UnitPrice: string;           // 平米単価
    BuildingYear: string;        // 建築年
    Type: string;                // 種類
    Municipality: string;        // 市区町村名
    DistrictName: string;        // 地区名
    Period: string;              // 取引時期
    FloorPlan: string;           // 間取り
    Structure: string;           // 建物構造
    PricePerTsubo?: string;      // 坪単価
    [key: string]: string | undefined;
}

// 分析結果の型
export type Rank = 'S' | 'A' | 'B' | 'C';

export interface RankInfo {
    rank: Rank;
    label: string;
    color: string;
    bgColor: string;
    description: string;
}

export interface AnalysisResult {
    // 入力物件情報
    input: PropertyInput;
    inputUnitPrice: number;         // 入力物件の平米単価（万円/㎡）

    // エリア相場
    marketMedianUnitPrice: number;  // エリア相場単価（中央値）
    marketAverageUnitPrice: number; // エリア平均単価

    // 判定
    deviationRate: number;          // 乖離率（%）
    rankInfo: RankInfo;

    // 取引データ（グラフ用）
    transactions: TransactionRecord[];
    totalTransactionCount: number;
}

// グラフ用の取引レコード（加工済み）
export interface TransactionRecord {
    unitPrice: number;    // 平米単価（万円/㎡）
    age: number;          // 築年数
    area: number;         // 面積（㎡）
    price: number;        // 取引価格（万円）
    district: string;     // 地区名
    period: string;       // 取引時期
    type: string;         // 種別
    // ── 追加フィールド（APIから取得可能な全情報） ──
    municipality: string;  // 市区町村名
    floorPlan: string;     // 間取り
    structure: string;     // 建物構造（RC造、木造等）
    buildingYear: string;  // 建築年（原文ママ）
    use: string;           // 用途
    purpose: string;       // 取引の目的
    direction: string;     // 前面道路の方位
    classification: string; // 都市計画区分
    breadth: string;       // 間口
    totalFloorArea: string; // 延床面積
    landShape: string;     // 土地の形状
    frontRoad: string;     // 前面道路（種類＋幅員）
    remarks: string;       // 備考
    renovation: string;    // 改装
    coverageRatio: string; // 建ぺい率
    floorAreaRatio: string; // 容積率
    region: string;        // 地域
    municipalityCode: string; // 市区町村コード
    districtCode: string;  // 地区コード
    priceCategory: string; // 価格分類
}

// 市区町村
export interface City {
    code: string;
    name: string;
}

// 物件種別
export const PROPERTY_TYPES = [
    { value: '宅地(土地)', label: '宅地（土地）' },
    { value: '宅地(土地と建物)', label: '宅地（土地と建物）' },
    { value: '中古マンション等', label: '中古マンション等' },
    { value: '農地', label: '農地' },
    { value: '林地', label: '林地' },
] as const;
