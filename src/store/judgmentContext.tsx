import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Case, JudgmentOption, PersonalReport, TeacherAnnotation } from '@/types';
import { calculateReport } from '@/data/mockJudgments';

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
}

const JudgmentContext = createContext<JudgmentContextType | undefined>(undefined);

export const JudgmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [currentDanmakuIndex, setCurrentDanmakuIndex] = useState(0);
  const [judgments, setJudgments] = useState<JudgmentOption[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState<PersonalReport | null>(null);
  const [customCases, setCustomCases] = useState<Case[]>([]);
  const [customAnnotations, setCustomAnnotations] = useState<Record<string, TeacherAnnotation[]>>({});

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
