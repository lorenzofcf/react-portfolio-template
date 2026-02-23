import React, { useEffect } from "react";

const Cursor = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const style = document.documentElement.style;
      const isDark = document.documentElement.classList.contains("dark");
      const cursorColor = isDark ? "#fff" : "#000";
      style.setProperty('--cursor-x', e.clientX + 'px');
      style.setProperty('--cursor-y', e.clientY + 'px');
      style.setProperty('--cursor-color', cursorColor);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <style>{`
      a.link, [class*="link"], button {
        cursor: pointer;
      }
    `}</style>
  );
};

export default Cursor;
