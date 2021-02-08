import { FC, createContext, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import AppLayoutHeader from "@/components/AppLayout/Header";
import Dialog, { ETKDialogActions } from "@/components/Dialog";
import Snackbars from "@/components/Snackbars";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import { useAppContext } from "@/providers/AppContext";

const AppLayout = createContext(null);

export const useAppLayout = () => useContext(AppLayout);

const AppLayoutBase: FC = ({ children }) => {
  const { t } = useTranslation(["common", "components"]);
  const snackbar = useRef();
  const dialog = useRef<ETKDialogActions>(null);
  const { user } = useAppContext();

  const ability = buildAbilityFor(user?.currentOrganization?.current_user_role); //Just for test

  return (
    <AbilityContext.Provider value={ability}>
      <AppLayout.Provider value={{ dialog, snackbar, t }}>
        <AppLayoutHeader />
        {children}
        <Dialog ref={dialog} />
        <Snackbars ref={snackbar} />
      </AppLayout.Provider>
    </AbilityContext.Provider>
  );
};

export default AppLayoutBase;
