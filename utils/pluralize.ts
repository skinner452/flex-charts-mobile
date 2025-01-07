export const pluralize = (singular: string, count: number, plural?: string) => {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  if (plural) {
    return `${count} ${plural}`;
  }

  return `${count} ${singular}s`;
};
