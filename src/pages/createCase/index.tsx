import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useJudgment } from '@/store/judgmentContext';
import type { Case, Danmaku } from '@/types';

const userNames = ['直播观众', '吃瓜路人', '理智粉丝', '冷静分析', '正义使者', '资深用户', '新人小白', '老粉丝', '围观群众', '键盘侠'];

const CreateCasePage: React.FC = () => {
  const { addCustomCase, setCurrentCase, resetJudgment } = useJudgment();

  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  const [anchor, setAnchor] = useState('');
  const [brand, setBrand] = useState('');
  const [situation, setSituation] = useState('');
  const [danmakuText, setDanmakuText] = useState('');
  const [parsedDanmakus, setParsedDanmakus] = useState<string[]>([]);
  const [teacherName, setTeacherName] = useState('');

  const handleParseDanmakus = () => {
    if (!danmakuText.trim()) {
      Taro.showToast({ title: '请输入弹幕内容', icon: 'none' });
      return;
    }
    const lines = danmakuText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      Taro.showToast({ title: '未识别到有效弹幕', icon: 'none' });
      return;
    }

    setParsedDanmakus(lines);
    Taro.showToast({ title: `已解析 ${lines.length} 条弹幕`, icon: 'success' });
  };

  const handleRemoveDanmaku = (index: number) => {
    setParsedDanmakus(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入案例标题', icon: 'none' });
      return;
    }
    if (!background.trim() || !anchor.trim() || !brand.trim()) {
      Taro.showToast({ title: '请填写完整的案例背景', icon: 'none' });
      return;
    }
    if (parsedDanmakus.length < 3) {
      Taro.showToast({ title: '至少需要3条弹幕', icon: 'none' });
      return;
    }

    const caseId = `custom_${Date.now()}`;
    const danmakus: Danmaku[] = parsedDanmakus.map((content, index) => ({
      id: `${caseId}_d${index}`,
      content,
      timestamp: index + 1,
      userId: `u_custom_${index}`,
      userName: userNames[index % userNames.length],
    }));

    const newCase: Case = {
      id: caseId,
      title: title.trim(),
      description: `${brand}直播场景下的弹幕风险研判实训案例，共${danmakus.length}条弹幕`,
      cover: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/750/400`,
      context: {
        background: background.trim(),
        anchor: anchor.trim(),
        brand: brand.trim(),
        situation: situation.trim() || '直播进行中',
      },
      danmakus,
      createdAt: new Date().toLocaleDateString('zh-CN'),
      teacherName: teacherName.trim() || '授课教师',
      studentCount: 0,
      isCustom: true,
    };

    addCustomCase(newCase);

    Taro.showModal({
      title: '创建成功',
      content: `案例「${title}」已创建，包含 ${danmakus.length} 条弹幕。是否立即开始研判？`,
      confirmText: '开始研判',
      cancelText: '返回列表',
      success: (res) => {
        if (res.confirm) {
          resetJudgment();
          setCurrentCase(newCase);
          Taro.switchTab({ url: '/pages/judgment/index' });
        } else {
          Taro.switchTab({ url: '/pages/cases/index' });
        }
      },
    });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.container}>
        <Text className={styles.pageTitle}>创建案例</Text>
        <Text className={styles.pageSubtitle}>教师录入脱敏弹幕样本，设置直播场景</Text>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.icon}>📝</Text>
            基本信息
          </Text>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>
              案例标题
              <Text className={styles.required}>*</Text>
            </Text>
            <Input
              className={styles.input}
              placeholder="例如：某品牌直播带货争议事件"
              value={title}
              onInput={e => setTitle(e.detail.value)}
            />
          </View>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>授课教师</Text>
            <Input
              className={styles.input}
              placeholder="教师姓名（选填）"
              value={teacherName}
              onInput={e => setTeacherName(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.icon}>🎬</Text>
            直播场景
          </Text>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>
              直播背景
              <Text className={styles.required}>*</Text>
            </Text>
            <Textarea
              className={styles.textarea}
              placeholder="描述直播活动的背景信息，例如：品牌新品发布会、危机回应直播等"
              value={background}
              onInput={e => setBackground(e.detail.value)}
            />
          </View>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>
              主播身份
              <Text className={styles.required}>*</Text>
            </Text>
            <Input
              className={styles.input}
              placeholder="例如：知名美妆主播Lily，粉丝500万+"
              value={anchor}
              onInput={e => setAnchor(e.detail.value)}
            />
          </View>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>
              品牌处境
              <Text className={styles.required}>*</Text>
            </Text>
            <Input
              className={styles.input}
              placeholder="例如：国内一线品牌，近期曾引发争议"
              value={brand}
              onInput={e => setBrand(e.detail.value)}
            />
          </View>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>当前局势</Text>
            <Textarea
              className={styles.textarea}
              placeholder="描述直播中当前的时间节点和氛围（选填）"
              value={situation}
              onInput={e => setSituation(e.detail.value)}
              style={{ minHeight: '160rpx' }}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.icon}>💬</Text>
            弹幕样本
          </Text>
          <View className={styles.inputGroup}>
            <Text className={styles.label}>粘贴脱敏弹幕</Text>
            <Textarea
              className={styles.textarea}
              placeholder="每行粘贴一条脱敏弹幕内容，例如：&#10;这款真的不卡粉吗？&#10;主播皮肤本来就好啊&#10;听说这个牌子之前被查过"
              value={danmakuText}
              onInput={e => setDanmakuText(e.detail.value)}
            />
            <Text className={styles.hint}>每行一条弹幕，至少3条，建议10-20条</Text>
          </View>
          <Button
            className={styles.submitBtn}
            onClick={handleParseDanmakus}
            style={{ marginTop: '16rpx', width: '100%', flex: 'unset', height: '80rpx' }}
          >
            解析弹幕
          </Button>

          {parsedDanmakus.length > 0 && (
            <View className={styles.danmakuPreview}>
              <Text className={styles.previewLabel}>
                已解析弹幕
                <Text className={styles.previewCount}>{parsedDanmakus.length}条</Text>
              </Text>
              <View className={styles.danmakuList}>
                {parsedDanmakus.map((text, idx) => (
                  <View key={idx} className={styles.danmakuItem}>
                    <View className={styles.danmakuIndex}>
                      <Text>{idx + 1}</Text>
                    </View>
                    <Text className={styles.danmakuText}>{text}</Text>
                    <Text
                      className={styles.removeBtn}
                      onClick={() => handleRemoveDanmaku(idx)}
                    >
                      ✕
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className={styles.submitBar}>
          <Button
            className={styles.cancelBtn}
            onClick={() => Taro.navigateBack()}
          >
            取消
          </Button>
          <Button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={parsedDanmakus.length < 3}
          >
            创建案例
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateCasePage;
