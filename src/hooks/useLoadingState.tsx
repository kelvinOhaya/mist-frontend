import { useState } from "react";

export type loadingOptions = "pending" | "success" | "error" | "idle";

export function useLoadingState() {
  const [loadingState, setLoadingState] = useState<loadingOptions>("idle");
  return { loadingState, setLoadingState };
}
