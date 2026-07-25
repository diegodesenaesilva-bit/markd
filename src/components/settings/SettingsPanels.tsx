import {
  FolderOpen,
  Globe2,
  Monitor,
  Moon,
  RefreshCw,
  RotateCcw,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CloudAccount, Theme } from "@/lib/types";
import {
  findShortcutConflict,
  formatShortcutParts,
  sameShortcut,
  shortcutFromEvent,
  SHORTCUT_DEFINITIONS,
  type ShortcutAction,
  type ShortcutBinding,
} from "@/lib/shortcuts";
import { cx, isMac } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { CloudAccountCard } from "@/components/settings/CloudAccountCard";
import { openCloudBillingPortal, openCloudPlans } from "@/lib/cloud";
import { useShortcuts } from "@/stores/shortcuts";
import { useUi } from "@/stores/ui";
import { useUpdater } from "@/stores/updater";
import { useVault } from "@/stores/vault";

const THEMES: Array<{
  value: Theme;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: "system",
    label: "System",
    description: "Match your system",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    description: "Bright canvas",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low light",
    icon: Moon,
  },
];

import { useAiStore } from "@/stores/ai";
import { testOnlineAiConnection } from "@/lib/ai";

export function GeneralSettings() {
  const root = useVault((state) => state.root);
  const chooseVault = useVault((state) => state.chooseVault);
  const updateStatus = useUpdater((state) => state.status);
  const updateVersion = useUpdater((state) => state.version);
  const checkUpdate = useUpdater((state) => state.check);
  const requestInstall = useUpdater((state) => state.requestInstall);
  const setSettingsOpen = useUi((state) => state.setSettingsOpen);

  const {
    activeProvider,
    setActiveProvider,
    geminiApiKey,
    setGeminiApiKey,
    groqApiKey,
    setGroqApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    claudeApiKey,
    setClaudeApiKey,
    qwenApiKey,
    setQwenApiKey,
    ollamaCloudApiKey,
    setOllamaCloudApiKey,
    geminiModel,
    setGeminiModel,
    groqModel,
    setGroqModel,
    openaiModel,
    setOpenaiModel,
    claudeModel,
    setClaudeModel,
    qwenModel,
    setQwenModel,
    ollamaCloudUrl,
    setOllamaCloudUrl,
    ollamaCloudModel,
    setOllamaCloudModel,
  } = useAiStore();

  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedProvider, setSavedProvider] = useState(false);

  const handleSaveAll = () => {
    setSavedProvider(true);
    toast.success("Configurações de IA salvas com sucesso!");
    setTimeout(() => setSavedProvider(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const response = await testOnlineAiConnection();
      setTestResult({
        success: true,
        message: `✓ Conexão Estabelecida com Sucesso! Resposta da IA: "${response.trim()}"`,
      });
      toast.success("Conexão com a IA estabelecida com sucesso!");
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Erro desconhecido ao testar conexão.",
      });
      toast.error("Falha ao testar conexão com a IA.");
    } finally {
      setTestingAi(false);
    }
  };

  const updateCopy =
    updateStatus === "available"
      ? `Version ${updateVersion} is available`
      : updateStatus === "downloading" || updateStatus === "ready"
        ? "Installing…"
        : updateStatus === "checking"
          ? "Checking for updates…"
          : `You're on version ${updateVersion || "0.1.6"}`;

  return (
    <div className="space-y-6">
      <SettingsGroup
        title="Peça ao Mark ✨ (Assistente de IA 100% Online)"
        description="Escolha qual motor de inteligência artificial na nuvem você deseja usar como cérebro do programa."
      >
        <div className="space-y-4 rounded-xl bg-panel p-4">
          {/* Online Provider Selection Grid */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-muted">Selecione o Provedor de IA Online:</label>
            <div className="grid grid-cols-3 gap-2">
              {/* Ollama Cloud */}
              <button
                type="button"
                onClick={() => { setActiveProvider("ollama_cloud"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "ollama_cloud"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">☁️ Ollama Cloud</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">ollama.com/settings/keys</div>
              </button>

              {/* Google Gemini */}
              <button
                type="button"
                onClick={() => { setActiveProvider("gemini"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "gemini"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">🌐 Google Gemini</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">Grátis &amp; Rápido</div>
              </button>

              {/* Groq */}
              <button
                type="button"
                onClick={() => { setActiveProvider("groq"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "groq"
                    ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">⚡ Groq (Llama 3.3)</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">Ultra Rápido (Grátis)</div>
              </button>

              {/* OpenAI ChatGPT */}
              <button
                type="button"
                onClick={() => { setActiveProvider("openai"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "openai"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">🟢 OpenAI ChatGPT</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">GPT-4o &amp; GPT-4o-mini</div>
              </button>

              {/* Anthropic Claude */}
              <button
                type="button"
                onClick={() => { setActiveProvider("claude"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "claude"
                    ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">🎭 Anthropic Claude</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">Claude 3.5 Sonnet</div>
              </button>

              {/* Qwen Cloud */}
              <button
                type="button"
                onClick={() => { setActiveProvider("qwen"); setTestResult(null); }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  activeProvider === "qwen"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "border-line bg-bg text-ink hover:bg-hover"
                }`}
              >
                <div className="text-xs flex items-center gap-1">☁️ Qwen Cloud</div>
                <div className="text-[10px] text-faint font-normal mt-0.5">Alibaba Qwen Max</div>
              </button>
            </div>
          </div>

          {/* Configuration Inputs for Active Provider */}
          <div className="pt-2 space-y-3 border-t border-line/50">
            {activeProvider === "ollama_cloud" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API do Ollama Cloud:</label>
                  <input
                    type="password"
                    value={ollamaCloudApiKey}
                    onChange={(e) => setOllamaCloudApiKey(e.target.value)}
                    placeholder="Cole sua API Key gerada no ollama.com/settings/keys"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-emerald-500 placeholder:text-faint"
                  />
                  <p className="text-[11px] text-faint">
                    Obtenha ou adicione sua chave de acesso no painel do{" "}
                    <a href="https://ollama.com/settings/keys" target="_blank" rel="noreferrer" className="text-emerald-500 underline">
                      ollama.com/settings/keys
                    </a>.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">URL do Servidor Ollama Cloud:</label>
                  <input
                    type="text"
                    value={ollamaCloudUrl}
                    onChange={(e) => setOllamaCloudUrl(e.target.value)}
                    placeholder="https://ollama.com"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo de IA do Ollama Cloud:</label>
                  <select
                    value={ollamaCloudModel}
                    onChange={(e) => setOllamaCloudModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-emerald-500"
                  >
                    <option value="qwen2.5">qwen2.5 (Recomendado)</option>
                    <option value="llama3.3">llama3.3 (Llama 3.3 70B)</option>
                    <option value="deepseek-r1">deepseek-r1 (DeepSeek R1)</option>
                    <option value="mistral">mistral (Mistral 7B)</option>
                  </select>
                </div>
              </>
            )}

            {activeProvider === "gemini" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API do Google Gemini:</label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Cole sua API Key do Google AI Studio (AIzaSy...)"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-blue-500 placeholder:text-faint"
                  />
                  <p className="text-[11px] text-faint">
                    Obtenha uma chave gratuita no{" "}
                    <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                      Google AI Studio
                    </a>.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo do Gemini:</label>
                  <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-blue-500"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recomendado - Ultra Rápido)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mais Inteligente)</option>
                  </select>
                </div>
              </>
            )}

            {activeProvider === "groq" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API do Groq (gsk_...):</label>
                  <input
                    type="password"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    placeholder="Cole sua API Key do Groq aqui (gsk_...)"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-orange-500 placeholder:text-faint"
                  />
                  <p className="text-[11px] text-faint">
                    Obtenha sua chave gratuita no{" "}
                    <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-orange-500 underline">
                      Console da Groq
                    </a>.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo da Groq:</label>
                  <select
                    value={groqModel}
                    onChange={(e) => setGroqModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-orange-500"
                  >
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Recomendado)</option>
                    <option value="llama3-8b-8192">Llama 3 8B (Ultra Rápido)</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>
              </>
            )}

            {activeProvider === "openai" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API da OpenAI (sk-...):</label>
                  <input
                    type="password"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="Cole sua API Key da OpenAI (sk-...)"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-green-500 placeholder:text-faint"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo da OpenAI:</label>
                  <select
                    value={openaiModel}
                    onChange={(e) => setOpenaiModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-green-500"
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini (Econômico &amp; Rápido)</option>
                    <option value="gpt-4o">GPT-4o (Mais Poderoso)</option>
                  </select>
                </div>
              </>
            )}

            {activeProvider === "claude" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API da Anthropic Claude (sk-ant-...):</label>
                  <input
                    type="password"
                    value={claudeApiKey}
                    onChange={(e) => setClaudeApiKey(e.target.value)}
                    placeholder="Cole sua API Key do Claude (sk-ant-...)"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-purple-500 placeholder:text-faint"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo do Claude:</label>
                  <select
                    value={claudeModel}
                    onChange={(e) => setClaudeModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-purple-500"
                  >
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Excelente)</option>
                    <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Mais Rápido)</option>
                  </select>
                </div>
              </>
            )}

            {activeProvider === "qwen" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Chave da API do Qwen Cloud (sk-...):</label>
                  <input
                    type="password"
                    value={qwenApiKey}
                    onChange={(e) => setQwenApiKey(e.target.value)}
                    placeholder="Cole sua API Key do Qwen (sk-...)"
                    className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-indigo-500 placeholder:text-faint"
                  />
                  <p className="text-[11px] text-faint">
                    Obtenha sua chave no{" "}
                    <a href="https://modelstudio.console.alibabacloud.com/" target="_blank" rel="noreferrer" className="text-indigo-500 underline">
                      Alibaba Cloud / DashScope Console
                    </a>.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-muted">Modelo do Qwen Cloud:</label>
                  <select
                    value={qwenModel}
                    onChange={(e) => setQwenModel(e.target.value)}
                    className="rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-ink outline-none focus:border-indigo-500"
                  >
                    <option value="qwen-max">Qwen-Max (Mais Poderoso)</option>
                    <option value="qwen-plus">Qwen-Plus (Equilibrado)</option>
                    <option value="qwen-turbo">Qwen-Turbo (Ultra Rápido)</option>
                  </select>
                </div>
              </>
            )}

            {/* Test Result Banner */}
            {testResult && (
              <div
                className={`rounded-xl border p-3 text-xs leading-relaxed ${
                  testResult.success
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                }`}
              >
                {testResult.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={testingAi}
                onClick={handleTestConnection}
                className="bg-bg shrink-0 text-xs"
              >
                {testingAi ? "Testando..." : "🧪 Testar Conexão da IA"}
              </Button>
              <Button onClick={handleSaveAll} size="sm" className="bg-purple-600 text-white shrink-0 text-xs hover:bg-purple-700">
                {savedProvider ? "Salvo com Sucesso! ✓" : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </div>
      </SettingsGroup>
      <SettingsGroup
        title="Vault"
        description="The folder Markd uses for notes and local app data."
      >
        <div className="flex items-center gap-3 rounded-xl bg-panel p-3">
          <p
            title={root}
            className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted"
          >
            {root}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={chooseVault}
            className="shrink-0 bg-bg"
          >
            <FolderOpen size={13.5} strokeWidth={1.75} />
            Change
          </Button>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Software updates"
        description="Keep Markd current with the latest fixes and improvements."
      >
        <div className="flex items-center justify-between gap-4 rounded-xl bg-panel p-3">
            <p aria-live="polite" className="min-w-0 text-[12.5px] text-muted">
              {updateCopy}
            </p>
            {updateStatus === "available" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSettingsOpen(false);
                  void requestInstall();
                }}
                className="shrink-0 bg-bg"
              >
                Install &amp; restart
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => checkUpdate({ silent: false })}
                disabled={
                  updateStatus === "checking" || updateStatus === "downloading"
                }
                className="shrink-0 bg-bg"
              >
                {updateStatus === "checking" ? (
                  <Spinner size={14} />
                ) : (
                  <RefreshCw size={13} strokeWidth={1.75} />
                )}
                Check
              </Button>
            )}
        </div>
      </SettingsGroup>
    </div>
  );
}

export function CloudSettings() {
  const [account, setAccount] = useState<CloudAccount | null>(null);
  const [billingBusy, setBillingBusy] = useState<"plans" | "portal" | null>(null);

  const openBilling = (kind: "plans" | "portal", action: () => Promise<void>) => {
    setBillingBusy(kind);
    void action()
      .catch((cause) => {
        toast.error(cause instanceof Error ? cause.message : "Billing could not be opened.");
      })
      .finally(() => setBillingBusy(null));
  };

  return (
    <div className="space-y-6">
      <SettingsGroup
        title="Account"
        description="Sign in once to manage public pages and future synced devices."
      >
        <CloudAccountCard onAccountChange={setAccount} />
      </SettingsGroup>

      <SettingsGroup
        title="Subscription"
        description="Your Markd Cloud access for publishing and future sync."
      >
        <div className="flex items-center gap-3 rounded-xl bg-panel p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-bg text-muted">
            <Globe2 size={15.5} strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[12.5px] font-semibold text-ink">Markd Cloud</p>
              {account?.plan === "cloud" && (
                <StatusBadge tone="success">Active</StatusBadge>
              )}
            </div>
            <p className="mt-0.5 text-[10.5px] text-faint">
              {account?.plan === "cloud"
                ? "Publishing is active for this account."
                : "Publish connected notes and hosted images on the web."}
            </p>
          </div>
          {account?.plan === "cloud" ? (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 bg-bg"
              loading={billingBusy === "portal"}
              disabled={Boolean(billingBusy)}
              onClick={() => openBilling("portal", openCloudBillingPortal)}
            >
              {billingBusy === "portal" ? "Opening…" : "Manage billing"}
            </Button>
          ) : account ? (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 bg-bg"
              loading={billingBusy === "plans"}
              disabled={Boolean(billingBusy)}
              onClick={() => openBilling("plans", openCloudPlans)}
            >
              {billingBusy === "plans" ? "Opening…" : "View plans"}
            </Button>
          ) : null}
        </div>
        <p className="mt-2.5 text-[10.5px] text-faint">
          Billing and subscription changes are managed on the web.
        </p>
      </SettingsGroup>
    </div>
  );
}

export function AppearanceSettings() {
  const theme = useVault((state) => state.theme);
  const setTheme = useVault((state) => state.setTheme);
  const mac = isMac();
  const cycleTheme = useShortcuts((state) => state.bindings.cycleTheme);

  return (
    <SettingsGroup
      title="Theme"
      description="Choose how Markd looks across the editor and navigation."
      aside={
        <span className="flex items-center text-[10.5px] text-faint">
          <ShortcutKeys shortcut={cycleTheme} mac={mac} />
          <span className="ml-1.5">to cycle</span>
        </span>
      }
    >
      <div role="group" aria-label="Theme" className="grid grid-cols-3 gap-2">
        {THEMES.map(({ value, label, description, icon: Icon }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={cx(
                "flex min-h-24 flex-col items-start rounded-xl p-3 text-left transition-colors duration-100",
                active
                  ? "bg-invert text-invert-ink"
                  : "bg-panel text-muted hover:bg-hover hover:text-ink",
              )}
            >
              <Icon size={17} strokeWidth={1.7} />
              <span className="mt-auto text-[12.5px] font-semibold">{label}</span>
              <span
                className={cx(
                  "mt-0.5 text-[10.5px]",
                  active ? "text-invert-ink/65" : "text-faint",
                )}
              >
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </SettingsGroup>
  );
}

export function ShortcutSettings() {
  const mac = isMac();
  const bindings = useShortcuts((state) => state.bindings);
  const setBinding = useShortcuts((state) => state.setBinding);
  const resetBinding = useShortcuts((state) => state.resetBinding);
  const resetAll = useShortcuts((state) => state.resetAll);
  const [editing, setEditing] = useState<ShortcutAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCapture = (action: ShortcutAction, event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.key === "Escape") {
      setEditing(null);
      setError(null);
      return;
    }
    const shortcut = shortcutFromEvent(event);
    if (!shortcut) {
      setError("Use Command, Control, or Option with a key.");
      return;
    }
    const fixedConflict = fixedShortcutConflict(shortcut, mac);
    if (fixedConflict) {
      setError(`Already used by ${fixedConflict}.`);
      return;
    }
    const conflict = findShortcutConflict(bindings, shortcut, action);
    if (conflict) {
      setError(`Already used by ${conflict.label}.`);
      return;
    }
    setBinding(action, shortcut);
    setEditing(null);
    setError(null);
  };

  useEffect(() => {
    if (!editing) return;
    const onKeyDown = (event: KeyboardEvent) => onCapture(editing, event);
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [bindings, editing, mac]);

  return (
    <SettingsGroup
      title="Keyboard shortcuts"
      description="Click a shortcut, then press the new key combination."
      aside={
        <Button variant="ghost" size="sm" onClick={resetAll}>
          <RotateCcw size={13} strokeWidth={1.8} />
          Reset all
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl bg-panel">
        {SHORTCUT_DEFINITIONS.map((shortcut, index) => (
          <div
            key={shortcut.id}
            className={cx(
              "flex min-h-10 items-center justify-between gap-4 px-3.5 py-2 text-[12.5px] text-muted",
              index > 0 && "border-t border-line-soft",
            )}
          >
            <span>{shortcut.label}</span>
            <div className="flex shrink-0 items-center gap-1.5">
              <ShortcutCapture
                label={shortcut.label}
                shortcut={bindings[shortcut.id]}
                mac={mac}
                editing={editing === shortcut.id}
                onStart={() => {
                  setEditing(shortcut.id);
                  setError(null);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Reset ${shortcut.label}`}
                onClick={() => resetBinding(shortcut.id)}
              >
                <RotateCcw size={12.5} strokeWidth={1.8} />
              </Button>
            </div>
          </div>
        ))}
        <ReadonlyShortcutRow
          label="Quick capture"
          keys={mac ? ["⌃", "⇧", "Space"] : ["Ctrl", "Shift", "Space"]}
        />
        <ReadonlyShortcutRow
          label="Open note tab"
          keys={mac ? ["⌘", "1-9"] : ["Ctrl", "1-9"]}
        />
      </div>
      {error && (
        <p aria-live="polite" className="mt-2 text-[11.5px] text-danger">
          {error}
        </p>
      )}
    </SettingsGroup>
  );
}

function fixedShortcutConflict(shortcut: ShortcutBinding, mac: boolean) {
  const mod = mac ? { meta: true } : { ctrl: true };
  if (
    !shortcut.alt &&
    !shortcut.shift &&
    sameShortcut(shortcut, { ...mod, key: shortcut.key }) &&
    /^[1-9]$/.test(shortcut.key)
  ) {
    return "Open note tab";
  }
  if (
    sameShortcut(shortcut, {
      ctrl: true,
      shift: true,
      key: "Space",
    })
  ) {
    return "Quick capture";
  }
  return null;
}

function SettingsGroup({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex min-h-10 items-start justify-between gap-4">
        <div>
          <h4 className="text-[12.5px] font-semibold text-ink">{title}</h4>
          <p className="mt-1 text-[11.5px] leading-4 text-faint">{description}</p>
        </div>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid h-5 min-w-5 place-items-center rounded border border-line bg-bg px-1 font-mono text-[10.5px] text-muted">
      {children}
    </kbd>
  );
}

function ShortcutKeys({
  shortcut,
  mac,
}: {
  shortcut: ShortcutBinding;
  mac: boolean;
}) {
  return (
    <>
      {formatShortcutParts(shortcut, mac).map((key, index) => (
        <Kbd key={`${key}-${index}`}>{key}</Kbd>
      ))}
    </>
  );
}

function ShortcutCapture({
  label,
  shortcut,
  mac,
  editing,
  onStart,
}: {
  label: string;
  shortcut: ShortcutBinding;
  mac: boolean;
  editing: boolean;
  onStart: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Change ${label} shortcut`}
      onClick={onStart}
      className={cx(
        "inline-flex h-7 min-w-[104px] items-center justify-center gap-1 rounded-md border px-2 font-mono text-[10.5px] transition-colors duration-100",
        editing
          ? "border-ink bg-bg text-ink"
          : "border-line bg-bg text-muted hover:border-line hover:bg-hover hover:text-ink",
      )}
    >
      {editing ? "Press keys" : <ShortcutKeys shortcut={shortcut} mac={mac} />}
    </button>
  );
}

function ReadonlyShortcutRow({
  label,
  keys,
}: {
  label: string;
  keys: string[];
}) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4 border-t border-line-soft px-3.5 py-2 text-[12.5px] text-muted">
      <span>{label}</span>
      <span className="flex shrink-0 items-center gap-1 opacity-70">
        {keys.map((key, index) => (
          <Kbd key={`${label}-${key}-${index}`}>{key}</Kbd>
        ))}
      </span>
    </div>
  );
}
