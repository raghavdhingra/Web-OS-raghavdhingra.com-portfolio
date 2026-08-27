import { useEffect, useRef } from "react";

interface ContextMenuItem {
  name: string;
  onClick: () => void;
}

interface ContextMenuProps {
  isOpen: boolean;
  top: number;
  left: number;
  close: () => void;
  height: number;
  contextArray: ContextMenuItem[];
}

const ContextMenu = ({
  isOpen,
  top,
  left,
  close,
  contextArray,
}: ContextMenuProps) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      try {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target as Node)
        ) {
          close();
        }
      } catch {
        return null;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [close]);
  const contextTaskPerform = (task: ContextMenuItem) => {
    task.onClick();
    close();
  };
  if (isOpen)
    return (
      <>
        <div
          ref={contextMenuRef}
          className="context-menu-container"
          style={{ top: `${top}px`, left: `${left}px` }}
        >
          {contextArray && contextArray.length
            ? contextArray.map((context, index) => (
                <div
                  className="context-menu-content"
                  key={`context-${index}`}
                  onClick={() => contextTaskPerform(context)}
                >
                  {context.name}
                </div>
              ))
            : null}
        </div>
      </>
    );
  else return null;
};

export default ContextMenu;
