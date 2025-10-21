import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Icon, Badge, Button } from '@/components';
import { CASE_LIBRARY } from '@/data/caseLibrary';
import { LAW_DETAILS } from '@/data/lawDetails';
import { LAW_DOMAINS } from '@/data/lawDomains';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import type { Case } from '@/types';

/**
 * Simulator页面 - 执法场景模拟
 * 实战模拟执法场景,测试决策能力
 */
export default function Simulator() {
  const [currentScenario, setCurrentScenario] = useState<Case | null>(null);
  const [userAnswer, setUserAnswer] = useState({
    selectedLaws: [] as string[],
    proposedPenalty: '',
    reasoning: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, {
    completedCases: [] as number[],
    bookmarks: [] as string[],
    score: 0
  });

  // 获取随机场景
  const getRandomScenario = (difficulty?: '简单' | '中等' | '困难') => {
    let cases = CASE_LIBRARY;
    if (difficulty) {
      cases = cases.filter((c) => c.difficulty === difficulty);
    }
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    setCurrentScenario(randomCase);
    setUserAnswer({ selectedLaws: [], proposedPenalty: '', reasoning: '' });
    setShowResult(false);
    setScore(null);
  };

  // 评分逻辑
  const evaluateAnswer = () => {
    if (!currentScenario) return;

    let totalScore = 0;
    const feedback: string[] = [];

    // 1. 法律选择评分 (40分)
    const correctLaws = currentScenario.laws;
    const selectedLaws = userAnswer.selectedLaws;

    const correctCount = selectedLaws.filter((law) => correctLaws.includes(law)).length;
    const incorrectCount = selectedLaws.filter((law) => !correctLaws.includes(law)).length;
    const missedCount = correctLaws.filter((law) => !selectedLaws.includes(law)).length;

    const lawScore = Math.max(0, (correctCount * 15) - (incorrectCount * 5) - (missedCount * 10));
    totalScore += Math.min(40, lawScore);

    if (correctCount === correctLaws.length && incorrectCount === 0) {
      feedback.push('✅ 法律适用完全正确 (+40分)');
    } else {
      feedback.push(`⚠️ 法律适用部分正确: ${correctCount}个正确, ${incorrectCount}个错误, ${missedCount}个遗漏 (+${Math.min(40, lawScore)}分)`);
    }

    // 2. 处罚决定评分 (30分)
    const userPenalty = userAnswer.proposedPenalty.toLowerCase();
    const correctPenalty = currentScenario.penalty.toLowerCase();

    if (userPenalty.includes('警告') && correctPenalty.includes('警告')) {
      totalScore += 30;
      feedback.push('✅ 处罚决定正确 - 警告 (+30分)');
    } else if (userPenalty.includes('罚款') && correctPenalty.includes('罚款')) {
      totalScore += 30;
      feedback.push('✅ 处罚决定正确 - 罚款 (+30分)');
    } else if (userPenalty.includes('吊销') && correctPenalty.includes('吊销')) {
      totalScore += 30;
      feedback.push('✅ 处罚决定正确 - 吊销 (+30分)');
    } else if (userPenalty.includes('没收') && correctPenalty.includes('没收')) {
      totalScore += 30;
      feedback.push('✅ 处罚决定正确 - 没收 (+30分)');
    } else {
      feedback.push('❌ 处罚决定不正确 (+0分)');
    }

    // 3. 推理逻辑评分 (30分)
    const reasoning = userAnswer.reasoning;
    if (reasoning.length >= 50) {
      totalScore += 15;
      feedback.push('✅ 推理逻辑详细 (+15分)');
    } else if (reasoning.length >= 20) {
      totalScore += 10;
      feedback.push('⚠️ 推理逻辑基本完整 (+10分)');
    } else {
      feedback.push('❌ 推理逻辑过于简单 (+0分)');
    }

    // 检查是否包含关键词
    const hasKeywords = currentScenario.keywords.some((keyword) =>
      reasoning.includes(keyword)
    );
    if (hasKeywords) {
      totalScore += 15;
      feedback.push('✅ 推理包含关键要素 (+15分)');
    } else {
      feedback.push('⚠️ 推理缺少关键要素 (+0分)');
    }

    setScore(totalScore);
    setShowResult(true);

    // 更新用户进度
    const earnedPoints = Math.round(totalScore * (currentScenario.difficulty === '困难' ? 1.5 : currentScenario.difficulty === '中等' ? 1.2 : 1.0));
    setUserProgress({
      ...userProgress,
      completedCases: Array.from(new Set([...userProgress.completedCases, currentScenario.id])),
      score: userProgress.score + earnedPoints
    });
  };

  // 法律选择
  const toggleLawSelection = (lawName: string) => {
    setUserAnswer((prev) => ({
      ...prev,
      selectedLaws: prev.selectedLaws.includes(lawName)
        ? prev.selectedLaws.filter((law) => law !== lawName)
        : [...prev.selectedLaws, lawName]
    }));
  };

  // 可选法律列表 (从当前案例的领域中提取)
  const availableLaws = useMemo(() => {
    if (!currentScenario) return [];
    const domain = LAW_DOMAINS.find((d) => d.id === currentScenario.domain);
    if (!domain) return [];

    // 获取该领域的所有法律 + 正确答案中的法律
    const domainLaws = domain.laws;
    const correctLaws = currentScenario.laws;
    const allLaws = Array.from(new Set([...domainLaws, ...correctLaws]));

    return allLaws.slice(0, 12); // 最多显示12部法律
  }, [currentScenario]);

  // 难度选择面板
  const renderDifficultySelection = () => (
    <Card>
      <CardHeader>
        <CardTitle>选择模拟难度</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">
            选择难度开始执法场景模拟,系统将随机抽取一个真实案例作为模拟场景。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => getRandomScenario('简单')}
              className="p-6 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 hover:border-green-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🟢</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">简单难度</h3>
              <p className="text-sm text-gray-600 mb-3">
                基础案例,法律关系清晰,适合新手练习
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon type="info" size={16} />
                <span>基础分 ×1.0</span>
              </div>
            </button>

            <button
              onClick={() => getRandomScenario('中等')}
              className="p-6 border-2 border-yellow-300 bg-yellow-50 rounded-lg hover:bg-yellow-100 hover:border-yellow-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🟡</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">中等难度</h3>
              <p className="text-sm text-gray-600 mb-3">
                常见案例,需要综合分析,适合提升能力
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon type="info" size={16} />
                <span>基础分 ×1.2</span>
              </div>
            </button>

            <button
              onClick={() => getRandomScenario('困难')}
              className="p-6 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100 hover:border-red-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔴</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">困难难度</h3>
              <p className="text-sm text-gray-600 mb-3">
                复杂案例,多重法律关系,适合高手挑战
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon type="info" size={16} />
                <span>基础分 ×1.5</span>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Icon type="info" size={18} /> 评分规则
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 法律适用 (40分): 正确选择所有适用法律,不选错误法律</li>
              <li>• 处罚决定 (30分): 处罚类型和幅度符合法律规定</li>
              <li>• 推理逻辑 (30分): 推理详细且包含关键要素</li>
              <li>• 总分乘以难度系数计入个人积分</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 场景模拟面板
  const renderSimulation = () => {
    if (!currentScenario) return null;
    const domain = LAW_DOMAINS.find((d) => d.id === currentScenario.domain);

    return (
      <div className="space-y-6">
        {/* 场景信息 */}
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{domain?.icon}</span>
                  <h2 className="text-2xl font-bold">{currentScenario.title}</h2>
                </div>
                <div className="flex items-center gap-3 text-purple-100">
                  <Badge variant="default" size="sm">
                    {domain?.name}
                  </Badge>
                  <Badge
                    variant={
                      currentScenario.difficulty === '简单'
                        ? 'success'
                        : currentScenario.difficulty === '中等'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {currentScenario.difficulty}
                  </Badge>
                  <span className="text-sm">案例编号: #{currentScenario.id}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentScenario(null);
                  setShowResult(false);
                  setScore(null);
                }}
              >
                <Icon type="close" size={16} /> 退出模拟
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 案情描述 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Icon type="case" size={20} /> 案情描述
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">{currentScenario.facts}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">关键词:</span>
              {currentScenario.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="default" size="sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {!showResult ? (
          <>
            {/* 法律选择 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Icon type="law" size={20} /> 步骤1: 选择适用法律
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  从以下法律中选择适用于本案的法律 (可多选):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableLaws.map((lawName) => {
                    const lawDetail = LAW_DETAILS[lawName];
                    const isSelected = userAnswer.selectedLaws.includes(lawName);

                    return (
                      <button
                        key={lawName}
                        onClick={() => toggleLawSelection(lawName)}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-1 w-5 h-5 border-2 rounded flex items-center justify-center ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">{lawName}</div>
                            {lawDetail && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {lawDetail.fullName}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  已选择 {userAnswer.selectedLaws.length} 部法律
                </div>
              </CardContent>
            </Card>

            {/* 处罚决定 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Icon type="warning" size={20} /> 步骤2: 提出处罚决定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  处罚措施 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userAnswer.proposedPenalty}
                  onChange={(e) =>
                    setUserAnswer({ ...userAnswer, proposedPenalty: e.target.value })
                  }
                  placeholder="例如: 警告并罚款5000元; 吊销营业执照; 没收违法所得并罚款10000元"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  请描述具体的处罚措施和金额 (如适用)
                </p>
              </CardContent>
            </Card>

            {/* 推理过程 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Icon type="bookmark" size={20} /> 步骤3: 阐述推理过程
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  推理逻辑 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={userAnswer.reasoning}
                  onChange={(e) => setUserAnswer({ ...userAnswer, reasoning: e.target.value })}
                  placeholder="请阐述你的推理过程,包括:&#10;1. 案件性质判断&#10;2. 适用法律依据&#10;3. 处罚裁量理由"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  字数越详细,推理包含关键要素越多,得分越高
                </p>
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={evaluateAnswer}
                disabled={
                  userAnswer.selectedLaws.length === 0 ||
                  !userAnswer.proposedPenalty ||
                  !userAnswer.reasoning
                }
              >
                <Icon type="success" size={20} /> 提交答案并查看评分
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* 评分结果 */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">
                    {score !== null && score >= 80 ? '🏆' : score !== null && score >= 60 ? '🎖️' : '📝'}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {score !== null ? `${score}分` : '0分'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {score !== null && score >= 80
                      ? '优秀! 执法决策准确'
                      : score !== null && score >= 60
                      ? '良好! 基本掌握要点'
                      : '继续努力! 多加练习'}
                  </div>
                </div>

                {/* 标准答案 */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Icon type="law" size={18} /> 正确法律:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentScenario.laws.map((law, idx) => (
                        <Badge
                          key={idx}
                          variant={userAnswer.selectedLaws.includes(law) ? 'success' : 'danger'}
                          size="sm"
                        >
                          {userAnswer.selectedLaws.includes(law) ? '✓' : '✗'} {law}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Icon type="warning" size={18} /> 正确处罚:
                    </h4>
                    <div className="bg-white rounded p-3 text-sm text-gray-800">
                      {currentScenario.penalty}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Icon type="bookmark" size={18} /> 推理参考:
                    </h4>
                    <div className="bg-white rounded p-3 text-sm text-gray-800">
                      {currentScenario.reasoning}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => getRandomScenario(currentScenario.difficulty)}
                  >
                    <Icon type="refresh" size={18} /> 继续{currentScenario.difficulty}难度模拟
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentScenario(null);
                      setShowResult(false);
                      setScore(null);
                    }}
                  >
                    返回选择
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🎯 执法场景模拟</h1>
            <p className="text-purple-100">实战演练 · 能力测试 · 即时反馈</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{userProgress.score || 0}</div>
              <div className="text-sm text-purple-100">累计积分</div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      {!currentScenario && (
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Icon type="info" size={24} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 选择难度后,系统随机抽取一个真实案例作为模拟场景</li>
                  <li>• 根据案情描述,选择适用法律、提出处罚决定、阐述推理过程</li>
                  <li>• 提交答案后,系统自动评分并显示标准答案</li>
                  <li>• 得分将乘以难度系数计入个人积分</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 主要内容 */}
      {!currentScenario ? renderDifficultySelection() : renderSimulation()}
    </div>
  );
}
