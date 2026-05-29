interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  return (
    <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-full border border-(--neutral-border) bg-(--neutral-bg) px-3 py-1 text-sm text-(--neutral-primary-text) opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      {text}
    </div>
  );
}

export default Tooltip;
