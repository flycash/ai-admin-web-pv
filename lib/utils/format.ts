import dateFormat from 'dateformat';
// 格式化金额，目前只考虑了人民币
export function formatAmount(amt: number) {
  const realAmt = amt || 0;
  return (realAmt / 100).toFixed(2);
}

// 格式化为本地时间表达
export function formatLocaleTime(ms: number) {
  const date = new Date(ms || 0);
  return dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
}

export function formatDate(ms: number) {
  const date = new Date(ms || 0);
  return dateFormat(date, 'yyyy-mm-dd');
}

export function formatLocaleYM(ms: number) {
  const date = new Date(ms || 0);
  return dateFormat(date, 'yyyy-mm');
}

// 格式化数字（如果大于1000，显示为1k+）
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k+`
  }
  return num.toString()
}
