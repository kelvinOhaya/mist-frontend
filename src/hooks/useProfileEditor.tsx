import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { loadingOptions, useLoadingState } from "@hooks/useLoadingState";
import defaultProfile from "@assets/defaultProfile.jpg";

type UploadFn = (file: File, signal?: AbortSignal) => Promise<string>;

interface UseProfileEditorReturn {
  preview: string;
  file: File | null;
  isDirty: boolean;
  loadingState: loadingOptions;
  setLoadingState: React.Dispatch<React.SetStateAction<loadingOptions>>;
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  clear: (resetToInitial?: boolean) => void;
  setFile: (f: File | null) => void;
  setPreview: (s: string) => void;
  errorMsg: string | null;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: () => Promise<string | undefined>;
}

export default function useProfileEditor(
  initialUrl?: string,
  uploadFn?: UploadFn,
): UseProfileEditorReturn {
  const { loadingState, setLoadingState } = useLoadingState();
  const [preview, setPreview] = useState<string>(initialUrl || defaultProfile);
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Track only object URLs we created so we revoke only those.
  const createdObjectUrlRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // revoke any created object URL
      if (createdObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(createdObjectUrlRef.current);
        } catch {}
        createdObjectUrlRef.current = null;
      }
      // abort ongoing upload
      if (abortRef.current) abortRef.current.abort();
      // clear timeouts
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  // When a new file is selected, create an object url for preview and remember it.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // revoke previous created url if any
    if (createdObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(createdObjectUrlRef.current);
      } catch {}
    }
    createdObjectUrlRef.current = url;
    setPreview(url);
    // cleanup for this object url happens on unmount or when another file is set
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles && acceptedFiles[0];
    if (f) setFile(f);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
    maxFiles: 1,
  });

  const isDirty = Boolean(file);

  const clear = useCallback(
    (resetToInitial = true) => {
      if (createdObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(createdObjectUrlRef.current);
        } catch {}
        createdObjectUrlRef.current = null;
      }
      setFile(null);
      setPreview(resetToInitial ? initialUrl || "" : "");
      setErrorMsg(null);
      setLoadingState("idle");
    },
    [initialUrl, setLoadingState],
  );

  const handleSubmit = useCallback(async () => {
    if (!file) return;
    setLoadingState("pending");
    abortRef.current = new AbortController();
    try {
      let uploadedUrl = initialUrl || "";
      if (uploadFn) {
        uploadedUrl = await uploadFn(file, abortRef.current.signal);
      } else {
        // fallback simulated upload for review/demo purposes
        await new Promise<void>((res) => {
          const t = window.setTimeout(() => res(), 800);
          timeoutsRef.current.push(t);
        });
        uploadedUrl = createdObjectUrlRef.current || initialUrl || "";
      }
      if (!isMountedRef.current) return uploadedUrl;
      setLoadingState("success");
      return uploadedUrl;
    } catch (err) {
      if (!isMountedRef.current) return;
      if ((err as any)?.name === "AbortError") {
        setLoadingState("idle");
      } else {
        setLoadingState("error");
      }
      throw err;
    }
  }, [file, initialUrl, setLoadingState, uploadFn]);

  return {
    preview,
    file,
    isDirty,
    loadingState,
    setLoadingState,
    getRootProps,
    getInputProps,
    handleSubmit,
    errorMsg,
    setErrorMsg,
    clear,
    setFile,
    setPreview,
  };
}
