import React, { useState, useMemo } from 'react';
import { View, Text, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCases, getAnnotationsByCaseId } from '@/data/mockCases';
import { useJudgment } from '@/store/judgmentContext';
import type { Case, TeacherAnnotation } from '@/types';

const ReviewPage: React.FC = () => {
  const { currentCase, customCases, customAnnotations, addAnnotation } = useJudgment();

  const allCases = useMemo(() => [...mockCases, ...customCases], [customCases]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    currentCase?.id || allCases[0]?.id || ''
  );

  const selectedCase = allCases.find(c => c.id === selectedCaseId) as Case;

  const mergedAnnotations = useMemo(() => {
    if (!selectedCase) return [];
    return [
      ...getAnnotationsByCaseId(selectedCase.id),
      ...(customAnnotations[selectedCase.id] || []),
    ];
  }, [selectedCase, customAnnotations]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDanmakuId, setSelectedDanmakuId] = useState('');
  const [annotationContext, setAnnotationContext] = useState('');
  const [annotationSpread, setAnnotationSpread] = useState('');
  const [annotationTiming, setAnnotationTiming] = useState('');
  const [annotationExplanation, setAnnotationExplanation] = useState('');

  const analysisItems = [
    { key: 'context', label: '语境分析', icon: '🔍', color: '#EEF2FF' },
    { key: 'spreadPotential', label: '扩散可能', icon: '📈', color: '#FEF3C7' },
    { key: 'timing', label: '处置时机', icon: '⏰', color: '#FEE2E2' },
  ];

  const getAnnotationValue = (annotation: TeacherAnnotation, key: string): string => {
    return annotation[key as keyof TeacherAnnotation] as string || '';
  };

  const getDanmakuInfo = (danmakuId: string) => {
    return selectedCase?.danmakus.find(d => d.id === danmakuId);
  };

  const annotatedIds = new Set(mergedAnnotations.map(a => a.danmakuId));
  const unannotatedDanmakus = selectedCase
    ? selectedCase.danmakus.filter(d => !annotatedIds.has(d.id))
    : [];

  const handleAddAnnotation = () => {
    if (!selectedCase || !selectedDanmakuId) {
      Taro.showToast({ title: '请选择弹幕', icon: 'none' });
      return;
    }
    if (!annotationContext.trim() || !annotationSpread.trim() || !annotationTiming.trim()) {
      Taro.showToast({ title: '请填写完整的分析内容', icon: 'none' });
      return;
    }

    const annotation: TeacherAnnotation = {
      danmakuId: selectedDanmakuId,
      isKey: true,
      context: annotationContext.trim(),
      spreadPotential: annotationSpread.trim(),
      timing: annotationTiming.trim(),
      explanation: annotationExplanation.trim() || '教师标注的关键弹幕，请注意语境分析',
    };

    addAnnotation(selectedCase.id, annotation);

    setSelectedDanmakuId('');
    setAnnotationContext('');
    setAnnotationSpread('');
    setAnnotationTiming('');
    setAnnotationExplanation('');
    setShowAddForm(false);

    Taro.showToast({ title: '标注已添加', icon: 'success' });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.container}>
        <Text className={styles.pageTitle}>教师点评</Text>
        <Text className={styles.pageSubtitle}>学习教师对关键弹幕的专业分析</Text>

        <View className={styles.caseSelector}>
          <Text className={styles.selectorLabel}>选择案例</Text>
          <ScrollView scrollX className={styles.selectorTabs}>
            {allCases.map(caseItem => (
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

        {selectedCase && selectedCase.isCustom && (
          <View className={styles.teacherActions}>
            <Button
              className={styles.addAnnotationBtn}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '取消标注' : '➕ 标注关键弹幕'}
            </Button>
          </View>
        )}

        {showAddForm && selectedCase && (
          <View className={styles.addFormSection}>
            <Text className={styles.formTitle}>标注关键弹幕</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>选择弹幕</Text>
              <ScrollView scrollY className={styles.danmakuSelector}>
                {unannotatedDanmakus.map(danmaku => (
                  <View
                    key={danmaku.id}
                    className={classnames(
                      styles.danmakuOption,
                      selectedDanmakuId === danmaku.id && styles.danmakuSelected
                    )}
                    onClick={() => setSelectedDanmakuId(danmaku.id)}
                  >
                    <Text className={styles.danmakuOptionText}>"{danmaku.content}"</Text>
                  </View>
                ))}
                {unannotatedDanmakus.length === 0 && (
                  <Text className={styles.noDanmakuHint}>所有弹幕已标注</Text>
                )}
              </ScrollView>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>🔍 语境分析 *</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="分析这条弹幕在当前直播语境下的含义和风险..."
                value={annotationContext}
                onInput={e => setAnnotationContext(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>📈 扩散可能 *</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="判断这条弹幕被截图扩散到其他平台的可能性..."
                value={annotationSpread}
                onInput={e => setAnnotationSpread(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>⏰ 处置时机 *</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="建议在多长时间内采取什么级别的应对措施..."
                value={annotationTiming}
                onInput={e => setAnnotationTiming(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>💡 教师解析</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="对这条弹幕的专业解读（选填）"
                value={annotationExplanation}
                onInput={e => setAnnotationExplanation(e.detail.value)}
              />
            </View>

            <Button className={styles.saveAnnotationBtn} onClick={handleAddAnnotation}>
              保存标注
            </Button>
          </View>
        )}

        {mergedAnnotations.length > 0 ? (
          <View className={styles.annotationList}>
            {mergedAnnotations.map(annotation => {
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
              教师可点击上方按钮标注关键弹幕
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewPage;
