class ValidMountainArray {
  validMountainArray(arr) {
    if (!arr || arr.length < 3) {
      return false;
    }
    let i = 0;
    while (i + 1 < arr.length && arr[i] < arr[i + 1]) {
      i += 1;
    }
    if (i === 0 || i === arr.length - 1) {
      return false;
    }
    while (i + 1 < arr.length && arr[i] > arr[i + 1]) {
      i += 1;
    }
    return i === arr.length - 1;
  }
}
