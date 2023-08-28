export function won(value: number) {
  return `${String(value)
    .split("")
    .reverse()
    .map((c, i) => (i > 0 && i % 3 === 0 ? c + "," : c))
    .reverse()
    .join("")} 원`;
}
