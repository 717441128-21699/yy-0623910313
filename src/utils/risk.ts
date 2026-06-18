import type { RiskLevel } from '@/types';

export const getRiskLevelColor = (level: RiskLevel): string => {
  const colorMap: Record<RiskLevel, string> = {
    low: '#059669',
    medium: '#F59E0B',
    high: '#EA580C',
    crisis: '#DC2626',
  };
  return colorMap[level];
};

export const getRiskLevelBgColor = (level: RiskLevel): string => {
  const colorMap: Record<RiskLevel, string> = {
    low: 'rgba(5, 150, 105, 0.1)',
    medium: 'rgba(245, 158, 11, 0.1)',
    high: 'rgba(234, 88, 12, 0.1)',
    crisis: 'rgba(220, 38, 38, 0.1)',
  };
  return colorMap[level];
};

export const formatAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 80) return '#059669';
  if (accuracy >= 60) return '#F59E0B';
  if (accuracy >= 40) return '#EA580C';
  return '#DC2626';
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hour}:${minute}`;
};
