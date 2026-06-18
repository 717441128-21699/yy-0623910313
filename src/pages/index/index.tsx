import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCases } from '@/data/mockCases';
import { mockTrainingHistory } from '@/data/mockJudgments';
import { useJudgment } from '@/store/judgmentContext';

const IndexPage: React.FC = () => {
  const { setCurrentCase, resetJudgment, customCases } = useJudgment();
  const [refreshing, setRefreshing] = useState(false);

  const allCases = useMemo(() => [...mockCases, ...customCases], [customCases]);
  const quickCase = allCases[0];
  const recentCases = allCases.slice(0, 3);
  const completedCount = mockTrainingHistory.length;
  const avgAccuracy = mockTrainingHistory.length > 0
    ? Math.round(mockTrainingHistory.reduce((sum, h) => sum + h.accuracy, 0) / mockTrainingHistory.length)
    : 0;

  useDidShow(() => {
    console.log('[Home] Page shown');
  });

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handleQuickStart = () => {
    if (!quickCase) return;
    resetJudgment();
    setCurrentCase(quickCase);
    Taro.switchTab({ url: '/pages/judgment/index' });
  };

  const handleFeatureClick = (type: string) => {
    const urlMap: Record<string, string> = {
      cases: '/pages/cases/index',
      judgment: '/pages/judgment/index',
      review: '/pages/review/index',
      assignment: '/pages/assignment/index',
      profile: '/pages/profile/index',
    };
    const url = urlMap[type];
    if (url) {
      if (['cases', 'judgment', 'profile'].includes(type)) {
        Taro.switchTab({ url });
      } else {
        Taro.navigateTo({ url });
      }
    }
  };

  const handleCaseClick = (caseId: string) => {
    const caseData = allCases.find(c => c.id === caseId);
    if (caseData) {
      resetJudgment();
      setCurrentCase(caseData);
      Taro.switchTab({ url: '/pages/judgment/index' });
    }
  };

  const features = [
    { key: 'cases', icon: '📚', title: '案例课堂', desc: '浏览教学案例库', color: '#EEF2FF' },
    { key: 'judgment', icon: '🎯', title: '分组研判', desc: '开始弹幕风险研判', color: '#ECFDF5' },
    { key: 'assignment', icon: '📝', title: '班级作业', desc: '查看并完成实训任务', color: '#F5F3FF' },
    { key: 'review', icon: '💬', title: '教师点评', desc: '查看教师解析', color: '#FFFBEB' },
    { key: 'profile', icon: '📊', title: '我的报告', desc: '个人训练分析', color: '#FEF2F2' },
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>同学你好 👋</Text>
        <Text className={styles.subtitle}>欢迎来到弹幕风险研判实训平台</Text>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>张同学 · 新闻2班</Text>
          <Text className={styles.courseName}>舆情监测与危机管理</Text>
        </View>
      </View>

      <View className={styles.container}>
        <View className={styles.quickStart}>
          <Image
            className={styles.casePreview}
            src={quickCase?.cover}
            mode="aspectFill"
          />
          <View className={styles.caseInfo}>
            <Text className={styles.caseTag}>今日推荐</Text>
            <Text className={styles.caseTitle}>{quickCase?.title}</Text>
            <Text className={styles.caseMeta}>
              {quickCase?.teacherName} · {quickCase?.danmakus.length}条弹幕
            </Text>
          </View>
          <Button className={styles.startBtn} onClick={handleQuickStart}>
            开始研判
          </Button>
        </View>

        <View className={styles.sectionTitle}>
          <Text>功能入口</Text>
        </View>

        <View className={styles.featureGrid}>
          {features.map(feature => (
            <View
              key={feature.key}
              className={styles.featureItem}
              onClick={() => handleFeatureClick(feature.key)}
            >
              <View className={styles.featureIcon} style={{ backgroundColor: feature.color }}>
                <Text>{feature.icon}</Text>
              </View>
              <Text className={styles.featureTitle}>{feature.title}</Text>
              <Text className={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statsCard}>
          <Text className={styles.statsTitle}>我的训练统计</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{completedCount}</Text>
              <Text className={styles.statLabel}>已完成</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{avgAccuracy}%</Text>
              <Text className={styles.statLabel}>平均准确率</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{allCases.length}</Text>
              <Text className={styles.statLabel}>可参与</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text>最新案例</Text>
          <Text className={styles.more} onClick={() => Taro.switchTab({ url: '/pages/cases/index' })}>
            查看全部
          </Text>
        </View>

        <View className={styles.caseList}>
          {recentCases.map(caseItem => (
            <View
              key={caseItem.id}
              className={styles.caseItem}
              onClick={() => handleCaseClick(caseItem.id)}
            >
              <Image
                className={styles.caseCover}
                src={caseItem.cover}
                mode="aspectFill"
              />
              <View className={styles.caseContent}>
                <Text className={styles.caseTitle}>{caseItem.title}</Text>
                <View className={styles.caseInfo}>
                  <Text>{caseItem.teacherName}</Text>
                  <Text>{caseItem.danmakus.length}条弹幕</Text>
                </View>
              </View>
              <Text className={styles.arrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default IndexPage;
