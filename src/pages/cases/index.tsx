import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCases } from '@/data/mockCases';
import DanmakuItem from '@/components/DanmakuItem';
import { useJudgment } from '@/store/judgmentContext';
import type { Case } from '@/types';

const CasesPage: React.FC = () => {
  const { setCurrentCase, resetJudgment, customCases } = useJudgment();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const allCases = useMemo(() => [...mockCases, ...customCases], [customCases]);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'preset', label: '内置案例' },
    { key: 'custom', label: '自建案例' },
    { key: 'brand', label: '品牌危机' },
  ];

  const filteredCases = useMemo(() => {
    if (activeTab === 'all') return allCases;
    if (activeTab === 'preset') return mockCases;
    if (activeTab === 'custom') return customCases;
    return allCases;
  }, [activeTab, allCases, customCases]);

  const handleViewDetail = (caseData: Case, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedCase(caseData);
    setShowDetail(true);
  };

  const handleStartJudgment = (caseData: Case, e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetJudgment();
    setCurrentCase(caseData);
    Taro.switchTab({ url: '/pages/judgment/index' });
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedCase(null);
  };

  const handleStartFromDetail = () => {
    if (!selectedCase) return;
    resetJudgment();
    setCurrentCase(selectedCase);
    setShowDetail(false);
    Taro.switchTab({ url: '/pages/judgment/index' });
  };

  const handleCreateCase = () => {
    Taro.navigateTo({ url: '/pages/createCase/index' });
  };

  const contextItems = selectedCase ? [
    { label: '直播背景', value: selectedCase.context.background },
    { label: '主播身份', value: selectedCase.context.anchor },
    { label: '品牌处境', value: selectedCase.context.brand },
    { label: '当前局势', value: selectedCase.context.situation },
  ] : [];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.container}>
        <Text className={styles.pageTitle}>案例课堂</Text>
        <Text className={styles.pageSubtitle}>精选真实舆情案例，在模拟场景中提升研判能力</Text>

        <View className={styles.createEntry} onClick={handleCreateCase}>
          <View className={styles.createIcon}>
            <Text>➕</Text>
          </View>
          <View className={styles.createInfo}>
            <Text className={styles.createTitle}>教师创建案例</Text>
            <Text className={styles.createDesc}>录入直播背景和脱敏弹幕，生成训练案例</Text>
          </View>
          <Text className={styles.createArrow}>›</Text>
        </View>

        <ScrollView scrollX className={styles.filterTabs}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </ScrollView>

        <View className={styles.caseList}>
          {filteredCases.map(caseItem => (
            <View key={caseItem.id} className={styles.caseCard}>
              <Image
                className={styles.cover}
                src={caseItem.cover}
                mode="aspectFill"
              />
              <View className={styles.content}>
                <View className={styles.caseHeader}>
                  <View className={styles.caseTags}>
                    <Text className={styles.tag}>
                      {caseItem.isCustom ? '自建案例' : '实训案例'}
                    </Text>
                    {caseItem.isCustom && (
                      <Text className={classnames(styles.tag, styles.customTag)}>新</Text>
                    )}
                  </View>
                  <Text className={styles.difficulty}>⭐⭐⭐ 中等</Text>
                </View>
                <Text className={styles.title}>{caseItem.title}</Text>
                <Text className={styles.description}>{caseItem.description}</Text>
                <View className={styles.meta}>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>授课教师</Text>
                    <Text className={styles.metaValue}>{caseItem.teacherName}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>弹幕数</Text>
                    <Text className={styles.metaValue}>{caseItem.danmakus.length}条</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>参训人数</Text>
                    <Text className={styles.metaValue}>{caseItem.studentCount}人</Text>
                  </View>
                </View>
                <View className={styles.actionRow}>
                  <Button
                    className={styles.detailBtn}
                    onClick={(e) => handleViewDetail(caseItem, e as any)}
                  >
                    查看详情
                  </Button>
                  <Button
                    className={styles.startBtn}
                    onClick={(e) => handleStartJudgment(caseItem, e as any)}
                  >
                    开始研判
                  </Button>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {showDetail && selectedCase && (
        <View className={styles.detailModal} onClick={handleCloseDetail}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>{selectedCase.title}</Text>
              <Text className={styles.closeBtn} onClick={handleCloseDetail}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.contextSection}>
                <Text className={styles.sectionTitle}>案例背景</Text>
                {contextItems.map((item, idx) => (
                  <View key={idx} className={styles.contextItem}>
                    <Text className={styles.contextLabel}>{item.label}</Text>
                    <Text className={styles.contextValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <View className={styles.danmakuPreview}>
                <Text className={styles.previewTitle}>弹幕样本预览</Text>
                <Text className={styles.previewCount}>共 {selectedCase.danmakus.length} 条弹幕</Text>
                {selectedCase.danmakus.slice(0, 5).map((danmaku, idx) => (
                  <DanmakuItem
                    key={danmaku.id}
                    danmaku={danmaku}
                    index={idx}
                  />
                ))}
                {selectedCase.danmakus.length > 5 && (
                  <Text className={styles.previewMore}>
                    还有 {selectedCase.danmakus.length - 5} 条弹幕...
                  </Text>
                )}
              </View>
            </ScrollView>
            <View className={styles.modalFooter}>
              <Button className={styles.footerBtn} onClick={handleStartFromDetail}>
                开始研判训练
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default CasesPage;
