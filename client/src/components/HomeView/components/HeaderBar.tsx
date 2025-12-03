import LogoSvg from "@/icons/LogoSvg";
import { logout } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LogOut, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeaderBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

      <div className="absolute top-3 right-3 md:right-6 flex items-center gap-2">
        <button
          onClick={() => navigate("/transactions")}
          className="p-2 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          title="View Transactions"
        >
          <Receipt className="w-5 h-5" />
        </button>

        <button
          onClick={() => dispatch(logout())}
          className="p-2 text-slate-400 hover:text-white flex items-center gap-2"
        >
          <span className="text-sm font-mono">{user}</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

export default HeaderBar;
