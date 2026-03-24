import { JSX } from "react/jsx-runtime";

interface Props {
  title: string;
  text: string;
  icon: JSX.Element;
}

function InfoBadge({ title, text, icon }: Props) {
  return (
    <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
      {icon}
      <span className="text-gray-300">
        {title}: <span className="text-white font-mono">{text}</span>
      </span>
    </div>
  );
}

export default InfoBadge;
