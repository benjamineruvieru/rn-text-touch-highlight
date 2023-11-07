export function findValueLessThanOrEqualToNumber(
  arr: string[],
  number: number,
  map: Record<number, number[] | undefined>
): { result: number; words: number } {
  'worklet';
  // Convert the array elements to numbers and sort the array in ascending order
  // Initialize a variable to store the result
  let result: number;
  let words = 0;
  const sortedArray = arr.map(Number).sort((a, b) => a - b);

  // Loop through the sorted array
  for (let i = 0; i < sortedArray.length; i++) {
    //@ts-ignore
    if (sortedArray[i] <= number) {
      //@ts-ignore
      result = sortedArray[i];
      words += map[result]?.length || 0;
    } else {
      // If we find an element greater than the number, we can break the loop
      break;
    }
  }
  //@ts-ignore
  words -= map[result]?.length || 0;
  //@ts-ignore
  return { result, words };
}

export function findIndexLessThanOrEqual(
  arr: number[],
  number: number
): number {
  'worklet';

  for (let i = 0; i < arr?.length; i++) {
    //@ts-ignore
    if (number <= arr[i]) {
      return i; // Return the index of the first value that's less than or equal to the given number
    }
  }
  // If no such value is found, you can return -1 or any other appropriate value.
  return -1;
}
