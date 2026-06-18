import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import type { Case, JudgmentOption, PersonalReport, TeacherAnnotation, Assignment, Group, CaseClassAnalysis, GroupDistribution } from '@/types';
import { calculateReport, generateSimulatedDistributions, generateMockAnswers } from '@/data/mockJudgments';
import { mockCases } from '@/data/mockCases';

const STORAGE_KEYS = {
  CUSTOM_CASES: 'danmaku_custom_cases',
  CUSTOM_ANNOTATIONS: 'danmaku_custom_annotations',
  ASSIGNMENTS: 'danmaku_assignments',
  TRAINING_HISTORY: 'danmaku_training_history',
};

const DEFAULT_GROUPS: Group[] = [
  { id: 'group_class2', name: '新闻2班', studentIds: ['stu001', 'stu002', 'stu003'] },
  { id: 'group_club', name: '舆情社团小组', studentIds: ['stu001', 'stu004', 'stu005'] },
];

interface JudgmentContextType {
  currentCase: Case | null;
  setCurrentCase: (caseData: Case | null) => void;
  currentDanmakuIndex: number;
  setCurrentDanmakuIndex: (index: number) => void;
  judgments: JudgmentOption[];
  setJudgment: (judgment: JudgmentOption) => void;
  getJudgment: (danmakuId: string) => JudgmentOption | undefined;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  report: PersonalReport | null;
  generateReport: (overrideJudgments?: JudgmentOption[]) => void;
  resetJudgment: () => void;
  customCases: Case[];
  addCustomCase: (caseData: Case) => void;
  customAnnotations: Record<string, TeacherAnnotation[]>;
  addAnnotation: (caseId: string, annotation: TeacherAnnotation) => void;
  updateAnnotation: (caseId: string, danmakuId: string, annotation: Partial<TeacherAnnotation>) => void;
  removeAnnotation: (caseId: string, danmakuId: string) => void;
  assignments: Assignment[];
  publishAssignment: (caseId: string, groupId: string, deadline?: string) => void;
  submitAssignment: (caseId: string, accuracy: number) => void;
  reviewAssignment: (assignmentId: string) => void;
  groups: Group[];
  getCaseClassAnalysis: (caseId: string) => CaseClassAnalysis | null;
  currentStudentId: string;
  currentStudentName: string;
}

const JudgmentContext = createContext<JudgmentContextType | undefined>(undefined);

const loadFromStorage = async <T,>(key: string, defaultValue: T): Promise<T> => {
  try {
    const data = await Taro.getStorage({ key });
    if (data?.data) {
      return typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
    }
  } catch (e) {
    console.log(`[Storage] No data for key: ${key}`);
  }
  return defaultValue;
};

const saveToStorage = async <T,>(key: string, value: T): Promise<void> => {
  try {
    await Taro.setStorage({ key, data: JSON.stringify(value) });
  } catch (e) {
    console.error(`[Storage] Failed to save key: ${key}`, e);
  }
};

const generateCaseClassAnalysis = (caseId: string, danmakuIds: string[], groupList: Group[]): CaseClassAnalysis => {
  const groupDistributions: GroupDistribution[] = groupList.slice(0, 3).map(group => {
    const accuracy = 50 + Math.floor(Math.random() * 35);
    const totalCount = 8 + Math.floor(Math.random() * 8);
    return {
      groupId: group.id,
      groupName: group.name,
      accuracy,
      totalCount,
      danmakuDistributions: generateSimulatedDistributions(danmakuIds, totalCount),
    };
  });

  const allCases = [...mockCases];
  const caseData = allCases.find(c => c.id === caseId);
  const danmakuList = caseData?.danmakus || [];

  const mostControversial = danmakuList.slice(0, 3).map((d, idx) => ({
    danmakuId: d.id,
    content: d.content,
    controversyScore: 65 + idx * 10 + Math.floor(Math.random() * 15),
  })).sort((a, b) => b.controversyScore - a.controversyScore);

  const overallAccuracy = Math.round(groupDistributions.reduce((s, g) => s + g.accuracy, 0) / groupDistributions.length);
  const totalStudents = groupDistributions.reduce((s, g) => s + g.totalCount, 0);

  return {
    caseId,
    overallAccuracy,
    totalStudents,
    groupDistributions,
    mostControversialDanmakus: mostControversial,
  };
};

export const JudgmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [currentDanmakuIndex, setCurrentDanmakuIndex] = useState(0);
  const [judgments, setJudgments] = useState<JudgmentOption[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState<PersonalReport | null>(null);
  const [customCases, setCustomCases] = useState<Case[]>([]);
  const [customAnnotations, setCustomAnnotations] = useState<Record<string, TeacherAnnotation[]>>({});
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [groups] = useState<Group[]>(DEFAULT_GROUPS);
  const [classAnalysisCache, setClassAnalysisCache] = useState<Record<string, CaseClassAnalysis>>({});

  const currentStudentId = 'stu001';
  const currentStudentName = '张同学';

  useEffect(() => {
    const initStorage = async () => {
      const [loadedCases, loadedAnnotations, loadedAssignments] = await Promise.all([
        loadFromStorage<Case[]>(STORAGE_KEYS.CUSTOM_CASES, []),
        loadFromStorage<Record<string, TeacherAnnotation[]>>(STORAGE_KEYS.CUSTOM_ANNOTATIONS, {}),
        loadFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []),
      ]);
      setCustomCases(loadedCases);
      setCustomAnnotations(loadedAnnotations);
      setAssignments(loadedAssignments);
      console.log('[Storage] Loaded:', { loadedCases, loadedAnnotations, loadedAssignments });
    };
    initStorage();
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOM_CASES, customCases);
  }, [customCases]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOM_ANNOTATIONS, customAnnotations);
  }, [customAnnotations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }, [assignments]);

  const setJudgment = useCallback((judgment: JudgmentOption) => {
    setJudgments(prev => {
      const existingIndex = prev.findIndex(j => j.danmakuId === judgment.danmakuId);
      if (existingIndex >= 0) {
        const newJudgments = [...prev];
        newJudgments[existingIndex] = judgment;
        return newJudgments;
      }
      return [...prev, judgment];
    });
  }, []);

  const getJudgment = useCallback((danmakuId: string) => {
    return judgments.find(j => j.danmakuId === danmakuId);
  }, [judgments]);

  const generateReport = useCallback((overrideJudgments?: JudgmentOption[]) => {
    if (!currentCase) return;
    const finalJudgments = overrideJudgments || judgments;
    const newReport = calculateReport(currentCase.id, finalJudgments);
    setReport(newReport);
    setIsSubmitted(true);
    setJudgments(finalJudgments);
    console.log('[Judgment] Report generated:', newReport);
  }, [currentCase, judgments]);

  const resetJudgment = useCallback(() => {
    setCurrentCase(null);
    setCurrentDanmakuIndex(0);
    setJudgments([]);
    setIsSubmitted(false);
    setReport(null);
  }, []);

  const addCustomCase = useCallback((caseData: Case) => {
    setCustomCases(prev => {
      const next = [...prev, caseData];
      return next;
    });
  }, []);

  const addAnnotation = useCallback((caseId: string, annotation: TeacherAnnotation) => {
    setCustomAnnotations(prev => {
      const existing = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: [...existing, annotation],
      };
    });
  }, []);

  const updateAnnotation = useCallback((caseId: string, danmakuId: string, partial: Partial<TeacherAnnotation>) => {
    setCustomAnnotations(prev => {
      const existing = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: existing.map(a =>
          a.danmakuId === danmakuId ? { ...a, ...partial } : a
        ),
      };
    });
  }, []);

  const removeAnnotation = useCallback((caseId: string, danmakuId: string) => {
    setCustomAnnotations(prev => {
      const existing = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: existing.filter(a => a.danmakuId !== danmakuId),
      };
    });
  }, []);

  const publishAssignment = useCallback((caseId: string, groupId: string, deadline?: string) => {
    const allCases = [...mockCases, ...customCases];
    const caseData = allCases.find(c => c.id === caseId);
    const group = groups.find(g => g.id === groupId);
    if (!caseData || !group) return;

    const newAssignments: Assignment[] = [
      { id: `assign_${Date.now()}_1`, caseId, title: caseData.title, teacherName: caseData.teacherName, groupId, groupName: group.name, createdAt: new Date().toLocaleString('zh-CN'), deadline, status: 'pending', studentId: 'stu001', studentName: '张同学' },
      { id: `assign_${Date.now()}_2`, caseId, title: caseData.title, teacherName: caseData.teacherName, groupId, groupName: group.name, createdAt: new Date().toLocaleString('zh-CN'), deadline, status: 'submitted', submittedAt: new Date().toLocaleString('zh-CN'), studentId: 'stu002', studentName: '李同学', accuracy: 72 },
      { id: `assign_${Date.now()}_3`, caseId, title: caseData.title, teacherName: caseData.teacherName, groupId, groupName: group.name, createdAt: new Date().toLocaleString('zh-CN'), deadline, status: 'reviewed', submittedAt: new Date(Date.now() - 86400000).toLocaleString('zh-CN'), reviewedAt: new Date(Date.now() - 3600000).toLocaleString('zh-CN'), studentId: 'stu003', studentName: '王同学', accuracy: 85 },
    ];

    setAssignments(prev => [...prev, ...newAssignments]);
    Taro.showToast({ title: `已发布给${group.name}`, icon: 'success' });
  }, [customCases, groups]);

  const submitAssignment = useCallback((caseId: string, accuracy: number) => {
    setAssignments(prev => prev.map(a => {
      if (a.caseId === caseId && a.studentId === currentStudentId && a.status === 'pending') {
        return { ...a, status: 'submitted' as const, submittedAt: new Date().toLocaleString('zh-CN'), accuracy };
      }
      return a;
    }));
  }, [currentStudentId]);

  const reviewAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return { ...a, status: 'reviewed' as const, reviewedAt: new Date().toLocaleString('zh-CN') };
      }
      return a;
    }));
    Taro.showToast({ title: '已点评', icon: 'success' });
  }, []);

  const getCaseClassAnalysis = useCallback((caseId: string): CaseClassAnalysis | null => {
    if (!currentCase) return null;
    if (classAnalysisCache[caseId]) return classAnalysisCache[caseId];

    const danmakuIds = currentCase.danmakus.map(d => d.id);
    const analysis = generateCaseClassAnalysis(caseId, danmakuIds, groups);
    setClassAnalysisCache(prev => ({ ...prev, [caseId]: analysis }));
    return analysis;
  }, [currentCase, groups, classAnalysisCache]);

  return (
    <JudgmentContext.Provider
      value={{
        currentCase,
        setCurrentCase,
        currentDanmakuIndex,
        setCurrentDanmakuIndex,
        judgments,
        setJudgment,
        getJudgment,
        isSubmitted,
        setIsSubmitted,
        report,
        generateReport,
        resetJudgment,
        customCases,
        addCustomCase,
        customAnnotations,
        addAnnotation,
        updateAnnotation,
        removeAnnotation,
        assignments,
        publishAssignment,
        submitAssignment,
        reviewAssignment,
        groups,
        getCaseClassAnalysis,
        currentStudentId,
        currentStudentName,
      }}
    >
      {children}
    </JudgmentContext.Provider>
  );
};

export const useJudgment = () => {
  const context = useContext(JudgmentContext);
  if (!context) {
    throw new Error('useJudgment must be used within a JudgmentProvider');
  }
  return context;
};
