import { Link } from "react-router-dom";

function BrandLogo() {
  return (
    <div className="hidden sm:block ">
      <Link
        to="/"
        className="flex items-center gap-2 px-2 py-1 text-slate-400 hover:text-white transition-colors rounded-lg"
        aria-label="Go home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-base md:text-lg font-bold tracking-wide">
          divmac
        </span>
      </Link>
    </div>
  );
}

export default BrandLogo;
