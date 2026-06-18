import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockTrainingHistory, mockPersonalReport } from '@/data/mockJudgments';
import { RISK_TYPE_LABELS } from '@/types';
import { formatAccuracyColor, formatDateTime } from '@/utils/risk';
import { useJudgment } from '@/store/judgmentContext';

const ProfilePage: React.FC = () => {
  const { report } = useJudgment();

  const activeReport = report || mockPersonalReport;
  const weakCategories = activeReport?.categoryReports.filter(r => r.wrongCount > 0) || [];

  const totalTrainings = mockTrainingHistory.length;
  const avgAccuracy = totalTrainings > 0
    ? Math.round(mockTrainingHistory.reduce((sum, h) => sum + h.accuracy, 0) / totalTrainings)
    : 0;
  const totalDuration = mockTrainingHistory.reduce((sum, h) => sum + h.duration, 0);

  const handleViewReport = () => {
    Taro.navigateTo({ url: '/pages/report/index' });
  };

  const handleHistoryClick = (caseId: string) => {
    console.log('[Profile] View history:', caseId);
    Taro.showToast({ title: '查看详情', icon: 'none' });
  };

  const handleMenuClick = (key: string) => {
    const navMap: Record<string, () => void> = {
      cases: () => Taro.switchTab({ url: '/pages/cases/index' }),
      review: () => Taro.navigateTo({ url: '/pages/review/index' }),
      report: () => Taro.navigateTo({ url: '/pages/report/index' }),
    };
    navMap[key]?.();
  };

  const categoryIcons: Record<string, string> = {
    sarcasm: '🎭',
    rumor: '📢',
    crisis: '⚠️',
    complaint: '😤',
    sensitive: '🔴',
    attack: '👊',
    normal: '✅',
  };

  const menuItems = [
    { key: 'cases', icon: '📚', text: '案例库', color: '#EEF2FF' },
    { key: 'review', icon: '💬', text: '教师点评库', color: '#FFFBEB' },
    { key: 'report', icon: '📊', text: '完整训练报告', color: '#ECFDF5' },
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userCard}>
          <View className={styles.avatar}>张</View>
          <View className={styles.userInfo}>
            <Text className={styles.userName}>张同学</Text>
            <Text className={styles.userClass}>新闻传播学院 · 2班</Text>
            <Text className={styles.courseName}>舆情监测与危机管理</Text>
          </View>
        </View>
      </View>

      <View className={styles.container}>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{totalTrainings}</Text>
            <Text className={styles.statLabel}>训练次数</Text>
          </View>
          <View className={styles.statCard}>
            <Text
              className={styles.statValue}
              style={{ color: formatAccuracyColor(avgAccuracy) }}
            >
              {avgAccuracy}%
            </Text>
            <Text className={styles.statLabel}>平均准确率</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{totalDuration}</Text>
            <Text className={styles.statLabel}>累计分钟</Text>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text>薄弱类别分析</Text>
          <Text className={styles.more} onClick={handleViewReport}>查看详情</Text>
        </View>

        <View className={styles.weakCategorySection}>
          <Text className={styles.categoryTitle}>需要加强的风险类型</Text>
          <View className={styles.categoryList}>
            {weakCategories.length > 0 ? (
              weakCategories.slice(0, 4).map(category => (
                <View key={category.category} className={styles.categoryItem}>
                  <View className={styles.categoryIcon}>
                    {categoryIcons[category.category] || '📋'}
                  </View>
                  <View className={styles.categoryInfo}>
                    <Text className={styles.categoryName}>
                      {RISK_TYPE_LABELS[category.category]}
                    </Text>
                    <View className={styles.accuracyBar}>
                      <View className={styles.accuracyTrack}>
                        <View
                          className={styles.accuracyFill}
                          style={{
                            width: `${category.accuracy}%`,
                            backgroundColor: formatAccuracyColor(category.accuracy),
                          }}
                        />
                      </View>
                      <Text className={styles.accuracyText}>{category.accuracy}%</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: '24rpx', textAlign: 'center', padding: '32rpx 0' }}>
                暂无数据，请先完成训练
              </Text>
            )}
          </View>
          <View className={styles.tips}>
            <Text className={styles.tipsTitle}>💡 学习建议</Text>
            <Text className={styles.tipsText}>
              直播弹幕筛查不是单纯找脏话，而是要结合场景判断每条发言可能引发的连锁反应。
              建议重点关注包含"个人经历"、"具体指控"的发言，这些往往是危机爆发的起点。
            </Text>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text>训练历史</Text>
        </View>

        <View className={styles.historySection}>
          {mockTrainingHistory.map(record => {
            const accuracyClass = record.accuracy >= 80 ? 'high' : record.accuracy >= 60 ? 'medium' : 'low';
            return (
              <View
                key={record.id}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(record.caseId)}
              >
                <View className={styles.caseIcon}>📋</View>
                <View className={styles.caseInfo}>
                  <Text className={styles.caseTitle}>{record.caseTitle}</Text>
                  <View className={styles.caseMeta}>
                    <Text>{formatDateTime(record.completedAt)}</Text>
                    <Text>{record.duration}分钟</Text>
                  </View>
                </View>
                <View className={styles.accuracyBadge}>
                  <Text
                    className={classnames(styles.accuracyValue, styles[accuracyClass])}
                    style={{ color: formatAccuracyColor(record.accuracy) }}
                  >
                    {record.accuracy}%
                  </Text>
                  <Text className={styles.accuracyLabel}>准确率</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className={styles.sectionTitle}>
          <Text>更多功能</Text>
        </View>

        <View className={styles.menuSection}>
          {menuItems.map(item => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={styles.menuIcon} style={{ backgroundColor: item.color }}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.menuText}>{item.text}</Text>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
