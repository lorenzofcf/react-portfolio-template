import React from "react";

const isVideoFile = (url) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url || "");
const isYouTube = (url) => /(?:youtube.com|youtu.be)/i.test(url || "");
const isFacebook = (url) => /facebook.com/i.test(url || "");
const isInstagram = (url) => /instagram.com|instagr\.am/i.test(url || "");

const getYouTubeEmbed = (url) => {
  if (!url) return null;
  const idMatch = url.match(
    /(?:v=|\/videos\/|embed\/|youtu\.be\/)([\w-]{6,})/i
  );
  const id = idMatch ? idMatch[1] : null;
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

const getFacebookEmbed = (url) => {
  if (!url) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url
  )}&show_text=0&width=560`;
};

const getFacebookPostEmbed = (url) => {
  if (!url) return null;
  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
    url
  )}&show_text=true&width=500`;
};

const getInstagramEmbed = (url) => {
  if (!url) return null;
  // ensure no trailing slash then append /embed
  const clean = url.replace(/\/?$/, "");
  return `${clean}/embed`;
};

const WorkCard = ({ img, name, description, onClick }) => {
  const getMediaType = () => {
    if (!img) return "none";
    if (isVideoFile(img)) return "video-file";
    if (isYouTube(img)) return "youtube";
    if (isFacebook(img)) {
      // simple heuristic: if URL contains /videos/ treat as video, if /posts/ treat as post
      if (/\/videos\//i.test(img) || /facebook.com\/.+videos\//i.test(img)) return "facebook-video";
      return "facebook-post";
    }
    if (isInstagram(img)) return "instagram";
    return "image";
  };

  const mediaType = getMediaType();

  const paddingMap = {
    "video-file": 56.25, // 16:9
    youtube: 56.25,
    "facebook-video": 56.25,
    instagram: 100, // 1:1
    image: 66.6667, // 3:2
    "facebook-post": 100, // taller for posts
    none: 56.25,
  };

  const wrapperPadding = paddingMap[mediaType] || 56.25;

  const renderMedia = () => {
    if (!img) return null;

    if (isVideoFile(img)) {
      return (
        <video
          controls
          preload="metadata"
          className="object-cover transition-all ease-out duration-300"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        >
          <source src={img} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isYouTube(img)) {
      const src = getYouTubeEmbed(img);
      if (!src) return null;
      return (
        <iframe
          src={src}
          title={name || "video"}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className=""
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      );
    }

    if (isFacebook(img)) {
      // decide between video plugin and post plugin based on URL
      const isPost = /\/posts\//i.test(img) || /facebook.com\/.+\/videos\//i.test(img) === false;
      if (isPost) {
        let src = getFacebookPostEmbed(img);
        // add an explicit height param for better rendering
        src += "&height=600";
        return (
          <iframe
            src={src}
            title={name || "facebook-post"}
            frameBorder="0"
            scrolling="no"
            allowtransparency="true"
            allow="encrypted-media"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", height: "100%" }}
          ></iframe>
        );
      }

      const src = getFacebookEmbed(img);
      return (
        <iframe
          src={src}
          title={name || "facebook-video"}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      );
    }

    if (isInstagram(img)) {
      const src = getInstagramEmbed(img);
      return (
        <iframe
          src={src}
          title={name || "instagram-post"}
          frameBorder="0"
          scrolling="no"
          allowtransparency="true"
          className=""
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      );
    }

    // default: image
    return (
      <img
        alt={name}
        className="object-cover hover:scale-110 transition-all ease-out duration-300"
        src={img}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <div
      className="overflow-hidden rounded-lg p-0 first:ml-0 link flex flex-col h-full"
      onClick={onClick}
      style={{ breakInside: "avoid", display: "flex", width: "100%", boxSizing: "border-box" }}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 mob:h-auto"
        style={{ paddingBottom: `${wrapperPadding}%`, height: 0 }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          {renderMedia()}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1 mt-0">
        <h1 className="text-3xl font-medium">
          {name ? name : "Project Name"}
        </h1>
        <h2 className="text-xl opacity-50">
          {description ? description : "Description"}
        </h2>
      </div>
    </div>
  );
};

export default WorkCard;
