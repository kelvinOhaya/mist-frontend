import useAuth from "@contexts/auth/useAuth";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import defaultProfile from "@assets/defaultProfile.jpg";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import LoadingDots from "@components/shared/LoadingDots";

interface ChangeProfileProps {
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChangeProfile({ setShowEditProfile }: ChangeProfileProps) {
  const { user } = useAuth();
  const { updateProfilePicture } = useChatRoom();
  const [loadingState, setLoadingState] = useState<
    "success" | "error" | "pending" | null
  >(null);

  const [preview, setPreview] = useState<string>(
    user?.profilePicture?.url || defaultProfile,
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute flex flex-col items-center pt-20"
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          setShowEditProfile(false);
        }}
        className="fixed top-0 left-0 w-full h-full  bg-black/50 z-1"
      ></motion.div>
      <div className="flex flex-col items-center gap-4 z-2">
        <span className="text-(--neutral-primary-text) text-xl">
          Upload a new photo
        </span>
        <div {...getRootProps()} className="relative w-80 h-80">
          <input {...getInputProps()} />
          <img
            src={preview}
            alt="A preview of the new profile"
            className="h-full w-full"
          />

          <div
            className="absolute inset-0 bg-black/70"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at center, transparent 0 67%, black 68%)",
              maskImage:
                "radial-gradient(circle at center, transparent 0 67%, black 68%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
        </div>
        <div className="flex justify-between w-full gap-2">
          <button
            className="bg-transparent px-1 py-2 text-(--neutral-secondary-text) rounded-md border-2 border-(--neutral-border) flex-1"
            onClick={async () => {
              if (file) {
                setLoadingState("pending");
                try {
                  await updateProfilePicture(file);
                  setLoadingState("success");
                  await setTimeout(() => {}, 100);
                  setShowEditProfile(false);
                } catch (error) {
                  console.log(error);
                  setLoadingState("error");
                }
              }
              return;
            }}
          >
            CONFIRM
          </button>
          <button
            onClick={() => {
              setShowEditProfile(false);
            }}
            className="bg-linear-to-b from-(--p300) to-(--p400) px-1 py-2 text-(--p100) rounded-md flex-1"
          >
            CANCEL
          </button>
        </div>
        {loadingState === "pending" && (
          <span>
            changing profile <LoadingDots />
          </span>
        )}
        {loadingState === "success" && (
          <span className="text-(--success)">Success!</span>
        )}
        {loadingState === "error" && (
          <span className="text-(--error)">An error has occured</span>
        )}
      </div>
    </motion.div>
  );
}

export default ChangeProfile;
