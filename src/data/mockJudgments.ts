import type { ClassDistribution, PersonalReport, JudgmentOption, RiskType, RiskLevel, ActionType } from '@/types';

export const mockStandardAnswers: Record<string, Record<string, { riskType: RiskType; riskLevel: string; action: string }>> = {
  case001: {
    d001: { riskType: 'complaint', riskLevel: 'low', action: 'observe' },
    d002: { riskType: 'sarcasm', riskLevel: 'low', action: 'ignore' },
    d003: { riskType: 'rumor', riskLevel: 'high', action: 'respond' },
    d004: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d005: { riskType: 'crisis', riskLevel: 'crisis', action: 'report' },
    d006: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d007: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d008: { riskType: 'complaint', riskLevel: 'medium', action: 'observe' },
    d009: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d010: { riskType: 'rumor', riskLevel: 'medium', action: 'respond' },
    d011: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d012: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
  },
  case002: {
    d101: { riskType: 'complaint', riskLevel: 'medium', action: 'observe' },
    d102: { riskType: 'normal', riskLevel: 'low', action: 'observe' },
    d103: { riskType: 'normal', riskLevel: 'low', action: 'observe' },
    d104: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d105: { riskType: 'attack', riskLevel: 'high', action: 'observe' },
    d106: { riskType: 'normal', riskLevel: 'medium', action: 'respond' },
    d107: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d108: { riskType: 'rumor', riskLevel: 'high', action: 'report' },
    d109: { riskType: 'complaint', riskLevel: 'medium', action: 'observe' },
    d110: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
  },
  case003: {
    d201: { riskType: 'complaint', riskLevel: 'medium', action: 'observe' },
    d202: { riskType: 'complaint', riskLevel: 'high', action: 'respond' },
    d203: { riskType: 'complaint', riskLevel: 'low', action: 'respond' },
    d204: { riskType: 'rumor', riskLevel: 'medium', action: 'observe' },
    d205: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d206: { riskType: 'rumor', riskLevel: 'high', action: 'respond' },
    d207: { riskType: 'complaint', riskLevel: 'high', action: 'respond' },
    d208: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d209: { riskType: 'normal', riskLevel: 'low', action: 'ignore' },
    d210: { riskType: 'complaint', riskLevel: 'low', action: 'respond' },
  },
};

export const mockClassDistributions: Record<string, ClassDistribution[]> = {
  case001: [
    {
      danmakuId: 'd003',
      riskTypeCounts: { normal: 2, complaint: 10, sarcasm: 3, rumor: 22, attack: 1, sensitive: 5, crisis: 2 },
      riskLevelCounts: { low: 8, medium: 18, high: 15, crisis: 4 },
      actionCounts: { ignore: 5, observe: 12, respond: 23, report: 5 },
      totalCount: 45,
    },
    {
      danmakuId: 'd005',
      riskTypeCounts: { normal: 1, complaint: 15, sarcasm: 2, rumor: 8, attack: 2, sensitive: 3, crisis: 14 },
      riskLevelCounts: { low: 3, medium: 10, high: 18, crisis: 14 },
      actionCounts: { ignore: 1, observe: 8, respond: 15, report: 21 },
      totalCount: 45,
    },
    {
      danmakuId: 'd010',
      riskTypeCounts: { normal: 8, complaint: 12, sarcasm: 5, rumor: 15, attack: 0, sensitive: 2, crisis: 3 },
      riskLevelCounts: { low: 15, medium: 20, high: 8, crisis: 2 },
      actionCounts: { ignore: 10, observe: 18, respond: 14, report: 3 },
      totalCount: 45,
    },
  ],
  case002: [
    {
      danmakuId: 'd105',
      riskTypeCounts: { normal: 3, complaint: 8, sarcasm: 2, rumor: 5, attack: 18, sensitive: 1, crisis: 1 },
      riskLevelCounts: { low: 5, medium: 12, high: 15, crisis: 6 },
      actionCounts: { ignore: 8, observe: 20, respond: 7, report: 3 },
      totalCount: 38,
    },
    {
      danmakuId: 'd108',
      riskTypeCounts: { normal: 5, complaint: 4, sarcasm: 3, rumor: 18, attack: 4, sensitive: 2, crisis: 2 },
      riskLevelCounts: { low: 6, medium: 14, high: 14, crisis: 4 },
      actionCounts: { ignore: 5, observe: 12, respond: 10, report: 11 },
      totalCount: 38,
    },
  ],
};

export const mockPersonalReport: PersonalReport = {
  studentId: 'stu001',
  caseId: 'case001',
  totalAccuracy: 68,
  categoryReports: [
    { category: 'normal', correctCount: 4, wrongCount: 1, accuracy: 80 },
    { category: 'complaint', correctCount: 2, wrongCount: 1, accuracy: 67 },
    { category: 'sarcasm', correctCount: 0, wrongCount: 2, accuracy: 0 },
    { category: 'rumor', correctCount: 1, wrongCount: 2, accuracy: 33 },
    { category: 'attack', correctCount: 0, wrongCount: 0, accuracy: 0 },
    { category: 'sensitive', correctCount: 0, wrongCount: 0, accuracy: 0 },
    { category: 'crisis', correctCount: 0, wrongCount: 1, accuracy: 0 },
  ],
  weakCategories: ['sarcasm', 'rumor', 'crisis'],
  suggestions: [
    '对"讽刺挖苦"类弹幕识别能力较弱，建议加强对反语、隐喻等表达方式的敏感度训练',
    '容易低估"谣言不实"类内容的传播风险，建议结合品牌历史背景综合判断',
    '对"危机信号"缺乏识别意识，需要重点关注包含"个人经历"、"具体症状"的用户发言',
    '直播弹幕筛查不是单纯找脏话，而是要结合场景判断每条发言可能引发的连锁反应',
  ],
  completedAt: '2024-01-16 15:30',
};

export const mockTrainingHistory = [
  {
    id: 'history001',
    caseId: 'case001',
    caseTitle: '美妆品牌新品发布会直播',
    accuracy: 68,
    completedAt: '2024-01-16 15:30',
    duration: 25,
  },
  {
    id: 'history002',
    caseId: 'case002',
    caseTitle: '餐饮品牌食品安全事件回应直播',
    accuracy: 75,
    completedAt: '2024-01-21 10:20',
    duration: 20,
  },
];

const riskTypes: RiskType[] = ['normal', 'complaint', 'sarcasm', 'rumor', 'attack', 'sensitive', 'crisis'];
const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'crisis'];
const actions: ActionType[] = ['ignore', 'observe', 'respond', 'report'];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export const generateSimulatedDistributions = (
  danmakuIds: string[],
  totalCount: number = 45
): ClassDistribution[] => {
  return danmakuIds.slice(0, 3).map(danmakuId => {
    const mainType = pickWeighted(riskTypes, [15, 20, 10, 25, 10, 10, 10]);
    const mainLevel = pickWeighted(riskLevels, [25, 30, 30, 15]);
    const mainAction = pickWeighted(actions, [20, 30, 35, 15]);

    const riskTypeCounts: Record<RiskType, number> = { normal: 0, complaint: 0, sarcasm: 0, rumor: 0, attack: 0, sensitive: 0, crisis: 0 };
    const riskLevelCounts: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, crisis: 0 };
    const actionCounts: Record<ActionType, number> = { ignore: 0, observe: 0, respond: 0, report: 0 };

    for (let i = 0; i < totalCount; i++) {
      const type = Math.random() < 0.4 ? mainType : pickWeighted(riskTypes, [15, 20, 10, 25, 10, 10, 10]);
      riskTypeCounts[type]++;

      const level = Math.random() < 0.35 ? mainLevel : pickWeighted(riskLevels, [25, 30, 30, 15]);
      riskLevelCounts[level]++;

      const action = Math.random() < 0.35 ? mainAction : pickWeighted(actions, [20, 30, 35, 15]);
      actionCounts[action]++;
    }

    return {
      danmakuId,
      riskTypeCounts,
      riskLevelCounts,
      actionCounts,
      totalCount,
    };
  });
};

export const getClassDistributionsForCase = (caseId: string, danmakuIds: string[]): ClassDistribution[] => {
  const existing = mockClassDistributions[caseId];
  if (existing && existing.length > 0) return existing;
  return generateSimulatedDistributions(danmakuIds);
};

export const getDistribution = (caseId: string, danmakuId: string): ClassDistribution | undefined => {
  const distributions = mockClassDistributions[caseId] || [];
  return distributions.find(d => d.danmakuId === danmakuId);
};

export const getStandardAnswer = (caseId: string, danmakuId: string) => {
  return mockStandardAnswers[caseId]?.[danmakuId];
};

const generateMockAnswers = (danmakuIds: string[]): Record<string, { riskType: RiskType; riskLevel: string; action: string }> => {
  const answers: Record<string, { riskType: RiskType; riskLevel: string; action: string }> = {};
  danmakuIds.forEach(id => {
    const type = pickWeighted(riskTypes, [20, 25, 10, 20, 8, 7, 10]);
    const level = pickWeighted(riskLevels, [30, 30, 25, 15]);
    const action = pickWeighted(actions, [20, 30, 35, 15]);
    answers[id] = { riskType: type, riskLevel: level, action };
  });
  return answers;
};

export const calculateReport = (caseId: string, judgments: JudgmentOption[]): PersonalReport => {
  let standard = mockStandardAnswers[caseId] || null;

  if (!standard && judgments.length > 0) {
    standard = generateMockAnswers(judgments.map(j => j.danmakuId));
  }

  const categoryStats: Record<RiskType, { correct: number; wrong: number }> = {
    normal: { correct: 0, wrong: 0 },
    complaint: { correct: 0, wrong: 0 },
    sarcasm: { correct: 0, wrong: 0 },
    rumor: { correct: 0, wrong: 0 },
    attack: { correct: 0, wrong: 0 },
    sensitive: { correct: 0, wrong: 0 },
    crisis: { correct: 0, wrong: 0 },
  };

  let totalCorrect = 0;
  let totalCount = 0;

  judgments.forEach(j => {
    const answer = standard?.[j.danmakuId];
    if (answer) {
      totalCount++;
      if (j.riskType === answer.riskType) {
        categoryStats[answer.riskType].correct++;
        totalCorrect++;
      } else {
        categoryStats[j.riskType].wrong++;
      }
    }
  });

  const categoryReports = Object.entries(categoryStats).map(([category, stats]) => {
    const total = stats.correct + stats.wrong;
    return {
      category: category as RiskType,
      correctCount: stats.correct,
      wrongCount: stats.wrong,
      accuracy: total > 0 ? Math.round((stats.correct / total) * 100) : 0,
    };
  });

  const weakCategories = categoryReports
    .filter(r => r.wrongCount > 0 && r.accuracy < 50)
    .map(r => r.category);

  const suggestions = generateSuggestions(weakCategories);

  return {
    studentId: 'stu001',
    caseId,
    totalAccuracy: totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0,
    categoryReports,
    weakCategories,
    suggestions,
    completedAt: new Date().toLocaleString('zh-CN'),
  };
};

const generateSuggestions = (weakCategories: RiskType[]): string[] => {
  const suggestionMap: Record<RiskType, string> = {
    normal: '对正常发言的判断准确率较好，继续保持',
    complaint: '对"投诉吐槽"类内容的判断需要结合用户情绪强度综合考量',
    sarcasm: '对"讽刺挖苦"类弹幕识别能力较弱，建议加强对反语、隐喻等表达方式的敏感度训练',
    rumor: '容易低估"谣言不实"类内容的传播风险，建议结合品牌历史背景综合判断',
    attack: '对"人身攻击"类内容需要更敏锐地识别攻击性语言',
    sensitive: '对"敏感话题"需要提高政治敏感度和社会议题判断力',
    crisis: '对"危机信号"缺乏识别意识，需要重点关注包含"个人经历"、"具体症状"的用户发言',
  };

  const baseSuggestions = [
    '直播弹幕筛查不是单纯找脏话，而是要结合场景判断每条发言可能引发的连锁反应',
    '建议关注"语境"对同一条弹幕的放大或稀释作用，相同内容在不同场景下风险等级完全不同',
  ];

  const specificSuggestions = weakCategories
    .slice(0, 3)
    .map(c => suggestionMap[c]);

  return [...specificSuggestions, ...baseSuggestions];
};
