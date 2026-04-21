export function formatNaira(amount, compact = false) {
  if (amount == null) return '₦0';
  if (compact) {
    if (Math.abs(amount) >= 1e12) return `₦${(amount / 1e12).toFixed(1)}T`;
    if (Math.abs(amount) >= 1e9) return `₦${(amount / 1e9).toFixed(1)}B`;
    if (Math.abs(amount) >= 1e6) return `₦${(amount / 1e6).toFixed(1)}M`;
    if (Math.abs(amount) >= 1e3) return `₦${(amount / 1e3).toFixed(0)}K`;
  }
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value, showSign = true) {
  if (value == null) return '0%';
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(1)}%`;
}

export function getReturnColor(value) {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-white/60';
}

export function getReturnColorLight(value) {
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-red-500';
  return 'text-muted-foreground';
}