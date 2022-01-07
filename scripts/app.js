function init() {


  //SETTING THE GRID
  const gameGrid = document.querySelector('.game-grid')
  const gameGridWidth = 10
  const gameGridHeight = 30
  const gameGridCellCount = gameGridWidth * gameGridHeight
  const gameGridCells = []

  function generateGrid(){
    for (let i = 0; i < gameGridCellCount; i++){
      const cell = document.createElement('div')
      cell.style.width = `${100 / gameGridWidth}%`
      cell.style.height = `${100/ gameGridHeight}%`
      cell.innerText = i //keep during coding and then delete
      gameGrid.appendChild(cell)
      gameGridCells.push(cell)
    }
  }
  generateGrid()


//will need to play about with width and height to make it responsive
  

  //DEFINING THE TETROMINOES
  const ITetromino = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
  const OTetromino = [[1, 1],[1, 1]]
  const TTetromino = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
  const JTetromino = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  const LTetromino = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
  const STetromino = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
  const ZTetromino = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]

  const tetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]


  //Testing a Spawn
  function SpawnTetromino(firstSpawnPosition){
    for (let i = 0; i < tetrominoes[1].length; i++){
      for (let j = 0; j < tetrominoes[1].length; j++){
        if (tetrominoes[0][i][j] === 1){
          gameGridCells[firstSpawnPosition].classList.add('block')
          console.log(firstSpawnPosition)
        }
        firstSpawnPosition ++
      }
      firstSpawnPosition += gameGridWidth
    }
  }
  SpawnTetromino(1)
  //not quite working- not sure why. this is console logging the wrong cells but also not changing adding the class to any?
  //also, will need to add tetromino argument. 


}
window.addEventListener('DOMContentLoaded', init)