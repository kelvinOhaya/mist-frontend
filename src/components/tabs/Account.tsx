//personal join code
//username
//ChangeProfilePicture
//changeUsername

import ProfilePicture from "@components/profile/ProfilePicture";
import useAuth from "@contexts/auth/useAuth";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
// ChangeProfile component unused here
import LogoutModal from "@components/shared/modals/LogoutModal";
import ProfileEditor from "@components/shared/ProfileEditor";
import InfoTab from "@components/shared/InfoTab";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import UserProfile from "@components/profile/UserProfile";

function Account() {
  const { user } = useAuth();
  const { updateProfilePicture } = useChatRoom();
  if (!user) return;
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  return (
    <div className="flex h-full flex-col items-center p-4">
      <div className="mb-2 flex w-full items-center justify-start">
        <span className="text-3xl text-(--neutral-primary-text)">Account</span>
      </div>
      <EditProfileBtn setShowEditProfile={setShowEditProfile} />
      <span className="text-(--neutral-secondary-text) text-center">
        Edit profile picture
      </span>
      <span className="text-center text-(--neutral-primary-text) mt-8 mb-2">
        Info
      </span>
      <div className="flex flex-col gap-2 w-full">
        <InfoTab label={"username"} content={user.username} />
        <InfoTab label={"join code"} content={user.joinCode} />
      </div>
      <div className="w-full mt-auto flex sm:justify-end">
        <button
          type="button"
          className="bg-(--p300) p-2 rounded-lg w-full sm:w-fit hover:cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          LOGOUT
        </button>
      </div>
      <AnimatePresence>
        {showEditProfile && (
          <ProfileEditor
            title={"Upload a new photo"}
            trigger={() => setShowEditProfile(false)}
            onUpload={async (file) => updateProfilePicture(file)}
          />
        )}
        {showLogoutModal && (
          <LogoutModal trigger={() => setShowLogoutModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditProfileBtn({
  setShowEditProfile,
}: {
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <button
      type="button"
      className="relative hover:cursor-pointer"
      onClick={() => setShowEditProfile(true)}
    >
      <div className="flex rounded-full ">
        <span className="brightness-50">
          <UserProfile size={108} />
        </span>
        <FaCamera
          size={40}
          className="absolute text-(--neutral-primary-text) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </button>
  );
}

export default Account;
