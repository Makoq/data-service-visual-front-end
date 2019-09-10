
function endWith(str, endStr) {
  const d = str.length - endStr.length;
  return (d >= 0 && str.lastIndexOf(endStr) == d);
}

export default { endWith };
