interface Props {
  printStatus: {
    type: "error" | "success";
    message: string;
  };
}

function PrintStatus({ printStatus }: Props) {
  return (
    <div
      className={`mb-4 p-3 rounded-lg text-sm font-medium ${
        printStatus.type === "success"
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-red-500/20 text-red-400 border border-red-500/30"
      }`}
    >
      {printStatus.message}
    </div>
  );
}

export default PrintStatus;
