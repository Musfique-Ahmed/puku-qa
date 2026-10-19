() => {
  const text = document.body.textContent;
  const re = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/g;
  const dates = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!dates.includes(m[0])) dates.push(m[0]);
  }
  return dates.slice(0, 10);
}
