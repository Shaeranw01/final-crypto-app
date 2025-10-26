export function trimName(name?: string, maxLength = 10) {
  if (!name) return "";
  return name.length > maxLength ? name.slice(0, maxLength) + "…" : name;
}
