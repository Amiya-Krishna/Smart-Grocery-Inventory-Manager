export const generateSmartList = (items) => {
  const list = [];

  items.forEach((item) => {
    if (item.quantity <= item.minStock) {
      list.push({
        name: item.name,
        reason: "Low Stock",
        qty: 1,
      });
    }

    if (item.expiryDate) {
      const days =
        (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

      if (days <= 3) {
        list.push({
          name: item.name,
          reason: "Expiring Soon",
          qty: 1,
        });
      }
    }
  });

  return list;
};