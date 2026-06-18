import React, { useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useJudgment } from '@/store/judgmentContext';
import { mockCases } from '@/data/mockCases';
import { RISK_TYPE_LABELS } from '@/types';
import { formatAccuracyColor } from '@/utils/risk';
import type { PersonalReport } from '@/types';

const ReportPage: React.FC = () => {
  const { report, currentCase, customCases, resetJudgment, lastReport, lastCaseId, setCurrentCase } = useJudgment();

  const allCases = useMemo(() => [...mockCases, ...customCases], [customCases]);

  const activeReport: PersonalReport | null = report || lastReport;
  const displayCaseId = currentCase?.id || lastCaseId;
  const caseData = displayCaseId ? allCases.find(c => c.id === displayCaseId) : undefined;

  if (!activeReport) {
    return (
      <ScrollView scrollY className={styles.page}>
        <View className={styles.container}>
          <Text className={styles.pageTitle}>训练报告</Text>
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📊</Text>
            <Text className={styles.emptyTitle}>还没有训练记录</Text>
            <Text className={styles.emptyDesc}>
              请先完成一次弹幕风险研判训练，
              {"\n"}
              再来查看你的专属分析报告
            </Text>
            <Button className={styles.goBtn} onClick={() => Taro.switchTab({ url: '/pages/judgment/index' })}>
              开始训练
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  const getScoreLevel = (accuracy: number): string => {
    if (accuracy >= 90) return '优秀';
    if (accuracy >= 80) return '良好';
    if (accuracy >= 60) return '及格';
    return '需加强';
  };

  const getAccuracyClass = (accuracy: number, hasData: boolean): string => {
    if (!hasData) return 'zero';
    if (accuracy >= 80) return 'high';
    if (accuracy >= 60) return 'medium';
    return 'low';
  };

  const categoryIcons: Record<string, string> = {
    normal: '✅',
    complaint: '😤',
    sarcasm: '🎭',
    rumor: '📢',
    attack: '👊',
    sensitive: '🔴',
    crisis: '⚠️',
  };

  const categoryBgColors: Record<string, string> = {
    normal: '#ECFDF5',
    complaint: '#FEF3C7',
    sarcasm: '#F3E8FF',
    rumor: '#FEE2E2',
    attack: '#FEE2E2',
    sensitive: '#FEF3C7',
    crisis: '#FEE2E2',
  };

  const handleGoReview = () => {
    Taro.navigateTo({ url: '/pages/review/index' });
  };

  const handleRetry = () => {
    if (caseData) {
      resetJudgment();
      setCurrentCase(caseData);
      Taro.switchTab({ url: '/pages/judgment/index' });
    } else {
      Taro.showToast({ title: '请先选择案例', icon: 'none' });
    }
  };

  const handleGoCases = () => {
    resetJudgment();
    Taro.switchTab({ url: '/pages/cases/index' });
  };

  const scoreLevel = getScoreLevel(activeReport.totalAccuracy);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.container}>
        <Text className={styles.pageTitle}>训练报告</Text>
        <Text className={styles.pageSubtitle}>{caseData?.title || '个人训练分析'}</Text>

        <View className={styles.scoreCard}>
          <Text className={styles.scoreLabel}>综合准确率</Text>
          <Text className={styles.scoreValue}>
            {activeReport.totalAccuracy}
            <Text className={styles.scoreUnit}>%</Text>
          </Text>
          <Text className={styles.scoreLevel}>{scoreLevel}</Text>
          <Text className={styles.completeTime}>
            完成时间：{activeReport.completedAt}
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text>
              <Text className={styles.icon}>📊</Text>
              分类准确率
            </Text>
          </Text>
          <View className={styles.categoryStats}>
            {activeReport.categoryReports
              .filter(r => r.correctCount > 0 || r.wrongCount > 0)
              .map(category => {
                const hasData = category.correctCount + category.wrongCount > 0;
                return (
                  <View key={category.category} className={styles.statRow}>
                    <View
                      className={styles.categoryIcon}
                      style={{ backgroundColor: categoryBgColors[category.category] }}
                    >
                      <Text>{categoryIcons[category.category]}</Text>
                    </View>
                    <View className={styles.categoryInfo}>
                      <Text className={styles.categoryName}>
                        {RISK_TYPE_LABELS[category.category]}
                      </Text>
                      <Text className={styles.categoryCounts}>
                        正确 {category.correctCount} / 错误 {category.wrongCount}
                      </Text>
                    </View>
                    <View className={styles.accuracyBadge}>
                      <Text
                        className={classnames(
                          styles.accuracyValue,
                          styles[getAccuracyClass(category.accuracy, hasData)]
                        )}
                        style={{
                          color: hasData
                            ? formatAccuracyColor(category.accuracy)
                            : '#CBD5E1',
                        }}
                      >
                        {hasData ? category.accuracy : '-'}
                      </Text>
                      <Text className={styles.accuracyLabel}>
                        {hasData ? '准确率' : '无数据'}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </View>

        {activeReport.weakCategories.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text>
                <Text className={styles.icon}>⚠️</Text>
                薄弱类别
              </Text>
            </Text>
            <View className={styles.weakSection}>
              <Text className={styles.weakTitle}>
                以下类别需要重点加强训练
              </Text>
              <View className={styles.weakList}>
                {activeReport.weakCategories.slice(0, 3).map((category, idx) => (
                  <View key={category} className={styles.weakItem}>
                    <View className={styles.weakIcon}>
                      <Text>{idx + 1}</Text>
                    </View>
                    <View className={styles.weakContent}>
                      <Text className={styles.weakCategory}>
                        {RISK_TYPE_LABELS[category]}
                      </Text>
                      <Text className={styles.weakDesc}>
                        对这类弹幕的识别能力较弱，建议结合教师点评反复练习
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text>
              <Text className={styles.icon}>💡</Text>
              学习建议
            </Text>
          </Text>
          <View className={styles.suggestionSection}>
            <View className={styles.suggestionList}>
              {activeReport.suggestions.map((suggestion, idx) => (
                <View key={idx} className={styles.suggestionItem}>
                  <View className={styles.suggestionIcon}>
                    <Text>{idx + 1}</Text>
                  </View>
                  <Text className={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.actionBar}>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={handleGoReview}
          >
            教师点评
          </Button>
          <Button
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={handleRetry}
          >
            再次训练
          </Button>
        </View>

        <View className={styles.actionBar} style={{ marginTop: '16rpx' }}>
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={handleGoCases}
            style={{ flex: 1 }}
          >
            选择其他案例
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportPage;
