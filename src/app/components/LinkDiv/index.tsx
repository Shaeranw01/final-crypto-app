import { PiLinkBold } from "react-icons/pi";
import { TbCopy } from "react-icons/tb";
const LinkDiv = ({ link }: { link: string }) => {
  return (
    <div className="w-full  dark:bg-[#1E1932]  bg-[#CCCCFA66] rounded-xl flex justify-center items-center  p-5 gap-4 box-border">
      <a href={link}>
        {" "}
        <PiLinkBold className="w-3 h-3 sm:w-5 sm:h-5 dark:fill-white fill-[#353570]" />
      </a>

      <p className="w-2/3 text-center break-words font-light text-sm ">
        {link}
      </p>

      <button>
        <TbCopy className="w-3 h-3 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default LinkDiv;
