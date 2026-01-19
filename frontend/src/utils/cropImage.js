/**
 * Creates a cropped image from the source image and crop area
 * @param {string} imageSrc - The source image URL
 * @param {Object} pixelCrop - The crop area in pixels {x, y, width, height}
 * @returns {Promise<Blob>} - The cropped image as a Blob
 */
export const createCroppedImage = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set canvas size to the crop area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95, // Quality
    );
  });
};

/**
 * Helper function to create an image element from a URL
 * @param {string} url - The image URL
 * @returns {Promise<HTMLImageElement>}
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Gets the radians from degrees
 * @param {number} degreeValue - Degrees
 * @returns {number} - Radians
 */
export const getRadianAngle = (degreeValue) => {
  return (degreeValue * Math.PI) / 180;
};
