function formatNumber(number: number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B'; // Tỷ
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M'; // Triệu
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K'; // Nghìn
  } else {
    return number.toString(); // Nhỏ hơn 1000
  }
}

export default formatNumber;
