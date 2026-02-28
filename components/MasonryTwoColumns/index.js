import React, { useEffect, useRef, useState } from "react";

// Helpers
const isVideoFile = (url) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url || "");
const isYouTube = (url) => /(?:youtube.com|youtu.be)/i.test(url || "");
const isFacebook = (url) => /facebook.com/i.test(url || "");
const isInstagram = (url) => /instagram.com|instagr\.am/i.test(url || "");

const getMediaType = (url) => {
  if (!url) return "none";
  if (isVideoFile(url)) return "video-file";
  if (isYouTube(url)) return "youtube";
  if (isFacebook(url)) {
    if (/\/videos\//i.test(url)) return "facebook-video";
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
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const colWidth = containerWidth / 2; // sem gap

      const colHeights = [0, 0];
      const columns = [[], []];

      items.forEach((item) => {
        const mediaType = getMediaType(
          item.imageSrc || item.img || item.image || ""
        );

        const padding = paddingMap[mediaType] || 56.25;
        const mediaHeight = (colWidth * padding) / 100;

        const titleBlockHeight = 56; // ajuste se necessário
        const totalHeight = mediaHeight + titleBlockHeight;

        const targetColumn =
          colHeights[0] <= colHeights[1] ? 0 : 1;

        columns[targetColumn].push(item);
        colHeights[targetColumn] += totalHeight;
      });

      setCols(columns);
    }

    distribute();
    window.addEventListener("resize", distribute);
    return () => window.removeEventListener("resize", distribute);
  }, [items]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        width: "100%",
        gap: 0, // remove espaço entre colunas
      }}
    >
      <div style={{ width: "50%" }}>
        {cols[0].map((item) => (
          <div key={item.id} style={{ marginBottom: 0 }}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      <div style={{ width: "50%" }}>
        {cols[1].map((item) => (
          <div key={item.id} style={{ marginBottom: 0 }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}