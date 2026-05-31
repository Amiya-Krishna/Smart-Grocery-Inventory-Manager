export const recommendItems = (items) => {
  return items
    .filter((item) => item.quantity <= item.minStock)
    .map((item) => ({
      name: item.name,
      reason: "Frequently used item running low",
    }));
};