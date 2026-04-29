import crypto from "crypto";

export function generateTxId(prefix = "tx_") {
  const random = crypto.randomBytes(4).toString("hex"); // 8 chars
  return `${prefix}${random}`;
}