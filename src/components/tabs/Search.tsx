import LoadingDots from "@components/shared/LoadingDots";
import { ReactNode, useState } from "react";
import useChatRoom from "@contexts/chatRoom/useChatRoom";
import { AnimatePresence, motion } from "framer-motion";
import { MdArrowBackIosNew } from "react-icons/md";

interface SearchProps {
  onSearch: () => Promise<void>;
}

function Search({ onSearch }: SearchProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [loadingState, setLoadingState] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [error, setError] = useState<string>("An error has occured");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"Users" | "Group Chats">(
    "Group Chats",
  );
  const isDisabled = searchInput.length == 0 || searchMode === "Users";
  const { verifyJoinCode, joinRoom, findUser } = useChatRoom();

  const handleSearch = async () => {
    if (!searchInput) throw new Error("Please type in a join code first");
    setLoadingState("pending");
    try {
      const valid = await verifyJoinCode(searchInput.trim());
      if (valid) {
        searchMode === "Group Chats"
          ? await joinRoom(searchInput.trim())
          : await findUser(searchInput.trim());
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
      <div className="mb-4 flex">
        <label htmlFor="searchMode" className="mr-2">
          Searching for
        </label>
        <ul className=" rounded-sm [&>li]:bg-neutral-900 [&>li]:px-2 [&>li]:w-97/100 [&>li]:transition-colors [&>li]:duration-200 items-center flex flex-col  w-fit  shadow-2xl">
          <div
            className="bg-neutral-800 rounded-lg w-full px-2 flex justify-between"
            onClick={() => setDropdownIsOpen((prev) => !prev)}
          >
            <span> {searchMode}</span>
            <motion.span
              className="inline-block rotate-90"
              animate={{ rotate: dropdownIsOpen ? 180 : 0 }}
            >
              <MdArrowBackIosNew />
            </motion.span>
          </div>
          <motion.div
            animate={{
              maxHeight: dropdownIsOpen ? 70 : 0,
              scale: dropdownIsOpen ? 1 : 0.7,
            }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden m-0 w-full bg-neutral-900 rounded-b-2xl origin-center"
          >
            <OptionDropdown
              dropdownIsOpen={dropdownIsOpen}
              onClick={() => setSearchMode("Users")}
            >
              Users
            </OptionDropdown>
            <OptionDropdown
              roundedBottom
              dropdownIsOpen={dropdownIsOpen}
              onClick={() => setSearchMode("Group Chats")}
            >
              Group Chats
            </OptionDropdown>
          </motion.div>
        </ul>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={
            searchMode === "Group Chats"
              ? "Join a group by entering the join code"
              : "Enter the user's personal join code"
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
        <AnimatePresence>
          {isDisabled && searchMode === "Users" && (
            <motion.span
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-yellow-400"
            >
              User DMs are coming soon! For now, invite your friend to a group
              chat.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type OptionDropdownProps = {
  onClick: () => void;
  children: ReactNode;
  dropdownIsOpen: boolean;
  roundedBottom?: boolean;
};

function OptionDropdown({
  onClick,
  children,
  dropdownIsOpen,
  roundedBottom = false,
}: OptionDropdownProps) {
  return (
    <motion.li
      animate={{ opacity: dropdownIsOpen ? [0, 0, 1] : [1, 0] }}
      transition={{ duration: 0.2 }}
      className={`bg-neutral-900 hover:bg-(--neutral-border) hover:cursor-pointer ${roundedBottom && "rounded-b-xl"} px-2 py-1`}
      onClick={onClick}
    >
      {children}
    </motion.li>
  );
}
export default Search;
