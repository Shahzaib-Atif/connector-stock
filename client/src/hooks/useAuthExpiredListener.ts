import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AUTH_EXPIRED_EVENT } from "@/utils/constants";
import { useEffect } from "react";

export function useAuthExpiredListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(logout());
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [dispatch]);
}
