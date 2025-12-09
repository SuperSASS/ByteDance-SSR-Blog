/**
 * 估算文章阅读时间（分钟）
 * @param content 纯文本内容（建议在调用前就把 HTML/Markdown 去掉）
 * @param options 可选配置
 */
export function estimateReadingTime(
  content: string,
  options?: {
    /**
     * 每分钟阅读的“单位数”
     * 中文可按汉字，英文按单词数。默认 400。
     */
    unitsPerMinute?: number;
    /**
     * 是否至少为 1 分钟，默认 true
     */
    minMinutes?: number;
  }
): number {
  const unitsPerMinute = options?.unitsPerMinute ?? 400;
  const minMinutes = options?.minMinutes ?? 1;

  if (!content) {
    return minMinutes;
  }

  // 1. 简单预处理：去掉多余空白
  const normalized = content
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return minMinutes;
  }

  // 2. 统计 CJK 字符数量（中文、日文、韩文等）
  const cjkMatches = normalized.match(
    /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\uAC00-\uD7AF]/g
  );
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // 3. 统计非 CJK 部分的单词数（主要是英文等）
  const nonCjkPart = normalized.replace(
    /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\uAC00-\uD7AF]/g,
    ' '
  );
  const words = nonCjkPart
    .split(' ')
    .map((w) => w.trim())
    .filter(Boolean);
  const wordCount = words.length;

  // 4. 总阅读单位数（可以简单相加）
  const totalUnits = cjkCount + wordCount;

  // 5. 换算成分钟
  const minutes = Math.ceil(totalUnits / unitsPerMinute);

  return Math.max(minMinutes, minutes);
}
