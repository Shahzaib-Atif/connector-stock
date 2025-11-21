interface Props {
  liveStock: number;
}

function StockBadge({ liveStock }: Props) {
  return (
    <div>
      <div className="font-bold text-white text-xl">{liveStock}</div>
      <div className="text-[10px] text-slate-500 uppercase">Stock</div>
    </div>
  );
}
export default StockBadge;
