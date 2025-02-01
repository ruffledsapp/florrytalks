export const Images = {
  placeholder: "/placeholder.svg",
  ogImage: "/og-image.png",
  favicon: "/favicon.ico",
  searchHero: "photo-1488590528505-98d2b5aba04b",
  chatInterface: "photo-1486312338219-ce68d2c6f44d"
} as const;

export type ImageKeys = keyof typeof Images;