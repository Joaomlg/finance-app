export const formatMoney = (value: number, absolute = false) => {
  return (absolute ? Math.abs(value) : value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};
