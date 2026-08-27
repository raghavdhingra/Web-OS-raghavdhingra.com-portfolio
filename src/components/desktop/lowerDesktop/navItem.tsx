import type { ReactNode } from "react";

interface NavItemProps {
  children: ReactNode;
  clickTask?: () => void;
  hightlight?: boolean;
}

const NavItem = ({ children, clickTask, hightlight }: NavItemProps) => {
  return (
    <>
      <div
        className={`left-nav-item centralise ${
          hightlight ? "left-nav-item-active" : ""
        }`}
        onClick={clickTask}
      >
        {children}
      </div>
    </>
  );
};
export default NavItem;
