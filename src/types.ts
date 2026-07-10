export interface Message {
  id: string;
  role: string;
  content: string;
  thinking?: string;
  timestamp: number;
  refs?: FileRef[];
}

export interface FileRef {
  path: string;
  isImage: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  platform: string;
  project_dir?: string | null;
  source_path?: string | null;
  created_at: number;
  updated_at: number;
  context_tokens?: number | null;
  last_model?: string | null;
}

export interface SessionErrorPayload {
  conversationId: string | null;
  error: string;
}

export interface SessionEventPayload {
  conversation_id: string;
  conversationId?: string;
  title: string;
  messages: Message[];
  project_dir?: string | null;
  projectDir?: string | null;
  updated_at: number;
  updatedAt?: number;
  context_tokens?: number | null;
  last_model?: string | null;
}

export interface PlatformConfig {
  name: string;
  command: string;
  args: string[];
  env_vars: Record<string, string>;
}

export interface MessageChunkPayload {
  conversation_id: string;
  kind: string;
  content: string;
}

export interface ClaudeCodeApiConfig {
  baseUrl: string;
  hasApiKey: boolean;
  defaultModel: string;
  haikuModel: string;
  sonnetModel: string;
  opusModel: string;
  displayModels?: string[];
  customModels?: string[];
  configPath: string;
}

export interface ApiProfileItem {
  id: string;
  name: string;
  baseUrl: string;
  defaultModel: string;
  hasApiKey: boolean;
  isActive: boolean;
}

export interface ApiProfilesState {
  activeProfileId: string | null;
  profiles: ApiProfileItem[];
  current: ClaudeCodeApiConfig;
}

export interface CcSwitchImportResult {
  importedCount: number;
  skippedCount: number;
  skippedNames: string[];
  ccSwitchPath: string;
  state: ApiProfilesState;
}

export interface FetchedModel {
  id: string;
  ownedBy?: string | null;
}

export type ThemeMode = 'light' | 'dark';

export interface StreamingState {
  thinking: string;
  content: string;
  thinkingDone: boolean;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  sub?: string;
  confirmLabel?: string;
}

export interface ProfileContextMenuOptions {
  x: number;
  y: number;
  profileId: string;
  profileName: string;
  isActive: boolean;
  allowDelete?: boolean;
  onApply: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}
