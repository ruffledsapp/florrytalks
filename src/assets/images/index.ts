export const Images = {
  placeholder: "/placeholder.svg",
  ogImage: "/og-image.png",
  favicon: "/favicon.ico"
} as const;

export type ImageKeys = keyof typeof Images;