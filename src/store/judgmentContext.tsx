import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import type { Case, JudgmentOption, PersonalReport, TeacherAnnotation, Assignment, Group, CaseClassAnalysis, GroupDistribution, Danmaku } from '@/types';
import { calculateReport, generateSimulatedDistributions, generateMockAnswers } from '@/data/mockJudgments';
import { mockCases } from '@/data/mockCases';

const STORAGE_KEYS = {
  CUSTOM_CASES: 'danmaku_custom_cases',
  CUSTOM_ANNOTATIONS: 'danmaku_custom_annotations',
  ASSIGNMENTS: 'danmaku_assignments',
  LAST_REPORT: 'danmaku_last_report',
  LAST_CASE_ID: 'danmaku_last_case_id',
};

const DEFAULT_GROUPS: Group[] = [
  { id: 'group_class2', name: '新闻2班', studentIds: ['stu001', 'stu002', 'stu003'] },
  { id: 'group_club', name: '舆情社团小组', studentIds: ['stu001', 'stu004', 'stu005'] },
];

const STUDENT_NAMES: Record<string, string> = {
  stu001: '张同学',
  stu002: '李同学',
  stu003: '王同学',
  stu004: '赵同学',
  stu005: '孙同学',
};

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
  getCaseClassAnalysis: (caseId: string, danmakus: Danmaku[]) => CaseClassAnalysis | null;
  currentStudentId: string;
  currentStudentName: string;
  lastReport: PersonalReport | null;
  lastCaseId: string | null;
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

const generateCaseClassAnalysis = (
  caseId: string,
  danmakus: Danmaku[],
  groupList: Group[]
): CaseClassAnalysis => {
  const danmakuIds = danmakus.map(d => d.id);

  const groupDistributions: GroupDistribution[] = groupList.slice(0, 2).map(group => {
    const accuracy = 50 + Math.floor(Math.random() * 35);
    const totalCount = Math.min(group.studentIds.length, 8) + Math.floor(Math.random() * 4);
    return {
      groupId: group.id,
      groupName: group.name,
      accuracy,
      totalCount,
      danmakuDistributions: generateSimulatedDistributions(danmakuIds, totalCount),
    };
  });

  const mostControversial = danmakus.slice(0, 3).map((d, idx) => ({
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
  const [lastReport, setLastReport] = useState<PersonalReport | null>(null);
  const [lastCaseId, setLastCaseId] = useState<string | null>(null);

  const currentStudentId = 'stu001';
  const currentStudentName = '张同学';

  useEffect(() => {
    const initStorage = async () => {
      const [loadedCases, loadedAnnotations, loadedAssignments, loadedLastReport, loadedLastCaseId] = await Promise.all([
        loadFromStorage<Case[]>(STORAGE_KEYS.CUSTOM_CASES, []),
        loadFromStorage<Record<string, TeacherAnnotation[]>>(STORAGE_KEYS.CUSTOM_ANNOTATIONS, {}),
        loadFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []),
        loadFromStorage<PersonalReport | null>(STORAGE_KEYS.LAST_REPORT, null),
        loadFromStorage<string | null>(STORAGE_KEYS.LAST_CASE_ID, null),
      ]);
      setCustomCases(loadedCases);
      setCustomAnnotations(loadedAnnotations);
      setAssignments(loadedAssignments);
      setLastReport(loadedLastReport);
      setLastCaseId(loadedLastCaseId);
      console.log('[Storage] Loaded all data');
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

  useEffect(() => {
    if (lastReport) {
      saveToStorage(STORAGE_KEYS.LAST_REPORT, lastReport);
    }
  }, [lastReport]);

  useEffect(() => {
    if (lastCaseId) {
      saveToStorage(STORAGE_KEYS.LAST_CASE_ID, lastCaseId);
    }
  }, [lastCaseId]);

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
    setLastReport(newReport);
    setLastCaseId(currentCase.id);
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
    setCustomCases(prev => [...prev, caseData]);
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

    const newAssignments: Assignment[] = group.studentIds.map((studentId, index) => ({
      id: `assign_${Date.now()}_${index}`,
      caseId,
      title: caseData.title,
      teacherName: caseData.teacherName,
      groupId,
      groupName: group.name,
      createdAt: new Date().toLocaleString('zh-CN'),
      deadline,
      status: 'pending' as const,
      studentId,
      studentName: STUDENT_NAMES[studentId] || `同学${index + 1}`,
    }));

    setAssignments(prev => {
      const filtered = prev.filter(a => !(a.caseId === caseId && a.groupId === groupId));
      return [...filtered, ...newAssignments];
    });
    Taro.showToast({ title: `已发布给${group.name}的${group.studentIds.length}位同学`, icon: 'success' });
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

  const getCaseClassAnalysis = useCallback((caseId: string, danmakus: Danmaku[]): CaseClassAnalysis | null => {
    if (!danmakus || danmakus.length === 0) return null;
    if (classAnalysisCache[caseId]) return classAnalysisCache[caseId];

    const analysis = generateCaseClassAnalysis(caseId, danmakus, groups);
    setClassAnalysisCache(prev => ({ ...prev, [caseId]: analysis }));
    return analysis;
  }, [groups, classAnalysisCache]);

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
        lastReport,
        lastCaseId,
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
