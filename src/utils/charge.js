
const pxtToWei = (pxt) => {
  const wei = Math.floor(pxt * 1000000000000000000);
  return wei;
};

export { pxtToWei };
