/**
 * 获取头像后备文本（当用户或租户没有头像时使用）
 *
 * 英文字符：支持多种分隔符（空格、连字符、下划线、点号、驼峰命名），取首尾单词首字母
 * 非英文字符：直接取第一个字符
 *
 * @param name - 用户名或租户名
 * @returns 大写的首字母缩写（英文）或第一个字符（非英文）
 *
 * @example
 * // 英文名称
 * getAvatarFallback("John Doe") // "JD"
 * getAvatarFallback("john-doe") // "JD"
 * getAvatarFallback("john_doe") // "JD"
 * getAvatarFallback("john.doe") // "JD"
 * getAvatarFallback("JohnDoe") // "JD"
 * getAvatarFallback("johnDoe") // "JD"
 * getAvatarFallback("John") // "J"
 *
 * // 非英文名称
 * getAvatarFallback("张三") // "张"
 * getAvatarFallback("田中太郎") // "田"
 * getAvatarFallback("محمد") // "م"
 * getAvatarFallback("Владимир") // "В"
 *
 * // 边界情况
 * getAvatarFallback("") // ""
 */
export function getAvatarFallback(name: string): string {
  if (!name) {
    return "";
  }

  // 检查字符串是否主要由英文字符组成（字母、数字、常见分隔符）
  const isEnglish = /^[a-zA-Z0-9\s\-_.]+$/.test(name);

  // 如果不是英文，直接返回第一个字符
  if (!isEnglish) {
    return name.charAt(0);
  }

  // 英文字符处理逻辑

  // 1. 先处理驼峰命名，在大写字母前插入分隔符
  // 例如: "JohnDoe" -> "John-Doe", "johnDoe" -> "john-Doe"
  const withSeparators = name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase 转换
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2"); // PascalCase 连续大写处理

  // 2. 根据多种分隔符进行分割（空格、连字符、下划线、点号）
  const words = withSeparators
    .split(/[\s\-_.]+/)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    // 只有一个单词，返回首字母大写
    return words[0].charAt(0).toUpperCase();
  }

  // 多个单词，返回首尾单词的首字母大写
  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
}
