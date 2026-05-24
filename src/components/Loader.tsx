interface LoaderProps {
  size: number;
  color?: string;
}

function Loader({ size, color = "currentColor" }: LoaderProps) {
  return (
    <span
      aria-label="Loading"
      role="status"
      style={{ width: size, height: size, color }}
      className="inline-block shrink-0 rounded-full border-2 border-current border-r-transparent animate-spin"
    />
  );
}

export default Loader;
