import Tesseract from "tesseract.js";

export const scanReceipt = async (image) => {
  const { data } = await Tesseract.recognize(image, "eng");

  const text = data.text;

  const items = text
    .split("\n")
    .filter((line) => line.length > 2);

  return items;
};