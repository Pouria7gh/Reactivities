interface props {
  text?: string;
}

function LoadingComponent(props: props) {
  return (
    <div className="fixed flex flex-col inset-0 items-center justify-center bg-base-300/30 backdrop-blur-sm z-50">
      <span className="loading loading-spinner w-12 text-primary mb-2"></span>
      <span className="text-sm">{props.text}</span>
    </div>
  );
}

export default LoadingComponent