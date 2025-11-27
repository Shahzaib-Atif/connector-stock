import LogoSvg from "@/icons/LogoSvg";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LogOut } from "lucide-react";

function HeaderBar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <a
        href="/"
        className="absolute top-3 left-3 md:left-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
      >
        <LogoSvg />
        <span className="text-base md:text-xl font-bold">divmac</span>
      </a>

      <button
        onClick={() => dispatch(logout())}
        className="absolute top-3 right-3 md:right-6 p-2 text-slate-400 hover:text-white flex items-center gap-2"
      >
        <span className="text-sm font-mono">{user}</span>
        <LogOut className="w-5 h-5" />
      </button>
    </>
  );
}

export default HeaderBar;
