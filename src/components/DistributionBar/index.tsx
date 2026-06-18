import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { RISK_TYPE_LABELS, RISK_LEVEL_LABELS, ACTION_LABELS } from '@/types';

interface DistributionBarProps {
  data: Record<string, number>;
  totalCount: number;
  type: 'riskType' | 'riskLevel' | 'action';
  labels: Record<string, string>;
}

const COLOR_MAP: Record<string, string> = {
  normal: '#94A3B8',
  complaint: '#F59E0B',
  sarcasm: '#8B5CF6',
  rumor: '#EF4444',
  attack: '#DC2626',
  sensitive: '#F97316',
  crisis: '#B91C1C',
  low: '#059669',
  medium: '#F59E0B',
  high: '#EA580C',
  crisis: '#DC2626',
  ignore: '#94A3B8',
  observe: '#3B82F6',
  respond: '#059669',
  report: '#DC2626',
};

const DistributionBar: React.FC<DistributionBarProps> = ({ data, totalCount, labels }) => {
  const entries = Object.entries(data).filter(([, count]) => count > 0);

  return (
    <View className={styles.distributionBar}>
      <View className={styles.barContainer}>
        {entries.map(([key, count]) => {
          const percentage = (count / totalCount) * 100;
          const color = COLOR_MAP[key] || '#94A3B8';
          return (
            <View
              key={key}
              className={styles.barSegment}
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          );
        })}
      </View>
      <View className={styles.legend}>
        {entries.map(([key, count]) => {
          const percentage = ((count / totalCount) * 100).toFixed(0);
          const color = COLOR_MAP[key] || '#94A3B8';
          const label = labels[key] || key;
          return (
            <View key={key} className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: color }} />
              <Text className={styles.legendLabel}>{label}</Text>
              <Text className={styles.legendValue}>{count}人 ({percentage}%)</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DistributionBar;
