interface Props {
  currentStock: number;
}

function StockDiv({ currentStock }: Props) {
  return (
    <div id="stock-div" className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {currentStock}
        </h2>
        <p className="text-slate-400 font-medium text-base sm:text-lg">
          Units Available
        </p>
      </div>
    </div>
  );
}

export default StockDiv;
