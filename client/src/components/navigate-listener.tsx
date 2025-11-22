import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function NavigationListener({
  user,
  reload,
}: {
  user: any;
  reload: () => void;
}) {
  const location = useLocation();

  useEffect(() => {
    if (user) {
      reload();
    }
  }, [location.pathname]);

  return null;
}
