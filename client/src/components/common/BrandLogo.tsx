import LogoSvg from "@/icons/LogoSvg";
import { Link } from "react-router-dom";

function BrandLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 px-2 py-1 text-slate-400 hover:text-white transition-colors rounded-lg"
      aria-label="Go home"
    >
      <LogoSvg />
      <span className="text-base md:text-xl font-bold">
        divmac
      </span>
    </Link>
  );
}

export default BrandLogo;
