import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Case, JudgmentOption, PersonalReport } from '@/types';
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
  generateReport: () => void;
  resetJudgment: () => void;
}

const JudgmentContext = createContext<JudgmentContextType | undefined>(undefined);

export const JudgmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [currentDanmakuIndex, setCurrentDanmakuIndex] = useState(0);
  const [judgments, setJudgments] = useState<JudgmentOption[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [report, setReport] = useState<PersonalReport | null>(null);

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

  const generateReport = useCallback(() => {
    if (!currentCase) return;
    const newReport = calculateReport(currentCase.id, judgments);
    setReport(newReport);
    setIsSubmitted(true);
    console.log('[Judgment] Report generated:', newReport);
  }, [currentCase, judgments]);

  const resetJudgment = useCallback(() => {
    setCurrentCase(null);
    setCurrentDanmakuIndex(0);
    setJudgments([]);
    setIsSubmitted(false);
    setReport(null);
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
