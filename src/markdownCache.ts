import { renderMarkdown as renderMarkdownUnsafe } from './markdown';

const markdownCache = new Map<string, string>();
const MARKDOWN_CACHE_MAX = 3000;

// Markdown 渲染缓存：避免对相同内容重复调用 marked.parse + DOMPurify
export function renderMarkdown(src: string): string {
  const cached = markdownCache.get(src);
  if (cached !== undefined) return cached;

  const html = renderMarkdownUnsafe(src);
  if (markdownCache.size >= MARKDOWN_CACHE_MAX) {
    const firstKey = markdownCache.keys().next().value;
    if (firstKey !== undefined) markdownCache.delete(firstKey);
  }

  markdownCache.set(src, html);
  return html;
}
