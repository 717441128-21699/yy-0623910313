import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button, Picker, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useJudgment } from '@/store/judgmentContext';
import { mockCases } from '@/data/mockCases';
import { RISK_TYPE_LABELS, RISK_LEVEL_COLORS } from '@/types';
import type { AssignmentStatus, Case, Group } from '@/types';

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  pending: '待完成',
  submitted: '已提交',
  reviewed: '已点评',
};

type TabType = 'pending' | 'submitted' | 'reviewed' | 'publish';

const AssignmentPage: React.FC = () => {
  const { assignments, customCases, groups, currentStudentId, currentStudentName, publishAssignment, resetJudgment, setCurrentCase, reviewAssignment } = useJudgment();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [publishCaseId, setPublishCaseId] = useState('');
  const [publishGroupId, setPublishGroupId] = useState('');
  const [publishDeadline, setPublishDeadline] = useState('');

  const allCases = useMemo<Case[]>(() => [...mockCases, ...customCases], [customCases]);

  useDidShow(() => {
    console.log('[Assignment] Page shown, assignments:', assignments.length);
  });

  const myAssignments = useMemo(() => {
    return assignments.filter(a => a.studentId === currentStudentId);
  }, [assignments, currentStudentId]);

  const filteredAssignments = useMemo(() => {
    if (activeTab === 'publish') return [];
    return myAssignments.filter(a => a.status === activeTab);
  }, [myAssignments, activeTab]);

  const handleStartJudgment = (assignmentId: string, caseId: string) => {
    const caseData = allCases.find(c => c.id === caseId);
    if (!caseData) return;
    resetJudgment();
    setCurrentCase(caseData);
    Taro.switchTab({ url: '/pages/judgment/index' });
  };

  const handleViewReport = (assignmentId: string, caseId: string) => {
    const caseData = allCases.find(c => c.id === caseId);
    if (!caseData) return;
    resetJudgment();
    setCurrentCase(caseData);
    Taro.navigateTo({ url: '/pages/report/index' });
  };

  const handleReview = (assignmentId: string) => {
    reviewAssignment(assignmentId);
  };

  const handlePublish = () => {
    if (!publishCaseId || !publishGroupId) {
      Taro.showToast({ title: '请选择案例和小组', icon: 'none' });
      return;
    }
    publishAssignment(publishCaseId, publishGroupId, publishDeadline || undefined);
    setPublishCaseId('');
    setPublishGroupId('');
    setPublishDeadline('');
    setActiveTab('pending');
  };

  const caseOptions = allCases.map(c => ({ label: c.title, value: c.id }));
  const groupOptions = groups.map(g => ({ label: g.name, value: g.id }));

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>{currentStudentName}的作业中心</Text>
        <Text className={styles.subtitle}>查看待完成、已提交和已点评的实训任务</Text>
        <View className={styles.tabs}>
          {(['pending', 'submitted', 'reviewed', 'publish'] as TabType[]).map(tab => (
            <View
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'publish' ? '发布作业' : STATUS_LABELS[tab]}
              {tab !== 'publish' && (
                <Text style={{ marginLeft: '8rpx', opacity: 0.8 }}>
                  ({myAssignments.filter(a => a.status === tab).length})
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.container}>
        {activeTab === 'publish' ? (
          <View className={styles.teacherSection}>
            <Text className={styles.teacherTitle}>发布班级作业</Text>

            <View className={styles.formGroup}>
              <Text className={styles.label}>选择案例</Text>
              <Picker
                mode="selector"
                range={caseOptions}
                rangeKey="label"
                value={caseOptions.findIndex(o => o.value === publishCaseId)}
                onChange={(e) => setPublishCaseId(caseOptions[Number(e.detail.value)].value)}
              >
                <View className={styles.select}>
                  {publishCaseId ? allCases.find(c => c.id === publishCaseId)?.title : '请选择要发布的案例'}
                </View>
              </Picker>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>选择小组</Text>
              {groups.map(group => (
                <View
                  key={group.id}
                  className={`${styles.groupOption} ${publishGroupId === group.id ? styles.groupOptionActive : ''}`}
                  onClick={() => setPublishGroupId(group.id)}
                >
                  <View className={`${styles.groupRadio} ${publishGroupId === group.id ? styles.groupRadioActive : ''}`}>
                    {publishGroupId === group.id && <View className={styles.groupRadioInner} />}
                  </View>
                  <Text className={styles.groupName}>{group.name}</Text>
                  <Text className={styles.groupCount}>{group.studentIds.length}人</Text>
                </View>
              ))}
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>截止日期（可选）</Text>
              <Input
                className={styles.input}
                placeholder="例如：2024-02-15 23:59"
                value={publishDeadline}
                onInput={(e) => setPublishDeadline(e.detail.value)}
              />
            </View>

            <Button className={styles.publishBtn} onClick={handlePublish}>
              📢 发布作业
            </Button>
          </View>
        ) : (
          <>
            {filteredAssignments.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📭</Text>
                <Text className={styles.emptyText}>
                  {activeTab === 'pending' ? '暂无待完成的作业' :
                   activeTab === 'submitted' ? '暂无已提交的作业' :
                   '暂无已点评的作业'}
                </Text>
              </View>
            ) : (
              filteredAssignments.map(assignment => (
                <View key={assignment.id} className={styles.card}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.caseTitle}>{assignment.title}</Text>
                    <Text className={`${styles.statusBadge} ${styles[assignment.status]}`}>
                      {STATUS_LABELS[assignment.status]}
                    </Text>
                  </View>
                  <View className={styles.cardMeta}>
                    <Text className={styles.metaItem}>👨‍🏫 {assignment.teacherName}</Text>
                    <Text className={styles.metaItem}>👥 {assignment.groupName}</Text>
                    <Text className={styles.metaItem}>📅 {assignment.createdAt}</Text>
                    {assignment.accuracy !== undefined && (
                      <Text className={styles.metaItem}>
                        <Text className={styles.accuracy}>准确率 {assignment.accuracy}%</Text>
                      </Text>
                    )}
                  </View>
                  {assignment.deadline && (
                    <View className={styles.cardMeta}>
                      <Text className={styles.metaItem} style={{ color: '#dc2626' }}>⏰ 截止：{assignment.deadline}</Text>
                    </View>
                  )}
                  {assignment.submittedAt && (
                    <View className={styles.cardMeta}>
                      <Text className={styles.metaItem}>✅ 提交时间：{assignment.submittedAt}</Text>
                    </View>
                  )}
                  {assignment.reviewedAt && (
                    <View className={styles.cardMeta}>
                      <Text className={styles.metaItem}>💬 点评时间：{assignment.reviewedAt}</Text>
                    </View>
                  )}
                  <View className={styles.cardActions}>
                    {assignment.status === 'pending' && (
                      <Button
                        className={styles.primaryBtn}
                        onClick={() => handleStartJudgment(assignment.id, assignment.caseId)}
                      >
                        开始研判
                      </Button>
                    )}
                    {assignment.status === 'submitted' && (
                      <>
                        <Button
                          className={styles.secondaryBtn}
                          onClick={() => handleViewReport(assignment.id, assignment.caseId)}
                        >
                          查看报告
                        </Button>
                        <Button
                          className={styles.secondaryBtn}
                          onClick={() => handleReview(assignment.id)}
                        >
                          教师点评
                        </Button>
                      </>
                    )}
                    {assignment.status === 'reviewed' && (
                      <>
                        <Button
                          className={styles.primaryBtn}
                          onClick={() => handleViewReport(assignment.id, assignment.caseId)}
                        >
                          查看报告
                        </Button>
                        <Button
                          className={styles.secondaryBtn}
                          onClick={() => Taro.navigateTo({ url: '/pages/review/index' })}
                        >
                          查看点评
                        </Button>
                      </>
                    )}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AssignmentPage;
