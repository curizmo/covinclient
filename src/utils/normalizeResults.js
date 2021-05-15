export const normalizeResults = (results) => {
  return results
    ? results.map(({ title, id }) => ({
        title: title || '',
        id,
      }))
    : [];
};
