export default function mathRound10(value: number, exp: number) {
  let valueStr = value.toString().split("e");
  const valueN = Math.round(+(valueStr[0] + "e" + (valueStr[1] ? +valueStr[1] - exp : -exp)));
    // Обратный сдвиг
  valueStr = valueN.toString().split("e");
  return +(valueStr[0] + "e" + (valueStr[1] ? +valueStr[1] + exp : exp));
}