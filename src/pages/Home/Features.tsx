import { ReactNode } from "react";
import { FaGlobe, FaLock } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

interface IconWithDescriptionProps {
  icon: ReactNode;
  description: string;
}

const iconSize: string = "1.2rem";
function IconWithDescription({ icon, description }: IconWithDescriptionProps) {
  return (
    <div className="text-(--p100) flex flex-col text-center items-center">
      {icon}
      <p>{description}</p>
    </div>
  );
}
function Features() {
  return (
    <div className="flex w-full flex-row justify-between">
      <IconWithDescription
        icon={<FaMessage size={iconSize} />}
        description="Real Time"
      />
      <IconWithDescription
        icon={<FaGlobe size={iconSize} />}
        description="Works Anywhere"
      />
      <IconWithDescription
        icon={<FaLock size={iconSize} />}
        description="JWT Protected"
      />
    </div>
  );
}

export default Features;
