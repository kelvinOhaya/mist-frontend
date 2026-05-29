import { useEffect, useState } from "react";
import { TbMoonFilled, TbSunHighFilled } from "react-icons/tb";

function LightDarkToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      className="absolute right-8 top-8 text-(--p600) dark:text-(--p200) text-3xl hover:cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <TbMoonFilled /> : <TbSunHighFilled />}
    </button>
  );
}

export default LightDarkToggle;
