import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import RiskTag from '@/components/RiskTag';
import type { Danmaku, RiskLevel } from '@/types';

interface DanmakuItemProps {
  danmaku: Danmaku;
  index: number;
  selected?: boolean;
  riskLevel?: RiskLevel;
  isKey?: boolean;
  onClick?: () => void;
}

const DanmakuItem: React.FC<DanmakuItemProps> = ({
  danmaku,
  index,
  selected = false,
  riskLevel,
  isKey = false,
  onClick,
}) => {
  return (
    <View
      className={classnames(
        styles.danmakuItem,
        selected && styles.selected,
        isKey && styles.isKey
      )}
      onClick={onClick}
    >
      <View className={styles.header}>
        <View className={styles.indexBadge}>{index + 1}</View>
        <Text className={styles.userName}>{danmaku.userName}</Text>
        {isKey && (
          <View className={styles.keyBadge}>
            <Text className={styles.keyText}>关键弹幕</Text>
          </View>
        )}
        {riskLevel && (
          <View className={styles.riskTagWrapper}>
            <RiskTag level={riskLevel} size="sm" />
          </View>
        )}
      </View>
      <Text className={styles.content}>{danmaku.content}</Text>
    </View>
  );
};

export default DanmakuItem;
