export const DisplayPriceInRupees = (price) => {
    if (isNaN(price)) return 'रु 0';
  
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  
    return `रु ${formatted}`;
  };
  