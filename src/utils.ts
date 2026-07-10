export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatCompactTime(timestamp: number, now: Date): string {
  const date = new Date(timestamp * 1000);
  const diffInMinutes = Math.floor(Math.max(0, now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return '<1m';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}hr`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export function formatProjectDirShortName(dir: string): string {
  const trimmed = dir.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed === '/') {
    return '/';
  }
  if (/^[A-Za-z]:\\?$/.test(trimmed)) {
    return trimmed.replace(/\\$/, '');
  }
  const normalized = trimmed.replace(/[\\/]+$/, '');
  const segments = normalized.split(/[\\/]/).filter(Boolean);
  return segments[segments.length - 1] || trimmed;
}

export function getProjectDirDisplayLabel(dir: string): string {
  return formatProjectDirShortName(dir) || '选择工作目录';
}

export function getProjectDirHoverTitle(dir: string, canPick: boolean): string {
  const trimmed = dir.trim();
  if (!trimmed) {
    return '可选：点击选择工作目录，不选则会话默认在主目录运行';
  }
  if (canPick) {
    return `工作目录: ${trimmed}（点击更换）`;
  }
  return `工作目录: ${trimmed}（点击复制）`;
}

export function renderCopyIconHtml(className = 'toolbar-copy-icon'): string {
  return `
    <span class="${className}" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    </span>
  `;
}

export function renderProjectDirCopyIconHtml(): string {
  return renderCopyIconHtml('project-dir-toolbar-copy');
}

export function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return String(n);
}

export function getContextWindowFor(tokens: number): number {
  return tokens > 200_000 ? 1_000_000 : 200_000;
}

export function isImageFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'].includes(ext);
}

export function isOtherBinaryFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  return ['pdf', 'zip', 'tar', 'gz', '7z', 'rar', 'mp4', 'mp3', 'mov', 'avi',
    'woff', 'woff2', 'ttf', 'eot', 'otf', 'exe', 'dll', 'so', 'dylib',
    'class', 'jar', 'war', 'wasm', 'bin', 'dat', 'db', 'sqlite',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pages', 'numbers', 'key',
  ].includes(ext);
}

export function getFileSuggestionIcon(filePath: string): string {
  if (filePath.endsWith('/')) return '📁';
  if (isImageFile(filePath)) return '🖼️';
  if (isOtherBinaryFile(filePath)) return '📎';
  return '📄';
}

export function getImageMime(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || 'png';
  const mimeMap: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    bmp: 'image/bmp', ico: 'image/x-icon', avif: 'image/avif',
  };
  return mimeMap[ext] || 'image/png';
}
