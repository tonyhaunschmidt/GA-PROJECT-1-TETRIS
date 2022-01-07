//rotating a squarearray

const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

function rotateSquareArray(array){
  const rotatedArray = []
  for (let i = 0; i < array.length; i++) {
    rotatedArray.push([])
    for (let j = 0; j < array.length; j++) {
      rotatedArray[i].unshift(array[j][i])
    }
  }
  return rotatedArray
}

console.log(rotateSquareArray(array))

