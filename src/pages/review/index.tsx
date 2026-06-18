import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCases, getAnnotationsByCaseId } from '@/data/mockCases';
import { useJudgment } from '@/store/judgmentContext';
import type { Case } from '@/types';

const ReviewPage: React.FC = () => {
  const { currentCase } = useJudgment();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    currentCase?.id || mockCases[0]?.id || ''
  );

  const selectedCase = mockCases.find(c => c.id === selectedCaseId) as Case;
  const annotations = selectedCase ? getAnnotationsByCaseId(selectedCase.id) : [];

  const analysisItems = [
    { key: 'context', label: '语境分析', icon: '🔍', color: '#EEF2FF' },
    { key: 'spreadPotential', label: '扩散可能', icon: '📈', color: '#FEF3C7' },
    { key: 'timing', label: '处置时机', icon: '⏰', color: '#FEE2E2' },
  ];

  const getAnnotationValue = (annotation: any, key: string): string => {
    return annotation[key] || '';
  };

  const getDanmakuInfo = (danmakuId: string) => {
    return selectedCase?.danmakus.find(d => d.id === danmakuId);
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.container}>
        <Text className={styles.pageTitle}>教师点评</Text>
        <Text className={styles.pageSubtitle}>学习教师对关键弹幕的专业分析</Text>

        <View className={styles.caseSelector}>
          <Text className={styles.selectorLabel}>选择案例</Text>
          <ScrollView scrollX className={styles.selectorTabs}>
            {mockCases.map(caseItem => (
              <View
                key={caseItem.id}
                className={classnames(
                  styles.tabItem,
                  selectedCaseId === caseItem.id && styles.active
                )}
                onClick={() => setSelectedCaseId(caseItem.id)}
              >
                <Text>{caseItem.title.substring(0, 8)}...</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {annotations.length > 0 ? (
          <View className={styles.annotationList}>
            {annotations.map(annotation => {
              const danmaku = getDanmakuInfo(annotation.danmakuId);
              return (
                <View key={annotation.danmakuId} className={styles.annotationCard}>
                  <View className={styles.danmakuSection}>
                    <View className={styles.danmakuHeader}>
                      <View className={styles.keyBadge}>关键弹幕</View>
                      <Text className={styles.userName}>{danmaku?.userName || '匿名用户'}</Text>
                    </View>
                    <Text className={styles.danmakuContent}>
                      "{danmaku?.content || '内容加载失败'}"
                    </Text>
                  </View>

                  <View className={styles.analysisSection}>
                    {analysisItems.map(item => (
                      <View key={item.key} className={styles.analysisItem}>
                        <View className={styles.analysisTitle}>
                          <View
                            className={styles.analysisIcon}
                            style={{ backgroundColor: item.color }}
                          >
                            <Text>{item.icon}</Text>
                          </View>
                          <Text className={styles.analysisLabel}>{item.label}</Text>
                        </View>
                        <Text className={styles.analysisContent}>
                          {getAnnotationValue(annotation, item.key)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className={styles.explanationSection}>
                    <Text className={styles.explanationTitle}>
                      <Text className={styles.icon}>💡</Text>
                      教师解析
                    </Text>
                    <Text className={styles.explanationText}>
                      {annotation.explanation}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyTitle}>暂无点评</Text>
            <Text className={styles.emptyDesc}>
              该案例的教师点评还在准备中
              {"\n"}
              请先完成研判训练，再来查看教师的专业分析
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewPage;
