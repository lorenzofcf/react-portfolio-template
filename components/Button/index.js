import React from "react";
import data from "../../data/portfolio.json";

const Button = ({ children, type, onClick, classes }) => {
  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg bg-black dark:bg-white text-white dark:text-black transition-all duration-300 ease-out first:ml-0 hover:scale-105 active:scale-100 link ${
          data.showCursor && "cursor-none"
        }  ${classes}`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg flex items-center transition-all ease-out duration-300 hover:bg-slate-100 dark:hover:bg-slate-600 dark:text-white transition-all duration-300 ease-out hover:scale-105 active:scale-100 tablet:first:ml-0 ${
        data.showCursor && "cursor-none"
      } ${classes} link`}
    >
      {children}
    </button>
  );
};

export default Button;
