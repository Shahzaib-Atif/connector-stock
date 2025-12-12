import { Link } from "react-router-dom";

function BrandLogo() {
  return (
    <Link
      to="/"
      className="group transition-all duration-300 rounded-lg hover:scale-105"
      aria-label="Go home"
    >
      <svg
        viewBox="0 0 90 32"
        className="h-8 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* "divmac" text - clean and bold */}
        <text
          x="4"
          y="22"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.5"
          fill="#f1f5f9"
          className="group-hover:fill-white transition-all"
        >
          divmac
        </text>
        
        {/* Red accent underline - matching brand */}
        <rect
          x="4"
          y="26"
          width="0"
          height="2.5"
          rx="1"
          fill="#ef4444"
        >
          <animate
            attributeName="width"
            from="0"
            to="78"
            dur="0.5s"
            fill="freeze"
          />
        </rect>
      </svg>
    </Link>
  );
}

export default BrandLogo;
