
function LoadingComponent() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-300/30 backdrop-blur-sm z-50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}

export default LoadingComponent