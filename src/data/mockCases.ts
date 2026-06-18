import type { Case, TeacherAnnotation } from '@/types';

export const mockCases: Case[] = [
  {
    id: 'case001',
    title: '美妆品牌新品发布会直播',
    description: '某知名美妆品牌举办新品发布会直播，邀请头部主播带货，期间出现多条争议性弹幕',
    cover: 'https://picsum.photos/id/103/750/400',
    context: {
      background: '品牌新品"无瑕粉底液"发布会，主打"24小时不脱妆"概念，前期已投放大量广告',
      anchor: '知名美妆主播Lily，粉丝量500万+，以专业测评著称',
      brand: '美肌（MEIJI），国内一线美妆品牌，近期因质量问题曾引发争议',
      situation: '直播进行到第45分钟，主播正在演示持妆效果，在线人数120万+',
    },
    danmakus: [
      { id: 'd001', content: '这款真的不卡粉吗？我上次买的那款卡得要死', timestamp: 1, userId: 'u001', userName: '爱化妆的猫' },
      { id: 'd002', content: '主播皮肤本来就好，当然不卡粉啊', timestamp: 2, userId: 'u002', userName: '柠檬精本精' },
      { id: 'd003', content: '听说这个牌子之前被查出来重金属超标？', timestamp: 3, userId: 'u003', userName: '理智消费者' },
      { id: 'd004', content: '有没有人觉得主播今天说话怪怪的？', timestamp: 4, userId: 'u004', userName: '细节控' },
      { id: 'd005', content: '用了三天就过敏了，脸都肿了', timestamp: 5, userId: 'u005', userName: '受害者1号' },
      { id: 'd006', content: '楼上是不是黑子啊？', timestamp: 6, userId: 'u006', userName: '品牌忠实粉' },
      { id: 'd007', content: '我是敏感肌，不敢买...', timestamp: 7, userId: 'u007', userName: '娇弱皮肤' },
      { id: 'd008', content: '他们家售后特别差，退货都不让', timestamp: 8, userId: 'u008', userName: '被坑过的人' },
      { id: 'd009', content: '主播笑起来好好看！', timestamp: 9, userId: 'u009', userName: '颜控一枚' },
      { id: 'd010', content: '听说有人用了烂脸，真的假的？', timestamp: 10, userId: 'u010', userName: '吃瓜群众' },
      { id: 'd011', content: '已经下单了，期待效果~', timestamp: 11, userId: 'u011', userName: '剁手达人' },
      { id: 'd012', content: '这个价格不如买XX牌子，比这个好多了', timestamp: 12, userId: 'u012', userName: '隔壁老王' },
    ],
    createdAt: '2024-01-15',
    teacherName: '张教授',
    studentCount: 45,
  },
  {
    id: 'case002',
    title: '餐饮品牌食品安全事件回应直播',
    description: '某连锁餐饮品牌被曝食材过期后，CEO现身直播间回应公众质疑',
    cover: 'https://picsum.photos/id/292/750/400',
    context: {
      background: '媒体曝光后厨使用过期食材，品牌形象严重受损，股价下跌15%',
      anchor: '品牌CEO王先生，首次公开直播回应',
      brand: '真功夫（ZHENGONG FU），国内知名连锁快餐品牌',
      situation: 'CEO正在宣读致歉声明，评论区情绪激动，在线人数80万+',
    },
    danmakus: [
      { id: 'd101', content: '道歉有用的话，要监管部门干嘛？', timestamp: 1, userId: 'u101', userName: '愤怒的小鸟' },
      { id: 'd102', content: '我吃了这么多年，不会有事吧', timestamp: 2, userId: 'u102', userName: '瑟瑟发抖' },
      { id: 'd103', content: '支持彻查！必须给消费者一个交代', timestamp: 3, userId: 'u103', userName: '正义使者' },
      { id: 'd104', content: 'CEO头发都白了，看着也挺不容易的', timestamp: 4, userId: 'u104', userName: '心软的神' },
      { id: 'd105', content: '这种品牌就该直接倒闭！', timestamp: 5, userId: 'u105', userName: '激进派' },
      { id: 'd106', content: '有没有人知道赔偿怎么申请？', timestamp: 6, userId: 'u106', userName: '维权人士' },
      { id: 'd107', content: '感觉这次是动真格的了', timestamp: 7, userId: 'u107', userName: '理性分析' },
      { id: 'd108', content: '楼上都是水军吧？收了多少钱？', timestamp: 8, userId: 'u108', userName: '阴谋论者' },
      { id: 'd109', content: '我以后再也不吃了', timestamp: 9, userId: 'u109', userName: '已拉黑' },
      { id: 'd110', content: '希望能真正整改，而不是做做样子', timestamp: 10, userId: 'u110', userName: '期待改变' },
    ],
    createdAt: '2024-01-20',
    teacherName: '李老师',
    studentCount: 38,
  },
  {
    id: 'case003',
    title: '游戏版本更新玩家吐槽直播',
    description: '某热门游戏发布重大版本更新后，官方主播开播解读，遭遇玩家大规模吐槽',
    cover: 'https://picsum.photos/id/1/750/400',
    context: {
      background: '游戏3.0版本上线，核心玩法改动引发老玩家强烈不满，微博热搜在榜',
      anchor: '官方策划师小周，负责本次版本更新',
      brand: '星际战甲（STAR ARMOR），运营5年的MMO游戏',
      situation: '主播正在介绍新装备系统，弹幕已被差评刷屏',
    },
    danmakus: [
      { id: 'd201', content: '这波更新是把老玩家当傻子吗？', timestamp: 1, userId: 'u201', userName: '五年老玩家' },
      { id: 'd202', content: '退游了，账号已挂交易平台', timestamp: 2, userId: 'u202', userName: '心寒玩家' },
      { id: 'd203', content: '主播能不能反馈一下，副本难度太高了', timestamp: 3, userId: 'u203', userName: '休闲玩家' },
      { id: 'd204', content: '你们是不是请了专业公关团队？评论区洗地的好多', timestamp: 4, userId: 'u204', userName: '明眼人' },
      { id: 'd205', content: '新时装挺好看的啊，准备买', timestamp: 5, userId: 'u205', userName: '外观党' },
      { id: 'd206', content: '据说运营团队全换了，难怪越来越差', timestamp: 6, userId: 'u206', userName: '内部消息' },
      { id: 'd207', content: '氪了十万的号现在一文不值', timestamp: 7, userId: 'u207', userName: '氪金大佬' },
      { id: 'd208', content: '支持官方！每次更新都在进步', timestamp: 8, userId: 'u208', userName: '护官宝' },
      { id: 'd209', content: '有没有人组队打新副本？', timestamp: 9, userId: 'u209', userName: '求带飞' },
      { id: 'd210', content: '我就想知道bug什么时候修', timestamp: 10, userId: 'u210', userName: '技术党' },
    ],
    createdAt: '2024-01-25',
    teacherName: '王教授',
    studentCount: 52,
  },
];

export const mockAnnotations: Record<string, TeacherAnnotation[]> = {
  case001: [
    {
      danmakuId: 'd003',
      isKey: true,
      context: '这条弹幕涉及质量指控，虽然没有实质证据，但在品牌已有负面历史的情况下，容易引发群体质疑',
      spreadPotential: '高：涉及"重金属超标"这类敏感关键词，很容易被截图扩散到社交平台',
      timing: '需要在5分钟内回应，否则谣言可能发酵成第二个热搜',
      explanation: '注意区分"单纯吐槽"和"危机信号"。这条弹幕的危险之处在于它不是情绪化表达，而是提出了具体的、可验证的指控，且与品牌既有负面联想高度契合。如果不及时回应，会被认为是默认事实。',
    },
    {
      danmakuId: 'd005',
      isKey: true,
      context: '用户声称自己是"受害者"，并描述了具体症状，这类内容最容易引发共情和模仿效应',
      spreadPotential: '极高：个人真实经历 + 具体症状描述 + 身份标签"受害者1号"，具备病毒传播的全部要素',
      timing: '必须在3分钟内启动处理流程，先私信用户了解详情，同时准备公开回应口径',
      explanation: '很多学生容易把这条判定为"普通投诉"，但实际上这是最高级别的危机信号。在直播场景中，每一个"受害者"的出现都可能引发更多"受害者"站出来，形成"维权浪潮"。',
    },
    {
      danmakuId: 'd010',
      isKey: true,
      context: '看似中立的提问，实际上是在传播"烂脸"这个关键词，属于"隐性带节奏"',
      spreadPotential: '中高：以提问形式传播负面信息，更容易绕过用户的心理防线',
      timing: '10分钟内需要有正面案例的弹幕进行对冲，同时官方账号发布质检报告',
      explanation: '舆情监测中最难识别的就是这种"看似中立"的内容。它不直接表达观点，而是通过提问的方式把负面信息植入其他观众的认知中。处理方式不是删帖，而是用事实回答问题。',
    },
  ],
  case002: [
    {
      danmakuId: 'd105',
      isKey: true,
      context: '极端化言论，虽然不代表多数人观点，但具有很强的情绪煽动性',
      spreadPotential: '高：极端言论容易被截图作为"民意代表"在社交媒体传播',
      timing: '需要密切观察，如出现多条类似言论，需要释放整改的具体信息来缓和情绪',
      explanation: '危机事件中，极端言论的处理原则是"不回应、不删除、监控走向"。删除极端言论反而会引发"压制言论自由"的次生危机。更好的做法是用具体的整改措施来稀释极端情绪。',
    },
    {
      danmakuId: 'd108',
      isKey: true,
      context: '阴谋论倾向，质疑一切正面声音，这类用户是舆情恶化的关键推手',
      spreadPotential: '中：阴谋论在信任崩塌的环境中传播极快，会分化原本中立的用户',
      timing: '不宜直接回应，需要通过第三方（如媒体、监管部门）的信息来破局',
      explanation: '处理阴谋论的关键是"跳出辩论"。不要试图说服阴谋论者，因为他们的底层逻辑是"你说什么都是在掩饰"。应该通过第三方权威信源发布信息，让阴谋论不攻自破。',
    },
  ],
};

export const getCaseById = (id: string): Case | undefined => {
  return mockCases.find(c => c.id === id);
};

export const getAnnotationsByCaseId = (caseId: string): TeacherAnnotation[] => {
  return mockAnnotations[caseId] || [];
};
