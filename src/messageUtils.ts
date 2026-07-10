import type { Message } from './types';
import { escapeHtml } from './utils';

const HIDDEN_ROLES = new Set(['tool_use', 'tool_result']);

/** 将独立的 thinking 消息内容合并到后续 assistant 消息的 thinking 属性中 */
export function mergeThinkingIntoAssistant(messages: Message[]): Message[] {
  const result: Message[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === 'thinking' && msg.content.trim()) {
      // 向后查找对应的 assistant 消息
      let targetIdx = -1;
      for (let j = i + 1; j < messages.length; j++) {
        const next = messages[j];
        if (next.role === 'thinking' || HIDDEN_ROLES.has(next.role)) continue;
        if (next.role === 'assistant' && next.content.trim()) targetIdx = j;
        break;
      }
      if (targetIdx >= 0) {
        // 将思考内容合并到目标 assistant 消息（浅拷贝避免修改原数据）
        const target = messages[targetIdx];
        const merged = { ...target, thinking: ((target.thinking || '') + '\n' + msg.content).trim() };
        messages[targetIdx] = merged;
        continue; // 跳过此 thinking 消息
      }
    }

    result.push(msg);
  }

  return result;
}

export function filterVisibleMessages(messages: Message[]): Message[] {
  return messages.filter((msg, index) => {
    // 过滤内部系统消息
    const trimmed = msg.content.trim();
    if (
      trimmed.startsWith('<system-reminder>')
      || trimmed.startsWith('<local-command-caveat>')
      || trimmed.startsWith('<command-name>')
      || trimmed.startsWith('<local-command-stdout>')
    ) {
      return false;
    }

    // 隐藏 tool_use 和 tool_result 消息
    if (HIDDEN_ROLES.has(msg.role)) return false;

    if (msg.role !== 'thinking') return true;
    // thinking 消息：如果后续（跳过其他 thinking / tool_use / tool_result）有内容的 assistant 消息则隐藏
    for (let i = index + 1; i < messages.length; i++) {
      const next = messages[i];
      if (next.role === 'thinking' || HIDDEN_ROLES.has(next.role)) continue;
      return !(next.role === 'assistant' && next.content.trim());
    }
    return true;
  });
}

export function renderThinkingDetails(thinking: string, label: string, expanded: boolean, dataId?: string): string {
  const openAttr = expanded ? ' open' : '';
  const dataAttr = dataId ? ` data-thinking-id="${escapeHtml(dataId)}"` : '';
  return `
    <details class="thinking-block"${openAttr}${dataAttr}>
      <summary class="thinking-summary">${escapeHtml(label)}</summary>
      <div class="thinking-content"><pre>${escapeHtml(thinking)}</pre></div>
    </details>
  `;
}
