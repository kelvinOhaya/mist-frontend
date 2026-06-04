import ProfilePicture from "./ProfilePicture";
import useAuth from "@contexts/auth/useAuth";

type SizeProps = { size?: number };
function UserProfile({ size = 24 }: SizeProps) {
  const { user } = useAuth();
  return (
    <ProfilePicture
      src={user?.profilePicture?.url}
      alt={"your profile picture"}
      size={size}
    />
  );
}

export default UserProfile;
