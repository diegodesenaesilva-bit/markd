import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const updateState = async () => {
      try {
        const appWindow = getCurrentWindow();
        setIsMaximized(await appWindow.isMaximized());
        unlisten = await appWindow.onResized(async () => {
          setIsMaximized(await appWindow.isMaximized());
        });
      } catch {
        // Non-tauri browser fallback
      }
    };
    void updateState();
    return () => { unlisten?.(); };
  }, []);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    void getCurrentWindow().minimize().catch(() => {});
  };

  const handleMaximizeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const appWindow = getCurrentWindow();
    void appWindow.toggleMaximize().then(() =>
      appWindow.isMaximized().then(setIsMaximized)
    ).catch(() => {});
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    void getCurrentWindow().close().catch(() => {});
  };

  return (
    // style={{ WebkitAppRegion: "no-drag" }} tells Tauri to NOT treat these as drag zone
    <div
      className="flex items-center shrink-0 self-stretch"
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
    >
      {/* Minimize */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleMinimize}
        title="Minimizar"
        className="grid h-full w-10 place-items-center text-faint transition-colors duration-100 hover:bg-hover hover:text-ink"
      >
        <Minus size={13} strokeWidth={1.75} />
      </button>

      {/* Maximize / Restore */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleMaximizeToggle}
        title={isMaximized ? "Restaurar" : "Maximizar"}
        className="grid h-full w-10 place-items-center text-faint transition-colors duration-100 hover:bg-hover hover:text-ink"
      >
        {isMaximized ? (
          // Restore icon — two overlapping squares
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="1" width="8" height="8" rx="1" />
            <path d="M1 3v7a1 1 0 0 0 1 1h7" />
          </svg>
        ) : (
          <Square size={12} strokeWidth={1.5} />
        )}
      </button>

      {/* Close */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleClose}
        title="Fechar"
        className="grid h-full w-10 place-items-center text-faint transition-colors duration-100 hover:bg-red-500 hover:text-white"
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
