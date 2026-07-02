export type CourseTranslations = {
  [key: string]: {
    title: string;
    subtitle: string;
    starterName: string;
    starterDesc: string;
    starterPrice: string;
    starterPeriod: string;
    premiumName: string;
    premiumDesc: string;
    premiumPrice: string;
    premiumPeriod: string;
    intensiveName: string;
    intensiveDesc: string;
    intensivePrice: string;
    intensivePeriod: string;
    bullets: {
      starter: string[];
      premium: string[];
      intensive: string[];
    };
    achievementsTitle: string;
    achievements: string[];
  };
};

export const translations: CourseTranslations = {
  en: {
    title: "Learn Korean with a Native Korean Teacher",
    subtitle: "Speak Korean in 3 Months!",
    starterName: "Starter Course",
    starterDesc: "For casual learners starting their Hangeul journey.",
    starterPrice: "$30",
    starterPeriod: "/ month",
    premiumName: "Premium Course",
    premiumDesc: "For active learners who want daily feedback and faster results.",
    premiumPrice: "$50",
    premiumPeriod: "/ month",
    intensiveName: "Intensive Course",
    intensiveDesc: "For students preparing for travel, study, or living in Korea.",
    intensivePrice: "$70",
    intensivePeriod: "/ month",
    bullets: {
      starter: [
        "1 online lesson per week",
        "4 lessons per month",
        "Google Meet class access",
        "Hangeul reading system in 1 day",
        "Friendly and personalized style"
      ],
      premium: [
        "2 online lessons per week",
        "8 lessons per month",
        "Daily Instagram homework feedback",
        "Basic Korean conversation in 3 months",
        "Custom study plan"
      ],
      intensive: [
        "3 online lessons per week",
        "12 lessons per month",
        "1:1 personal mentoring",
        "Busan Youth Guide matching coupon",
        "Affordable stay information in Busan"
      ]
    },
    achievementsTitle: "What You Can Achieve",
    achievements: [
      "📖 Read Hangul in 1 day",
      "🗣 Basic Korean conversation in 3 months",
      "✈ Travel confidently in Korea",
      "☕ Order food and coffee by yourself",
      "🤝 Make Korean friends",
      "⛪ Understand Korean church culture"
    ]
  },
  jp: {
    title: "韓国語をネイティブ講師から学びましょう",
    subtitle: "3ヶ月で韓国語が話せる！",
    starterName: "スターターコース",
    starterDesc: "ハングルを始めたばかりの方向け。",
    starterPrice: "¥4,500",
    starterPeriod: "/ 月",
    premiumName: "プレミアムコース",
    premiumDesc: "毎日のフィードバックで早く上達したい方向け。",
    premiumPrice: "¥7,500",
    premiumPeriod: "/ 月",
    intensiveName: "集中コース",
    intensiveDesc: "韓国への旅行や留学を準備している方向け。",
    intensivePrice: "¥10,000",
    intensivePeriod: "/ 月",
    bullets: {
      starter: [
        "週1回のオンラインレッスン",
        "月4回のレッスン",
        "Google Meetでの授業",
        "1日でハングルが読める",
        "フレンドリーでパーソナライズされた指導"
      ],
      premium: [
        "週2回のオンラインレッスン",
        "月8回のレッスン",
        "毎日のInstagram宿題フィードバック",
        "3ヶ月で基本的な日常会話",
        "カスタマイズされた学習プラン"
      ],
      intensive: [
        "週3回のオンラインレッスン",
        "月12回のレッスン",
        "1対1のメンタリング",
        "釜山ユースガイドクーポン",
        "手頃な宿泊情報の提供"
      ]
    },
    achievementsTitle: "できるようになること",
    achievements: [
      "📖 1日でハングルが読める",
      "🗣 3ヶ月で基本的な韓国語会話",
      "✈ 自信を持って韓国旅行",
      "☕ 自分で食事やコーヒーを注文",
      "🤝 韓国人の友達を作る",
      "⛪ 韓国の教会文化を理解する"
    ]
  }
};
