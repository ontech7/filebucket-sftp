import { extname } from "path";

export const isImage = (filename: string) => {
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".avif"].includes(
    extname(filename).toLowerCase()
  );
};
