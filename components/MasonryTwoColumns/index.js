import React, { useEffect, useRef, useState } from "react";

// Lightweight masonry: estimate item heights from aspect ratios and distribute
const isVideoFile = (url) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url || "");
const isYouTube = (url) => /(?:youtube.com|youtu.be)/i.test(url || "");
const isFacebook = (url) => /facebook.com/i.test(url || "");
const isInstagram = (url) => /instagram.com|instagr\.am/i.test(url || "");

const getMediaType = (url) => {
  if (!url) return "none";
  if (isVideoFile(url)) return "video-file";
  if (isYouTube(url)) return "youtube";
  if (isFacebook(url)) {
    if (/\/videos\//i.test(url) || /facebook.com\/.+videos\//i.test(url)) return "facebook-video";
    return "facebook-post";
  }
  if (isInstagram(url)) return "instagram";
  return "image";
};

const paddingMap = {
  "video-file": 56.25,
  youtube: 56.25,
  "facebook-video": 56.25,
  instagram: 100,
  image: 66.6667,
  "facebook-post": 100,
  none: 56.25,
};

export default function MasonryTwoColumns({ items = [], renderItem }) {
  const containerRef = useRef(null);
  const [cols, setCols] = useState([[], []]);

  useEffect(() => {
    function distribute() {
      const containerWidth = containerRef.current ? containerRef.current.clientWidth : 800;
      const gutter = 0; // no horizontal gap
      const colWidth = (containerWidth - gutter) / 2;

      // estimate heights and distribute
      const colHeights = [0, 0];
      const columns = [[], []];

      items.forEach((item) => {
        const mediaType = getMediaType(item.imageSrc || item.img || item.image || "");
        const padding = paddingMap[mediaType] || 56.25;
        const mediaHeight = (colWidth * padding) / 100;
        const titleHeight = 56; // estimate title+desc block
        const total = mediaHeight + titleHeight;

        const target = colHeights[0] <= colHeights[1] ? 0 : 1;
        columns[target].push(item);
        colHeights[target] += total;
      });

      setCols(columns);
    }

    distribute();
    window.addEventListener("resize", distribute);
    return () => window.removeEventListener("resize", distribute);
  }, [items]);

  return (
    <div ref={containerRef} className="w-full" style={{ display: "flex", gap: "16px", boxSizing: "border-box" }}>
      <div style={{ width: "calc(50% - 8px)", boxSizing: "border-box" }}>
        {cols[0].map((it) => (
          <div key={it.id} style={{ marginBottom: "16px" }}>{renderItem(it)}</div>
        ))}
      </div>
      <div style={{ width: "calc(50% - 8px)", boxSizing: "border-box" }}>
        {cols[1].map((it) => (
          <div key={it.id} style={{ marginBottom: "16px" }}>{renderItem(it)}</div>
        ))}
      </div>
    </div>
  );
}
