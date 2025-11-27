import { ColoredNumber } from "../components/NumberRow";

export async function* bubbleSort(arr: ColoredNumber[]) {
  const a = arr;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { array: [...a], activeNumber: j };

      if (a[j].number > a[j + 1].number) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }

  yield { array: [...a], activeNumber: null };
}
