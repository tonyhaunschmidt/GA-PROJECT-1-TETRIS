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



class Person {
  constructors(name, age){
    this.name = name
    this.age = age
  }
  logName() {
    console.log(this.name)
  }
  stealName() {
    this.name = steffi.name
  }
}

const tony = new Person('tony', 29)
const steffi = new Person('steffi', 27)

tony.logName()
tony.stealName()
tony.logName()