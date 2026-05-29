//personal join code
//username
//ChangeProfilePicture
//changeUsername

import ProfilePicture from "@components/shared/ProfilePicture";
import useAuth from "@contexts/auth/useAuth";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ChangeProfile from "./ChangeProfile";
import { Modal } from "@components/shared/modals/modal";
import LogoutModal from "@components/shared/modals/LogoutModal";

function Account() {
  const { user } = useAuth();
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
      <div className="w-full mt-auto flex md:justify-end">
        <button
          type="button"
          className="bg-(--error) p-2 rounded-lg w-full md:w-auto hover:cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          LOGOUT
        </button>
      </div>
      <AnimatePresence>
        {showEditProfile && (
          <ChangeProfile setShowEditProfile={setShowEditProfile} />
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

  return (
    <button
      type="button"
      className="relative hover:cursor-pointer"
      onClick={() => setShowEditProfile(true)}
    >
      <div className="flex rounded-full ">
        <span className="brightness-50">
          <ProfilePicture
            src={user.profilePicture?.url}
            alt="Your profile picture"
            size={108}
          />
        </span>
        <FaCamera
          size={40}
          className="absolute text-(--neutral-primary-text) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </button>
  );
}

interface LabelProps {
  label: string;
  content: string;
}

function InfoTab({ label, content }: LabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-(--neutral-secondary-text)">{label}</span>
      <div className="px-2 py-2 border-3 border-(--neutral-accent) bg-[#070707] rounded-xl w-full">
        <span className="text-md">{content}</span>
      </div>
    </div>
  );
}

export default Account;
