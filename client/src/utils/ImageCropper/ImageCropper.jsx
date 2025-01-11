import { createImage } from 'canvas-to-blob';

export default async function generateCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}
