export const formatNumber = (num: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
  });
  return formatter.format(num);
};

export const formatUnixDate = (timestamp: number): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatter.format(new Date(timestamp * 1000));
};
