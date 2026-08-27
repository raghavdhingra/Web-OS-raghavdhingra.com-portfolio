import type { ReactNode } from "react";

interface StartItemProps {
  children: ReactNode;
  clickTask: () => void;
}

const StartItem = ({ children, clickTask }: StartItemProps) => {
  return (
    <>
      <div className={`start-menu-item centralise`} onClick={clickTask}>
        {children}
      </div>
    </>
  );
};
export default StartItem;
