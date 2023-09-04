import crypto from "crypto";

const computeHash = (key: string, content: string) => {
  return crypto
    .createHmac("sha256", Buffer.from(key, "utf8"))
    .update(content, "utf8")
    .digest("base64");
};

export default computeHash;