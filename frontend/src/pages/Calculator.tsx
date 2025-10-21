import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Icon, Button } from '@/components';

/**
 * Calculator页面 - 行政处罚裁量计算器
 * 智能计算处罚金额,基于违法金额、主观过错、后果严重程度、整改态度等因素
 */
export default function Calculator() {
  const [violationAmount, setViolationAmount] = useState('');
  const [subjectiveFault, setSubjectiveFault] = useState('');
  const [consequence, setConsequence] = useState('');
  const [rectificationAttitude, setRectificationAttitude] = useState('');
  const [hasPriorViolation, setHasPriorViolation] = useState(false);
  const [calculatedPenalty, setCalculatedPenalty] = useState<{
    basePenalty: number;
    adjustedPenalty: number;
    minPenalty: number;
    maxPenalty: number;
    recommendation: string;
    factors: string[];
  } | null>(null);

  // 计算处罚金额
  const calculatePenalty = () => {
    if (!violationAmount || !subjectiveFault || !consequence || !rectificationAttitude) {
      alert('请填写所有必填项');
      return;
    }

    const amount = parseFloat(violationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的违法金额');
      return;
    }

    let basePenalty = amount;
    let multiplier = 1.0;
    const factors: string[] = [];

    // 主观过错系数
    const faultMultipliers: Record<string, number> = {
      故意: 2.0,
      过失: 1.5,
      无过错: 1.0
    };
    multiplier *= faultMultipliers[subjectiveFault] || 1.0;
    if (subjectiveFault === '故意') {
      factors.push('故意违法,从重处罚 (×2.0)');
    } else if (subjectiveFault === '过失') {
      factors.push('过失违法,一般处罚 (×1.5)');
    }

    // 造成后果系数
    const consequenceMultipliers: Record<string, number> = {
      严重: 1.8,
      一般: 1.3,
      较轻: 1.0
    };
    multiplier *= consequenceMultipliers[consequence] || 1.0;
    if (consequence === '严重') {
      factors.push('后果严重,从重处罚 (×1.8)');
    } else if (consequence === '一般') {
      factors.push('后果一般,标准处罚 (×1.3)');
    }

    // 整改态度调整系数
    const attitudeAdjustments: Record<string, number> = {
      主动: 0.7,
      配合: 0.85,
      抗拒: 1.2
    };
    multiplier *= attitudeAdjustments[rectificationAttitude] || 1.0;
    if (rectificationAttitude === '主动') {
      factors.push('主动整改,从轻处罚 (×0.7)');
    } else if (rectificationAttitude === '配合') {
      factors.push('配合整改,酌情从轻 (×0.85)');
    } else if (rectificationAttitude === '抗拒') {
      factors.push('抗拒整改,从重处罚 (×1.2)');
    }

    // 前科加重
    if (hasPriorViolation) {
      multiplier *= 1.5;
      factors.push('二年内再次违法,从重处罚 (×1.5)');
    }

    const adjustedPenalty = basePenalty * multiplier;
    const minPenalty = adjustedPenalty * 0.8; // -20%裁量空间
    const maxPenalty = adjustedPenalty * 1.2; // +20%裁量空间

    // 生成建议
    let recommendation = '';
    if (multiplier >= 3.0) {
      recommendation = '建议按上限处罚,并考虑移送司法机关';
    } else if (multiplier >= 2.0) {
      recommendation = '建议从重处罚,接近或达到上限';
    } else if (multiplier >= 1.5) {
      recommendation = '建议标准处罚,在中间值范围内';
    } else if (multiplier >= 1.0) {
      recommendation = '建议从轻处罚,接近或达到下限';
    } else {
      recommendation = '建议按下限处罚,并考虑免除处罚的可能性';
    }

    setCalculatedPenalty({
      basePenalty,
      adjustedPenalty,
      minPenalty,
      maxPenalty,
      recommendation,
      factors
    });
  };

  // 重置表单
  const resetForm = () => {
    setViolationAmount('');
    setSubjectiveFault('');
    setConsequence('');
    setRectificationAttitude('');
    setHasPriorViolation(false);
    setCalculatedPenalty(null);
  };

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🧮 行政处罚裁量计算器</h1>
            <p className="text-orange-100">智能计算处罚金额 · 基于裁量基准 · 公平公正</p>
          </div>
          <div className="hidden md:block text-6xl">
            <Icon type="chart" size={80} />
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="bg-blue-50 border-l-4 border-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon type="info" size={24} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 输入违法金额作为基础罚款计算基数</li>
                <li>• 选择主观过错、后果严重程度、整改态度等裁量因素</li>
                <li>• 系统自动计算建议处罚金额及裁量空间</li>
                <li>• 最终处罚决定需结合具体案情和法律规定</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧: 输入表单 */}
        <Card>
          <CardHeader>
            <CardTitle>裁量因素输入</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 违法金额 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                违法金额 (元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={violationAmount}
                onChange={(e) => setViolationAmount(e.target.value)}
                placeholder="请输入违法涉案金额"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                作为计算基数,一般等于违法所得或违法交易金额
              </p>
            </div>

            {/* 主观过错 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主观过错程度 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['故意', '过失', '无过错'].map((fault) => (
                  <button
                    key={fault}
                    onClick={() => setSubjectiveFault(fault)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      subjectiveFault === fault
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {fault}
                  </button>
                ))}
              </div>
            </div>

            {/* 造成后果 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                造成后果严重程度 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['严重', '一般', '较轻'].map((cons) => (
                  <button
                    key={cons}
                    onClick={() => setConsequence(cons)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      consequence === cons
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {cons}
                  </button>
                ))}
              </div>
            </div>

            {/* 整改态度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                整改态度 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['主动', '配合', '抗拒'].map((attitude) => (
                  <button
                    key={attitude}
                    onClick={() => setRectificationAttitude(attitude)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      rectificationAttitude === attitude
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {attitude}
                  </button>
                ))}
              </div>
            </div>

            {/* 是否有前科 */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPriorViolation}
                  onChange={(e) => setHasPriorViolation(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  二年内有同类违法行为 (从重处罚)
                </span>
              </label>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button variant="primary" fullWidth onClick={calculatePenalty}>
                <Icon type="chart" size={18} /> 计算处罚金额
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <Icon type="refresh" size={18} /> 重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 右侧: 计算结果 */}
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            {!calculatedPenalty ? (
              <div className="text-center py-12 text-gray-400">
                <Icon type="chart" size={64} />
                <p className="mt-4">填写左侧表单后点击计算</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 核心数据 */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
                  <div className="text-sm mb-2">建议处罚金额</div>
                  <div className="text-4xl font-bold mb-1">
                    {formatCurrency(calculatedPenalty.adjustedPenalty)}
                  </div>
                  <div className="text-sm text-orange-100">
                    裁量空间: {formatCurrency(calculatedPenalty.minPenalty)} ~{' '}
                    {formatCurrency(calculatedPenalty.maxPenalty)}
                  </div>
                </div>

                {/* 详细数据 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">基础罚款</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(calculatedPenalty.basePenalty)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">综合系数</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {(calculatedPenalty.adjustedPenalty / calculatedPenalty.basePenalty).toFixed(2)}×
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-blue-600 mb-1">最低金额</div>
                    <div className="text-lg font-semibold text-blue-900">
                      {formatCurrency(calculatedPenalty.minPenalty)}
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-xs text-red-600 mb-1">最高金额</div>
                    <div className="text-lg font-semibold text-red-900">
                      {formatCurrency(calculatedPenalty.maxPenalty)}
                    </div>
                  </div>
                </div>

                {/* 裁量因素 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Icon type="bookmark" size={18} /> 裁量因素分析
                  </h4>
                  <div className="space-y-2">
                    {calculatedPenalty.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 处罚建议 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <Icon type="info" size={18} /> 处罚建议
                  </h4>
                  <p className="text-sm text-yellow-800">{calculatedPenalty.recommendation}</p>
                </div>

                {/* 法律依据 */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <Icon type="law" size={16} /> 法律依据
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 《行政处罚法》第32条: 当事人有从轻或减轻处罚情形的,应当依法从轻或减轻</li>
                    <li>• 《行政处罚法》第33条: 初次违法且危害后果轻微并及时改正的,可不予处罚</li>
                    <li>• 各领域裁量基准: 根据违法情节、社会危害程度等因素综合裁量</li>
                  </ul>
                </div>

                {/* 免责声明 */}
                <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
                  <strong>免责声明:</strong>{' '}
                  本计算器仅供参考,实际处罚决定应根据具体案情、法律法规及裁量基准综合确定。
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
