/**
 * Video URL helpers.
 *
 * Browsers can only play DIRECT video files via <video src>.
 * YouTube / Vimeo pages must be embedded via <iframe>.
 *
 * This module detects the source type and produces the correct embed URL.
 */

export type VideoSourceType = 'youtube' | 'vimeo' | 'file' | 'unknown';

export interface ParsedVideo {
  type: VideoSourceType;
  /** The URL to feed into the correct player. */
  embedUrl: string;
  /** True if this should be rendered as an iframe embed, false as <video>. */
  isEmbed: boolean;
}

/* ------------------------------------------------------------------ */
/* YouTube                                                            */
/* ------------------------------------------------------------------ */

const YOUTUBE_PATTERNS = [
  // https://www.youtube.com/watch?v=ID
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{6,})/i,
  // https://youtu.be/ID
  /(?:youtu\.be\/)([\w-]{6,})/i,
  // https://www.youtube.com/embed/ID
  /(?:youtube\.com\/embed\/)([\w-]{6,})/i,
  // https://www.youtube.com/shorts/ID
  /(?:youtube\.com\/shorts\/)([\w-]{6,})/i,
];

function extractYoutubeId(url: string): string | null {
  for (const re of YOUTUBE_PATTERNS) {
    const match = url.match(re);
    if (match && match[1]) return match[1];
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Vimeo                                                              */
/* ------------------------------------------------------------------ */

function extractVimeoId(url: string): string | null {
  // https://vimeo.com/123456789
  // https://player.vimeo.com/video/123456789
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match ? match[1] : null;
}

/* ------------------------------------------------------------------ */
/* Direct file detection                                              */
/* ------------------------------------------------------------------ */

const DIRECT_FILE_RE = /\.(mp4|webm|ogg|ogv|mov|m4v|mkv)(\?.*)?$/i;

function isDirectVideoFile(url: string): boolean {
  return DIRECT_FILE_RE.test(url);
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export function parseVideo(url: string | null | undefined): ParsedVideo | null {
  if (!url) return null;

  const trimmed = url.trim();

  // YouTube
  const ytId = extractYoutubeId(trimmed);
  if (ytId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`,
      isEmbed: true,
    };
  }

  // Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      isEmbed: true,
    };
  }

  // Direct file
  if (isDirectVideoFile(trimmed)) {
    return {
      type: 'file',
      embedUrl: trimmed,
      isEmbed: false,
    };
  }

  // Unknown — try <video> anyway (some CDNs don't use extensions)
  return {
    type: 'unknown',
    embedUrl: trimmed,
    isEmbed: false,
  };
}