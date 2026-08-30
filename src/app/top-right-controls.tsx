import AccountButton from "./account-button";
import type { CurrentUser } from "./lib/auth";
import NotificationBell from "./notification-bell";

export default function TopRightControls({ user }: { user: CurrentUser }) {
  return (
    <div className="fixed top-6 right-6 z-20 flex items-center gap-3">
      <NotificationBell />
      <AccountButton avatarUrl={user?.avatarUrl} name={user?.name} />
    </div>
  );
}
