import { FC, useState } from "react";
import styles from "@/components/Menu/Icon.module.css";

export interface MenuIconProps {
  onChange?(active: boolean): void;
}

const MenuIcon: FC<MenuIconProps> = ({ onChange }) => {
  const [active, setActive] = useState<boolean>(false);

  const handleOnClick = (): void => {
    const isActive = !active;

    setActive(isActive);
    onChange(isActive);
  };

  return (
    <div className={active ? styles["nav-active"] : ""}>
      <a href="#" className={styles["menu-icon"]} onClick={handleOnClick}>
        <span />
      </a>
    </div>
  );
};

export default MenuIcon;
