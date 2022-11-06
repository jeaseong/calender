export const validHeight = (height: number) => {
  if (height <= 0) {
    return 0;
  }
  if (height >= 250) {
    return 250;
  }
  return height;
};
