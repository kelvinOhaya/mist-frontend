interface LabelProps {
  label: string;
  content: string;
}

function InfoTab({ label, content }: LabelProps) {
  return (
    <div className="flex flex-col gap-1 sm:items-center">
      <span className="text-(--neutral-secondary-text)">{label}</span>
      <div className="px-2 py-2 bg-(--neutral-border) rounded-xl sm:w-1/2">
        <span className="text-md">{content}</span>
      </div>
    </div>
  );
}
export default InfoTab;
