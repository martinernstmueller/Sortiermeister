import { ColoredNumber } from "../components/NumberRow";

export async function* insertionSort(arr: ColoredNumber[]) {
  const a = arr;

  for (let i = 1; i < a.length; i++) {
    let j = i;

    while (j > 0 && a[j - 1].number > a[j].number) {
      yield { array: [...a], activeNumber: j };
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
    }
  }

  yield { array: [...a], activeNumber: null };
}
