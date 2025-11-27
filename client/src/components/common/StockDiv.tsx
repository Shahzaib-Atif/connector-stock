interface Props {
  currentStock: number;
}

function StockDiv({ currentStock }: Props) {
  return (
    <div id="stock-div" className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {currentStock}
        </h2>
        <p className="text-slate-400 font-medium sm:mt-1 text-base sm:text-lg">
          Units Available
        </p>
      </div>
    </div>
  );
}

export default StockDiv;
