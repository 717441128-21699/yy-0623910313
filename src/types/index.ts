export type RiskLevel = 'low' | 'medium' | 'high' | 'crisis';

export type RiskType =
  | 'normal'
  | 'complaint'
  | 'sarcasm'
  | 'rumor'
  | 'attack'
  | 'sensitive'
  | 'crisis';

export type ActionType = 'ignore' | 'observe' | 'respond' | 'report';

export interface Danmaku {
  id: string;
  content: string;
  timestamp: number;
  userId: string;
  userName: string;
}

export interface CaseContext {
  background: string;
  anchor: string;
  brand: string;
  situation: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  cover: string;
  context: CaseContext;
  danmakus: Danmaku[];
  createdAt: string;
  teacherName: string;
  studentCount: number;
  isCustom?: boolean;
}

export interface JudgmentOption {
  danmakuId: string;
  riskType: RiskType;
  riskLevel: RiskLevel;
  action: ActionType;
  note?: string;
}

export interface StudentJudgment {
  studentId: string;
  studentName: string;
  judgments: JudgmentOption[];
  submittedAt: string;
}

export interface ClassDistribution {
  danmakuId: string;
  riskTypeCounts: Record<RiskType, number>;
  riskLevelCounts: Record<RiskLevel, number>;
  actionCounts: Record<ActionType, number>;
  totalCount: number;
}

export interface TeacherAnnotation {
  danmakuId: string;
  isKey: boolean;
  context: string;
  spreadPotential: string;
  timing: string;
  explanation: string;
}

export interface ReportCategory {
  category: RiskType;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
}

export interface PersonalReport {
  studentId: string;
  caseId: string;
  totalAccuracy: number;
  categoryReports: ReportCategory[];
  weakCategories: RiskType[];
  suggestions: string[];
  completedAt: string;
}

export const RISK_TYPE_LABELS: Record<RiskType, string> = {
  normal: '正常发言',
  complaint: '投诉吐槽',
  sarcasm: '讽刺挖苦',
  rumor: '谣言不实',
  attack: '人身攻击',
  sensitive: '敏感话题',
  crisis: '危机信号',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
  crisis: '危机',
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  low: '#059669',
  medium: '#F59E0B',
  high: '#EA580C',
  crisis: '#DC2626',
};

export const ACTION_LABELS: Record<ActionType, string> = {
  ignore: '忽略',
  observe: '观察',
  respond: '回应',
  report: '上报',
};

export interface Group {
  id: string;
  name: string;
  studentIds: string[];
}

export type AssignmentStatus = 'pending' | 'submitted' | 'reviewed';

export interface Assignment {
  id: string;
  caseId: string;
  title: string;
  teacherName: string;
  groupId: string;
  groupName: string;
  createdAt: string;
  deadline?: string;
  status: AssignmentStatus;
  submittedAt?: string;
  reviewedAt?: string;
  studentId: string;
  studentName: string;
  accuracy?: number;
}

export interface GroupDistribution {
  groupId: string;
  groupName: string;
  accuracy: number;
  totalCount: number;
  danmakuDistributions: ClassDistribution[];
}

export interface CaseClassAnalysis {
  caseId: string;
  overallAccuracy: number;
  totalStudents: number;
  groupDistributions: GroupDistribution[];
  mostControversialDanmakus: {
    danmakuId: string;
    content: string;
    controversyScore: number;
  }[];
}
