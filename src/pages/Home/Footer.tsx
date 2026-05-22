import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className=" w-full absolute bottom-4 right-8 text-(--p100) flex flex-row justify-end align-middle">
      <span className="flex flex-row gap-4">
        <a target="_blank" href="https://www.linkedin.com/in/kelvin-ohaya/">
          <FaLinkedin size={32} />
        </a>
        <a target="_blank" href="https://github.com/kelvinOhaya">
          <FaGithub size={32} />
        </a>
      </span>
    </div>
  );
}

export default Footer;
