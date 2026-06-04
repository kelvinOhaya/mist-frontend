import LoadingDots from "@components/shared/LoadingDots";
import { useState } from "react";
import useChatRoom from "@contexts/chatRoom/useChatRoom";

interface SearchProps {
  onSearch: () => Promise<void>;
}

function Search({ onSearch }: SearchProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [loadingState, setLoadingState] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [error, setError] = useState<string>("An error has occured");
  const [searchMode, setSearchMode] = useState<"user" | "group">("group");
  const isDisabled = searchInput.length == 0;
  const { verifyJoinCode, joinRoom } = useChatRoom();

  const handleSearch = async () => {
    if (!searchInput) throw new Error("Please type in a join code first");
    setLoadingState("pending");
    try {
      const valid = await verifyJoinCode(searchInput.trim());
      if (valid) {
        await joinRoom(searchInput.trim());
        setLoadingState("success");
      } else {
        setError("Invalid join code");
        setLoadingState("error");
      }
    } catch (err) {
      setError("An error occurred");
      setLoadingState("error");
    }
  };

  return (
    <div className="flex flex-col p-4">
      <span className="text-3xl mb-4">Search</span>
      <div className="mb-4">
        <label htmlFor="searchMode" className="mr-2">
          Searching for
        </label>
        <select
          name="searchMode"
          id="searchMode"
          className="bg-(--neutral-border) rounded-sm "
        >
          <option value="group">Group Chats</option>
          <option value="user" className="rounded-b-2xl">
            Users
          </option>
        </select>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={
            searchMode === "group"
              ? "Join a group by entering the join code"
              : "Make a DM with the user's personal join code"
          }
          className="border-2 border-(--neutral-border) w-full pl-2 py-2 text-xl text-(--neutral-primary-text) rounded-xl focus:border-(--p300) transition-colors duration-300 outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          disabled={isDisabled}
          type="button"
          className={`bg-${isDisabled ? "(--neutral-border)" : "(--p300)"} py-2 px-2 rounded-xl transition-colors duration-300`}
          onClick={async (e) => {
            e.preventDefault();
            await handleSearch();
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
