import { LAW_DETAILS } from '@/data/lawDetails';
import { LAW_TO_DOMAIN } from '@/data/lawDomains';
import type { Case } from '@/types';

/**
 * 从法律详情中提取所有相关案例并转换为标准化格式
 * 该函数复现原HTML中的extractCasesFromLaws逻辑
 */
export function extractCasesFromLaws(): Case[] {
  const extractedCases: Case[] = [];
  let caseId = 7; // 从7开始,因为前6个是手动定义的核心案例

  // 遍历所有法律
  Object.entries(LAW_DETAILS).forEach(([lawName, lawData]) => {
    if (!lawData.relatedCases || lawData.relatedCases.length === 0) {
      return;
    }

    const domain = LAW_TO_DOMAIN[lawName] || 1; // 默认为基础性法律法规领域

    lawData.relatedCases.forEach((caseText) => {
      // 解析案例文本格式: "标题(年份): 内容"
      // 示例: "某企业诉政务中心拒绝受理案(2021年): 企业向政务服务中心申请..."

      // 尝试解析中文冒号
      const colonIndex = caseText.indexOf('：');
      if (colonIndex === -1) {
        // 如果没有中文冒号,尝试英文冒号
        const englishColonIndex = caseText.indexOf(':');
        if (englishColonIndex === -1) {
          return; // 无法解析的格式,跳过
        }

        const title = caseText.substring(0, englishColonIndex).trim();
        const content = caseText.substring(englishColonIndex + 1).trim();

        parseAndAddCase(title, content, lawName, domain);
      } else {
        const title = caseText.substring(0, colonIndex).trim();
        const content = caseText.substring(colonIndex + 1).trim();

        parseAndAddCase(title, content, lawName, domain);
      }
    });
  });

  function parseAndAddCase(
    title: string,
    content: string,
    lawName: string,
    domain: number
  ): void {
    // 提取关键词(从标题和内容中提取)
    const keywords: string[] = [];

    // 从标题中提取关键词
    if (title.includes('食品')) keywords.push('食品安全');
    if (title.includes('商标') || title.includes('专利') || title.includes('知识产权'))
      keywords.push('知识产权');
    if (title.includes('价格') || title.includes('垄断')) keywords.push('价格竞争');
    if (title.includes('广告')) keywords.push('广告监管');
    if (title.includes('许可')) keywords.push('行政许可');
    if (title.includes('处罚')) keywords.push('行政处罚');
    if (title.includes('诉讼')) keywords.push('行政诉讼');
    if (title.includes('消费者')) keywords.push('消费者权益');
    if (title.includes('质量')) keywords.push('产品质量');
    if (title.includes('特种设备') || title.includes('电梯')) keywords.push('特种设备');

    // 如果没有提取到关键词,使用法律名称作为关键词
    if (keywords.length === 0) {
      keywords.push(lawName);
    }

    // 确定案件难度(基于内容长度和复杂度)
    let difficulty: '简单' | '中等' | '困难';
    if (content.length < 150) {
      difficulty = '简单';
    } else if (content.length < 300) {
      difficulty = '中等';
    } else {
      difficulty = '困难';
    }

    // 如果涉及多部法律或复杂法律程序,提升难度
    if (
      content.includes('移送') ||
      content.includes('刑事') ||
      content.includes('听证') ||
      content.includes('复议')
    ) {
      difficulty = '困难';
    }

    // 创建案例对象
    const caseObj: Case = {
      id: caseId++,
      title: title,
      domain: domain,
      difficulty: difficulty,
      facts: content,
      keywords: keywords,
      laws: [lawName],
      penalty: extractPenalty(content),
      reasoning: extractReasoning(content)
    };

    extractedCases.push(caseObj);
  }

  function extractPenalty(content: string): string {
    // 尝试从内容中提取处罚部分
    const penaltyKeywords = [
      '罚款',
      '没收',
      '吊销',
      '责令',
      '赔偿',
      '判决',
      '处罚',
      '撤销'
    ];

    const sentences = content.split(/[。.]/);
    for (const sentence of sentences) {
      if (penaltyKeywords.some((keyword) => sentence.includes(keyword))) {
        return sentence.trim();
      }
    }

    return '依法处理';
  }

  function extractReasoning(content: string): string {
    // 尝试从内容中提取法律推理部分
    const reasoningKeywords = [
      '法院认定',
      '法院认为',
      '该案',
      '判决',
      '明确了',
      '确立了',
      '强调了'
    ];

    const sentences = content.split(/[。.]/);
    for (const sentence of sentences) {
      if (reasoningKeywords.some((keyword) => sentence.includes(keyword))) {
        return sentence.trim();
      }
    }

    // 如果找不到特定推理,返回内容的后半部分
    const halfPoint = Math.floor(content.length / 2);
    return content.substring(halfPoint).split(/[。.]/)[0].trim();
  }

  return extractedCases;
}

/**
 * 获取完整的案例库(包含手动定义的核心案例 + 从法律中提取的案例)
 */
export function getAllCases(): Case[] {
  const CORE_CASES: Case[] = [
    {
      id: 1,
      title: '餐饮店使用过期食材案',
      domain: 2,
      difficulty: '简单',
      facts: '某餐饮店在日常检查中被发现使用超过保质期的食用油,涉及金额约2000元',
      keywords: ['食品安全', '过期食材', '餐饮服务'],
      laws: ['食品安全法第34条', '食品安全法第124条', '食品安全法第148条'],
      penalty: '罚款5万-10万元,没收违法所得,可吊销许可证',
      reasoning:
        '根据食品安全法第34条,禁止生产经营超过保质期的食品。这属于明确的违法行为,需要依法处罚。同时告知消费者可主张"退一赔十"的惩罚性赔偿。'
    },
    {
      id: 2,
      title: '保健食品虚假宣传案',
      domain: 7,
      difficulty: '中等',
      facts: '某保健食品公司在广告中宣称其产品可以"治疗糖尿病"、"根治高血压",经查证这些功能声称没有科学依据',
      keywords: ['虚假广告', '保健食品', '疗效宣传'],
      laws: ['广告法第28条', '广告法第55条', '反不正当竞争法第8条', '食品安全法'],
      penalty: '广告费用3-5倍罚款,责令停止发布',
      reasoning:
        '保健食品不得宣传疾病治疗功能。此案涉及虚假广告和虚假宣传,应优先适用广告法(特别法优于一般法原则)。'
    },
    {
      id: 3,
      title: '电商平台价格欺诈案',
      domain: 5,
      difficulty: '中等',
      facts: '某电商平台商家虚构原价,标注"原价999元,现价299元",但经查证该商品从未以999元销售过',
      keywords: ['价格欺诈', '虚假原价', '电商平台'],
      laws: ['价格法', '明码标价和禁止价格欺诈规定', '价格违法行为行政处罚规定', '消费者权益保护法'],
      penalty: '罚款,责令改正,消费者可主张"退一赔三"',
      reasoning:
        '虚构原价是典型的价格欺诈行为。需要同时追究商家和平台责任(若平台未尽审核义务)。'
    },
    {
      id: 4,
      title: '无证无照经营案',
      domain: 4,
      difficulty: '简单',
      facts: '某人在未取得营业执照和食品经营许可证的情况下,在居民区开设小餐馆经营',
      keywords: ['无证经营', '无照经营', '餐饮服务'],
      laws: ['无证无照经营查处办法', '市场主体登记管理条例', '食品安全法'],
      penalty: '责令停止经营,没收违法所得,罚款',
      reasoning: '同时缺少营业执照和行业许可证,属于严重违法。应立即责令停���,并处罚款。'
    },
    {
      id: 5,
      title: '电梯维保不合格案',
      domain: 3,
      difficulty: '困难',
      facts: '某物业公司使用的电梯因维保不到位发生故障,导致乘客被困2小时。检查发现该电梯已超过检验有效期',
      keywords: ['特种设备', '电梯安全', '维保责任'],
      laws: ['特种设备安全法', '特种设备安全监察条例', '安全生产法'],
      penalty: '责令限期改正,罚款3万-30万元,严重可吊销许可',
      reasoning:
        '特种设备必须定期检验。物业公司作为使用单位,未履行安全管理责任,需承担法律责任。若造成人员伤亡,还可能涉及刑事责任。'
    },
    {
      id: 6,
      title: '假冒注册商标案',
      domain: 6,
      difficulty: '困难',
      facts: '某店铺销售假冒"耐克"品牌运动鞋,鉴定为假货,涉案金额8万元',
      keywords: ['商标侵权', '假冒商品', '知识产权'],
      laws: ['商标法', '商标法实施条例', '刑法', '反不正当竞争法'],
      penalty: '没收、销毁侵权商品,罚款,涉案金额较大移送公安',
      reasoning:
        '假冒注册商标行为同时违反商标法和刑法。达到刑事立案标准的,应移送公安机关。民事上,权利人可请求惩罚性赔偿。'
    }
  ];

  const extractedCases = extractCasesFromLaws();
  return [...CORE_CASES, ...extractedCases];
}
