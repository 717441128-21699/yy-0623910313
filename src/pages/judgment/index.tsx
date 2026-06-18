import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useJudgment } from '@/store/judgmentContext';
import DanmakuItem from '@/components/DanmakuItem';
import DistributionBar from '@/components/DistributionBar';
import {
  RISK_TYPE_LABELS,
  RISK_LEVEL_LABELS,
  ACTION_LABELS,
} from '@/types';
import type { RiskType, RiskLevel, ActionType, JudgmentOption } from '@/types';
import { mockClassDistributions } from '@/data/mockJudgments';
import { getAnnotationsByCaseId } from '@/data/mockCases';
import { formatAccuracyColor } from '@/utils/risk';

const JudgmentPage: React.FC = () => {
  const {
    currentCase,
    currentDanmakuIndex,
    setCurrentDanmakuIndex,
    setJudgment,
    getJudgment,
    judgments,
    isSubmitted,
    generateReport,
    report,
  } = useJudgment();

  const [showResult, setShowResult] = useState(false);
  const [selectedRiskType, setSelectedRiskType] = useState<RiskType | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const currentDanmaku = currentCase?.danmakus[currentDanmakuIndex];
  const totalDanmakus = currentCase?.danmakus.length || 0;
  const completedCount = judgments.length;
  const progress = totalDanmakus > 0 ? Math.round((completedCount / totalDanmakus) * 100) : 0;

  const isCurrentJudged = useMemo(() => {
    if (!currentDanmaku) return false;
    return !!getJudgment(currentDanmaku.id);
  }, [currentDanmaku, getJudgment]);

  const canProceed = selectedRiskType && selectedRiskLevel && selectedAction;
  const isLast = currentDanmakuIndex === totalDanmakus - 1;
  const isFirst = currentDanmakuIndex === 0;
  const allCompleted = completedCount === totalDanmakus && totalDanmakus > 0;

  const handleDanmakuClick = (index: number) => {
    setCurrentDanmakuIndex(index);
    const danmaku = currentCase?.danmakus[index];
    if (danmaku) {
      const existing = getJudgment(danmaku.id);
      if (existing) {
        setSelectedRiskType(existing.riskType);
        setSelectedRiskLevel(existing.riskLevel);
        setSelectedAction(existing.action);
      } else {
        setSelectedRiskType(null);
        setSelectedRiskLevel(null);
        setSelectedAction(null);
      }
    }
  };

  const handleSaveCurrent = () => {
    if (!currentDanmaku || !canProceed) return;

    const judgment: JudgmentOption = {
      danmakuId: currentDanmaku.id,
      riskType: selectedRiskType,
      riskLevel: selectedRiskLevel,
      action: selectedAction,
    };

    setJudgment(judgment);
    console.log('[Judgment] Saved:', judgment);
  };

  const handleNext = () => {
    handleSaveCurrent();
    if (isLast) {
      handleSubmit();
    } else {
      const nextIndex = currentDanmakuIndex + 1;
      setCurrentDanmakuIndex(nextIndex);
      const nextDanmaku = currentCase?.danmakus[nextIndex];
      if (nextDanmaku) {
        const existing = getJudgment(nextDanmaku.id);
        if (existing) {
          setSelectedRiskType(existing.riskType);
          setSelectedRiskLevel(existing.riskLevel);
          setSelectedAction(existing.action);
        } else {
          setSelectedRiskType(null);
          setSelectedRiskLevel(null);
          setSelectedAction(null);
        }
      }
    }
  };

  const handlePrev = () => {
    handleSaveCurrent();
    const prevIndex = currentDanmakuIndex - 1;
    setCurrentDanmakuIndex(prevIndex);
    const prevDanmaku = currentCase?.danmakus[prevIndex];
    if (prevDanmaku) {
      const existing = getJudgment(prevDanmaku.id);
      if (existing) {
        setSelectedRiskType(existing.riskType);
        setSelectedRiskLevel(existing.riskLevel);
        setSelectedAction(existing.action);
      } else {
        setSelectedRiskType(null);
        setSelectedRiskLevel(null);
        setSelectedAction(null);
      }
    }
  };

  const handleSubmit = () => {
    handleSaveCurrent();
    if (!allCompleted) {
      Taro.showModal({
        title: '提示',
        content: `还有 ${totalDanmakus - completedCount} 条弹幕未研判，确定提交吗？`,
        success: (res) => {
          if (res.confirm) {
            generateReport();
            setShowResult(true);
          }
        },
      });
    } else {
      generateReport();
      setShowResult(true);
    }
  };

  const handleGoCases = () => {
    Taro.switchTab({ url: '/pages/cases/index' });
  };

  const handleViewReview = () => {
    setShowResult(false);
    Taro.navigateTo({ url: '/pages/review/index' });
  };

  const handleViewReport = () => {
    setShowResult(false);
    Taro.navigateTo({ url: '/pages/report/index' });
  };

  const riskTypeOptions: { key: RiskType; label: string }[] = [
    { key: 'normal', label: '正常发言' },
    { key: 'complaint', label: '投诉吐槽' },
    { key: 'sarcasm', label: '讽刺挖苦' },
    { key: 'rumor', label: '谣言不实' },
    { key: 'attack', label: '人身攻击' },
    { key: 'sensitive', label: '敏感话题' },
    { key: 'crisis', label: '危机信号' },
  ];

  const riskLevelOptions: { key: RiskLevel; label: string; className: string }[] = [
    { key: 'low', label: '低风险', className: 'riskLow' },
    { key: 'medium', label: '中风险', className: 'riskMedium' },
    { key: 'high', label: '高风险', className: 'riskHigh' },
    { key: 'crisis', label: '危机', className: 'riskCrisis' },
  ];

  const actionOptions: { key: ActionType; label: string }[] = [
    { key: 'ignore', label: '忽略' },
    { key: 'observe', label: '观察' },
    { key: 'respond', label: '回应' },
    { key: 'report', label: '上报' },
  ];

  const classDistributions = currentCase ? (mockClassDistributions[currentCase.id] || []) : [];
  const annotations = currentCase ? getAnnotationsByCaseId(currentCase.id) : [];
  const keyDanmakuIds = annotations.filter(a => a.isKey).map(a => a.danmakuId);

  const accuracyClass = report
    ? report.totalAccuracy >= 80 ? 'high' : report.totalAccuracy >= 60 ? 'medium' : 'low'
    : '';

  if (!currentCase) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyTitle}>还未选择案例</Text>
          <Text className={styles.emptyDesc}>
            请先前往案例课堂选择一个实训案例，
            {"\n"}
            然后开始弹幕风险研判训练
          </Text>
          <Button className={styles.goBtn} onClick={handleGoCases}>
            去选择案例
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.contextBar}>
        <Text className={styles.caseTitle}>{currentCase.title}</Text>
        <View className={styles.progressBar}>
          <Text className={styles.progressText}>
            {completedCount}/{totalDanmakus}
          </Text>
          <View className={styles.progressTrack}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className={styles.progressPercent}>{progress}%</Text>
        </View>
      </View>

      <View className={styles.mainContent}>
        <ScrollView scrollY className={styles.danmakuList}>
          <Text className={styles.listTitle}>弹幕列表（点击切换）</Text>
          {currentCase.danmakus.map((danmaku, idx) => {
            const judgment = getJudgment(danmaku.id);
            const isKey = keyDanmakuIds.includes(danmaku.id);
            return (
              <DanmakuItem
                key={danmaku.id}
                danmaku={danmaku}
                index={idx}
                selected={idx === currentDanmakuIndex}
                riskLevel={judgment?.riskLevel}
                isKey={isKey}
                onClick={() => handleDanmakuClick(idx)}
              />
            );
          })}
        </ScrollView>

        <ScrollView scrollY className={styles.judgmentArea}>
          {currentDanmaku && (
            <>
              <View className={styles.currentDanmaku}>
                <View className={styles.danmakuHeader}>
                  <View className={styles.userAvatar}>
                    {currentDanmaku.userName.charAt(0)}
                  </View>
                  <Text className={styles.userName}>{currentDanmaku.userName}</Text>
                </View>
                <Text className={styles.danmakuContent}>
                  "{currentDanmaku.content}"
                </Text>
              </View>

              <View className={styles.judgmentSection}>
                <Text className={styles.sectionTitle}>
                  风险类型
                  <Text className={styles.required}>*</Text>
                </Text>
                <View className={styles.optionsGrid}>
                  {riskTypeOptions.map(option => (
                    <Button
                      key={option.key}
                      className={classnames(
                        styles.optionBtn,
                        selectedRiskType === option.key && styles.selected
                      )}
                      onClick={() => setSelectedRiskType(option.key)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </View>
              </View>

              <View className={styles.judgmentSection}>
                <Text className={styles.sectionTitle}>
                  风险等级
                  <Text className={styles.required}>*</Text>
                </Text>
                <View className={styles.optionsGrid}>
                  {riskLevelOptions.map(option => (
                    <Button
                      key={option.key}
                      className={classnames(
                        styles.optionBtn,
                        option.className,
                        selectedRiskLevel === option.key && styles.selected
                      )}
                      onClick={() => setSelectedRiskLevel(option.key)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </View>
              </View>

              <View className={styles.judgmentSection}>
                <Text className={styles.sectionTitle}>
                  建议动作
                  <Text className={styles.required}>*</Text>
                </Text>
                <View className={styles.optionsGrid}>
                  {actionOptions.map(option => (
                    <Button
                      key={option.key}
                      className={classnames(
                        styles.optionBtn,
                        selectedAction === option.key && styles.selected
                      )}
                      onClick={() => setSelectedAction(option.key)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </View>
              </View>

              <View className={styles.bottomActions}>
                <Button
                  className={styles.navBtn}
                  onClick={handlePrev}
                  disabled={isFirst}
                >
                  上一条
                </Button>
                {isLast ? (
                  <Button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                  >
                    提交研判
                  </Button>
                ) : (
                  <Button
                    className={styles.nextBtn}
                    onClick={handleNext}
                    disabled={!canProceed}
                  >
                    下一条
                  </Button>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {showResult && report && (
        <View className={styles.resultModal}>
          <View className={styles.modalContent}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>研判完成！</Text>
              <Text className={styles.modalSubtitle}>查看你的训练结果</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.accuracyCard}>
                <Text className={styles.accuracyLabel}>本次准确率</Text>
                <Text
                  className={classnames(styles.accuracyValue, styles[accuracyClass])}
                  style={{ color: formatAccuracyColor(report.totalAccuracy) }}
                >
                  {report.totalAccuracy}
                  <Text className={styles.accuracyUnit}>%</Text>
                </Text>
              </View>

              <View className={styles.distributionSection}>
                <Text className={styles.sectionTitle}>班级研判分布</Text>
                {classDistributions.slice(0, 2).map(dist => {
                  const danmaku = currentCase.danmakus.find(d => d.id === dist.danmakuId);
                  return (
                    <View key={dist.danmakuId} className={styles.danmakuCompare}>
                      <Text className={styles.danmakuText}>"{danmaku?.content}"</Text>
                      <View className={styles.distributionGroup}>
                        <Text className={styles.groupLabel}>风险类型分布</Text>
                        <DistributionBar
                          data={dist.riskTypeCounts}
                          totalCount={dist.totalCount}
                          type="riskType"
                          labels={RISK_TYPE_LABELS}
                        />
                      </View>
                      <View className={styles.distributionGroup}>
                        <Text className={styles.groupLabel}>风险等级分布</Text>
                        <DistributionBar
                          data={dist.riskLevelCounts}
                          totalCount={dist.totalCount}
                          type="riskLevel"
                          labels={RISK_LEVEL_LABELS}
                        />
                      </View>
                      <View className={styles.distributionGroup}>
                        <Text className={styles.groupLabel}>建议动作分布</Text>
                        <DistributionBar
                          data={dist.actionCounts}
                          totalCount={dist.totalCount}
                          type="action"
                          labels={ACTION_LABELS}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              <View className={styles.keyPoints}>
                <Text className={styles.pointTitle}>💡 学习要点</Text>
                {report.suggestions.slice(0, 3).map((suggestion, idx) => (
                  <View key={idx} className={styles.pointItem}>
                    <Text className={styles.pointText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View className={styles.modalFooter}>
              <Button className={styles.reviewBtn} onClick={handleViewReview}>
                教师点评
              </Button>
              <Button className={styles.reportBtn} onClick={handleViewReport}>
                查看报告
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default JudgmentPage;
