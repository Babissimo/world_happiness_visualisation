// gets range of an extent
export const range = (start, end) => {

    var rangeArray = [];
    for (let i = start; i <= end; i++) {
        rangeArray.push(i);
    }
    return rangeArray;
  };