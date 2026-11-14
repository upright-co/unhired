/** Brandon's VSL. Accepts a YouTube, Vimeo or Loom share link, or a direct video file URL. */

function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0&modestbranding=1`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean)[0]}`;
    if (host === "player.vimeo.com") return url;
    if (host.endsWith("loom.com")) return url.replace("/share/", "/embed/");
    return null;
  } catch {
    return null;
  }
}

export function VideoFrame({
  url,
  poster,
  title,
  portrait = false,
  className = "",
  preload = "metadata",
}: {
  url: string;
  poster?: string | null;
  title: string;
  /** Vertical 9:16 cut for phones, capped so it fits on screen with the headline. */
  portrait?: boolean;
  className?: string;
  /** "none" for the cut this screen size doesn't show, so it never downloads. */
  preload?: "none" | "metadata";
}) {
  const embed = embedUrl(url);
  const shape = portrait ? "mx-auto aspect-[9/16] w-full max-w-[min(100%,calc(78svh*9/16))]" : "aspect-video";
  return (
    <div className={`${className} relative ${shape} overflow-hidden rounded-[26px] border border-white/15 bg-black shadow-[0_40px_90px_-30px_rgba(40,14,90,0.7)]`}>
      {embed ? (
        <iframe
          src={embed}
          title={title}
          className="absolute inset-0 size-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video
          src={url}
          poster={poster ?? undefined}
          controls
          playsInline
          preload={preload}
          className="absolute inset-0 size-full object-cover"
          aria-label={title}
        />
      )}
    </div>
  );
}
