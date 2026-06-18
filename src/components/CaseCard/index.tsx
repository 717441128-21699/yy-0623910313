import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Case } from '@/types';

interface CaseCardProps {
  caseData: Case;
  onStart?: () => void;
  showStartButton?: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData, onStart, showStartButton = true }) => {
  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      Taro.navigateTo({
        url: `/pages/judgment/index?caseId=${caseData.id}`,
      });
    }
  };

  return (
    <View className={styles.caseCard}>
      <Image className={styles.cover} src={caseData.cover} mode="aspectFill" />
      <View className={styles.content}>
        <Text className={styles.title}>{caseData.title}</Text>
        <Text className={styles.description}>{caseData.description}</Text>
        <View className={styles.meta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>授课教师</Text>
            <Text className={styles.metaValue}>{caseData.teacherName}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>参训人数</Text>
            <Text className={styles.metaValue}>{caseData.studentCount}人</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>弹幕数</Text>
            <Text className={styles.metaValue}>{caseData.danmakus.length}条</Text>
          </View>
        </View>
        {showStartButton && (
          <Button className={styles.startBtn} onClick={handleStart}>
            开始研判
          </Button>
        )}
      </View>
    </View>
  );
};

export default CaseCard;
