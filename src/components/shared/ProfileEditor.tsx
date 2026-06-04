import useAuth from "@contexts/auth/useAuth";
import { motion } from "framer-motion";
import defaultProfile from "@assets/defaultProfile.jpg";
import LoadingDots from "@components/shared/LoadingDots";
import ErrorShakeWrapper from "@components/shared/ErrorShakeWrapper";
import useProfileEditor from "@hooks/useProfileEditor";
import { useCallback } from "react";

interface ProfileEditorProps {
  trigger: () => void;
  onUpload: (file: File) => Promise<any>;
  title: string;
}

function ProfileEditor({ trigger, onUpload, title }: ProfileEditorProps) {
  const { user } = useAuth();

  const {
    preview,
    file,
    loadingState,
    setLoadingState,
    getRootProps,
    getInputProps,
    clear,
    errorMsg,
    setErrorMsg,
  } = useProfileEditor(user?.profilePicture?.url || defaultProfile);

  const onConfirm = useCallback(async () => {
    if (!file) {
      setLoadingState("error");
      setErrorMsg("Please enter a file");
      return;
    }
    try {
      setErrorMsg(null);
      setLoadingState("pending");
      await onUpload(file);
      // Wipe selected file preview after successful upload so stale preview doesn't persist.
      clear(false);
      trigger();
    } catch (err) {
      setLoadingState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }, [file, onUpload, clear, trigger, setErrorMsg, setLoadingState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-full flex flex-col items-center pt-20 z-10"
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          trigger();
        }}
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-10"
      />
      <div className="flex flex-col items-center gap-4 z-20">
        <span className="text-(--neutral-primary-text) text-xl">{title}</span>
        <div {...getRootProps()} className="relative w-80 h-80">
          <input {...getInputProps()} />
          <img
            src={preview}
            alt="Profile preview"
            className="h-full w-full object-cover"
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
            className="bg-(--neutral-bg) px-1 py-2 text-(--neutral-secondary-text) rounded-md border-2 border-(--neutral-border) flex-1 hover:cursor-pointer"
            onClick={onConfirm}
            disabled={loadingState === "pending"}
            aria-disabled={loadingState === "pending"}
          >
            {loadingState === "pending" ? (
              <>
                changing profile <LoadingDots />
              </>
            ) : (
              "CONFIRM"
            )}
          </button>
          <button
            onClick={() => {
              clear();
              trigger();
            }}
            className="bg-(--p300) px-1 py-2 text-(--p100) rounded-md flex-1 hover:cursor-pointer"
          >
            CANCEL
          </button>
        </div>
        {loadingState === "success" && (
          <span className="text-(--success)">Success!</span>
        )}
        <ErrorShakeWrapper
          show={loadingState === "error"}
          className="flex gap-2 text-(--error)"
        >
          <span>{errorMsg}</span>
        </ErrorShakeWrapper>
      </div>
    </motion.div>
  );
}

export default ProfileEditor;
