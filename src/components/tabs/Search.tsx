import LoadingDots from "@components/shared/LoadingDots";
import { useState } from "react";

function Search() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [loadingState, setLoadingState] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [error, setError] = useState<string>("An error has occured");
  const isDisabled = searchInput.length == 0;
  return (
    <div className="flex flex-col p-4">
      <span className="text-3xl mb-4">Search</span>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for groups or people via join code"
          className="border-2 border-(--neutral-border) w-full pl-2 py-2 text-xl text-(--neutral-primary-text) rounded-xl focus:border-(--p300) transition-colors duration-300 outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          disabled={isDisabled}
          type="button"
          className={`bg-${isDisabled ? "(--neutral-border)" : "(--p300)"} py-2 px-2 rounded-3xl transition-colors duration-300`}
          onClick={async (e) => {
            e.preventDefault();
            setLoadingState("pending");
            setTimeout(() => {
              setLoadingState("success");
            }, 1000);
          }}
        >
          Search
        </button>
      </div>
      <div className="mt-2">
        {loadingState === "success" && (
          <span className="text-(--success)">Sucessfully Joined!</span>
        )}
        {loadingState === "error" && (
          <span className="text-(--error)">{error}</span>
        )}
        {loadingState === "pending" && (
          <span className="">
            Searching <LoadingDots />
          </span>
        )}
      </div>
    </div>
  );
}

export default Search;
