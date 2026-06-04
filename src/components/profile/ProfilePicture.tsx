import defaultProfile from "@assets/defaultProfile.jpg";

interface ProfilePictureProps {
  size: number;
  src: string | null | undefined;
  alt: string;
}

export default function ProfilePicture({
  size,
  src,
  alt,
}: ProfilePictureProps) {
  return (
    <img
      src={src || defaultProfile}
      alt={alt || "a profile picture"}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
