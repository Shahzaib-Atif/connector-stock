interface Props {
  message: string;
}

function ErrorBanner({ message: errorMessage }: Props) {
  return (
    errorMessage && (
      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
        {errorMessage}
      </div>
    )
  );
}

export default ErrorBanner;
