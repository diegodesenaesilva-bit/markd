import { Link2, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { SPRING_PANEL } from "@/lib/ease";
import { cx } from "@/lib/utils";
import { AskMarkSidebarContent } from "./AskMarkSidebarContent";
import { LinkedMentions } from "./LinkedMentions";

const WIDTH = 380;

export type RightSidebarTab = "ask_mark" | "linked_mentions";

interface UnifiedRightSidebarProps {
  rel: string | null;
  open: boolean;
  activeTab: RightSidebarTab;
  onTabChange: (tab: RightSidebarTab) => void;
  onClose: () => void;
  selectedText?: string;
  noteTitle?: string;
  noteContent?: string;
  onInsertResult?: (text: string, replaceSelection: boolean) => void;
}

export function UnifiedRightSidebar({
  rel,
  open,
  activeTab,
  onTabChange,
  onClose,
  selectedText = "",
  noteTitle = "Nota Sem Título",
  noteContent = "",
  onInsertResult,
}: UnifiedRightSidebarProps) {
  const visible = Boolean(open);

  return (
    <motion.div
      animate={{ width: visible ? WIDTH : 0 }}
      initial={false}
      transition={SPRING_PANEL}
      className="h-full shrink-0 overflow-hidden border-l border-line-soft bg-panel z-20"
    >
      <div style={{ width: WIDTH }} className="flex h-full flex-col">
        {/* Unified Top Header with Integrated Tabs */}
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-3 bg-panel/70">
          <div className="flex items-center gap-1 rounded-xl bg-hover/60 p-1">
            <button
              type="button"
              onClick={() => onTabChange("ask_mark")}
              className={cx(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150",
                activeTab === "ask_mark"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-muted hover:text-ink hover:bg-hover/80"
              )}
            >
              <Sparkles size={14} className={activeTab === "ask_mark" ? "text-white" : "text-purple-500"} />
              <span>Peça ao Mark</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("linked_mentions")}
              className={cx(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150",
                activeTab === "linked_mentions"
                  ? "bg-active text-ink shadow-xs"
                  : "text-muted hover:text-ink hover:bg-hover/80"
              )}
            >
              <Link2 size={14} className="text-indigo-500" />
              <span>Linked Mentions</span>
            </button>
          </div>

          <Tooltip label="Fechar painel" side="left">
            <button
              type="button"
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-lg text-faint transition-colors hover:bg-hover hover:text-ink"
            >
              <X size={16} />
            </button>
          </Tooltip>
        </div>

        {/* Tab Content Body */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === "ask_mark" ? (
            <AskMarkSidebarContent
              selectedText={selectedText}
              noteTitle={noteTitle}
              noteContent={noteContent}
              onInsertResult={onInsertResult}
            />
          ) : (
            <LinkedMentions rel={rel ?? ""} active={visible && activeTab === "linked_mentions"} onClose={onClose} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
