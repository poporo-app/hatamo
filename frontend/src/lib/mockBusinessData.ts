import { Business } from '@/types/business';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'プロフェッショナル・コンサルティング',
    description: '企業の業務効率化と戦略立案を専門とするコンサルティングサービス。20年の実績を持つエキスパートが、あなたのビジネス課題を解決します。',
    category: 'ビジネス',
    subcategory: 'コンサルティング',
    price: {
      min: 50000,
      max: 200000,
      unit: 'プロジェクト'
    },
    rating: 4.8,
    reviewCount: 127,
    images: ['/images/consulting1.jpg', '/images/consulting2.jpg'],
    tags: ['戦略立案', '業務効率化', 'デジタル変革', 'プロジェクト管理'],
    provider: {
      name: '田中 雅彦',
      experience: '20年',
      certification: ['MBA', 'PMP認定', 'ITコーディネータ']
    },
    location: '東京都港区',
    availability: '平日・土日対応可能',
    features: [
      '初回相談無料',
      '成果保証制度あり',
      'オンライン対応可',
      '24時間以内返信保証'
    ],
    portfolio: [
      {
        title: '製造業DX推進プロジェクト',
        description: '従業員500名の製造業において、業務のデジタル化を実現。生産性30%向上を達成。',
        image: '/images/portfolio1.jpg'
      }
    ]
  },
  {
    id: '2',
    name: 'エレガント・ウェブデザイン',
    description: '洗練されたデザインと最新技術を駆使したウェブサイト制作。ユーザー体験を重視したモダンなデザインで、あなたのブランドを際立たせます。',
    category: 'IT・技術',
    subcategory: 'ウェブデザイン',
    price: {
      min: 30000,
      max: 150000,
      unit: 'サイト'
    },
    rating: 4.9,
    reviewCount: 89,
    images: ['/images/webdesign1.jpg', '/images/webdesign2.jpg'],
    tags: ['レスポンシブ', 'モダンデザイン', 'UI/UX', 'SEO対策'],
    provider: {
      name: '佐藤 美咲',
      experience: '12年',
      certification: ['ウェブデザイン技能士1級', 'Adobe認定エキスパート']
    },
    location: '大阪府大阪市',
    availability: '平日9:00-18:00',
    features: [
      'レスポンシブ対応',
      'SEO最適化',
      '保守サポート1年間',
      'デザイン修正3回まで無料'
    ],
    portfolio: [
      {
        title: '高級ホテルの予約サイト',
        description: '5つ星ホテルの公式サイトリニューアル。予約率25%向上を実現。',
        image: '/images/portfolio2.jpg'
      }
    ]
  },
  {
    id: '3',
    name: 'パーソナル・ライフコーチング',
    description: '人生の目標達成をサポートする専門的なコーチング。キャリア、人間関係、健康など、あらゆる分野で理想の人生を実現するお手伝いをします。',
    category: 'ライフスタイル',
    subcategory: 'コーチング',
    price: {
      min: 8000,
      max: 15000,
      unit: 'セッション'
    },
    rating: 4.7,
    reviewCount: 156,
    images: ['/images/coaching1.jpg', '/images/coaching2.jpg'],
    tags: ['キャリア支援', '目標達成', 'マインドセット', '自己実現'],
    provider: {
      name: '山田 健一',
      experience: '8年',
      certification: ['国際コーチ連盟認定', 'NLP マスタープラクティショナー']
    },
    location: 'オンライン対応',
    availability: '平日19:00以降・土日対応',
    features: [
      '初回体験セッション50%OFF',
      '成果にコミット',
      '完全オンライン対応',
      'LINEサポート付き'
    ],
    portfolio: [
      {
        title: '転職成功サポート実績',
        description: '年収アップ転職成功率85%。IT業界への転職支援を多数手がける。',
        image: '/images/portfolio3.jpg'
      }
    ]
  },
  {
    id: '4',
    name: 'プレミアム・翻訳サービス',
    description: '多言語対応の高品質翻訳サービス。ビジネス文書から技術資料まで、ネイティブレベルの正確な翻訳をお届けします。',
    category: '教育',
    subcategory: '翻訳・通訳',
    price: {
      min: 15,
      max: 40,
      unit: '文字'
    },
    rating: 4.9,
    reviewCount: 203,
    images: ['/images/translation1.jpg', '/images/translation2.jpg'],
    tags: ['多言語対応', 'ビジネス翻訳', '技術文書', '急ぎ対応'],
    provider: {
      name: '鈴木 エミリー',
      experience: '15年',
      certification: ['翻訳検定1級', 'TOEIC満点', '通訳案内士']
    },
    location: 'オンライン対応',
    availability: '24時間対応（緊急時）',
    features: [
      '24時間以内納期対応',
      'ネイティブチェック付き',
      '専門分野対応',
      '守秘義務徹底'
    ]
  },
  {
    id: '5',
    name: 'エグゼクティブ・フォトグラフィー',
    description: '企業プロフィール、商品撮影、イベント記録まで対応する高品質撮影サービス。プロフェッショナルな仕上がりでブランドイメージを向上させます。',
    category: 'クリエイティブ',
    subcategory: '写真撮影',
    price: {
      min: 25000,
      max: 80000,
      unit: '撮影'
    },
    rating: 4.8,
    reviewCount: 94,
    images: ['/images/photography1.jpg', '/images/photography2.jpg'],
    tags: ['プロフィール撮影', '商品撮影', 'イベント撮影', '高品質'],
    provider: {
      name: '高橋 大輔',
      experience: '18年',
      certification: ['フォトマスター1級', 'Adobe認定']
    },
    location: '東京・神奈川・埼玉',
    availability: '平日・土日対応可',
    features: [
      'スタジオ・出張撮影対応',
      '即日データ納品',
      '修正・レタッチ込み',
      '商用利用可能'
    ]
  },
  {
    id: '6',
    name: 'マインドフルネス・セラピー',
    description: '現代社会のストレスから解放される本格的なマインドフルネス指導。心の健康と生産性向上を同時に実現します。',
    category: '健康・美容',
    subcategory: 'メンタルヘルス',
    price: {
      min: 6000,
      max: 12000,
      unit: 'セッション'
    },
    rating: 4.6,
    reviewCount: 78,
    images: ['/images/mindfulness1.jpg', '/images/mindfulness2.jpg'],
    tags: ['ストレス軽減', '瞑想指導', '企業研修', 'オンライン対応'],
    provider: {
      name: '中村 智子',
      experience: '10年',
      certification: ['臨床心理士', 'マインドフルネス指導者認定']
    },
    location: 'オンライン・東京都内',
    availability: '平日夜間・土日対応',
    features: [
      '初回カウンセリング無料',
      'グループ・個人対応',
      '企業研修実績豊富',
      '継続サポート充実'
    ]
  }
];

export const getBusinessById = (id: string): Business | undefined => {
  return mockBusinesses.find(business => business.id === id);
};

export const searchBusinesses = (query: string, category?: string): Business[] => {
  let filtered = mockBusinesses;
  
  if (category && category !== 'all') {
    filtered = filtered.filter(business => business.category === category);
  }
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(business => 
      business.name.toLowerCase().includes(searchTerm) ||
      business.description.toLowerCase().includes(searchTerm) ||
      business.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  return filtered;
};

export const businessCategories = [
  'all',
  'ビジネス',
  'IT・技術',
  'クリエイティブ',
  'コンサルティング',
  '教育',
  'ライフスタイル',
  '健康・美容'
];