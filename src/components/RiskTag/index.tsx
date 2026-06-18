import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { RiskLevel } from '@/types';
import { RISK_LEVEL_LABELS, RISK_LEVEL_COLORS } from '@/types';

interface RiskTagProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const RiskTag: React.FC<RiskTagProps> = ({ level, size = 'md', showLabel = true }) => {
  const color = RISK_LEVEL_COLORS[level];
  const label = RISK_LEVEL_LABELS[level];

  return (
    <View
      className={classnames(styles.riskTag, styles[`size${size.toUpperCase()}`])}
      style={{ backgroundColor: `${color}15`, borderColor: color }}
    >
      <View className={styles.dot} style={{ backgroundColor: color }} />
      {showLabel && <Text className={styles.label} style={{ color }}>{label}</Text>}
    </View>
  );
};

export default RiskTag;
