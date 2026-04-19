import { AppRoot, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <AppRoot disableSettingVKUIClassesInRuntime>
      <SplitLayout>
        <SplitCol>
          <Outlet />
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
}
