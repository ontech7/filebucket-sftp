import "server-only";

import crypto from "crypto";

export function generateRandomPath(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
