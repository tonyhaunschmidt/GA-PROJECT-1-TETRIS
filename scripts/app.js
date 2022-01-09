function init() {

  //SETTING THE GRID
  const gameGrid = document.querySelector('.game-grid')
  const gameGridWidth = 10
  const gameGridHeight = 25
  const gameGridCellCount = gameGridWidth * gameGridHeight
  const gameGridCells = []

  function generateGrid(){
    for (let i = 0; i < gameGridCellCount; i++){
      const cell = document.createElement('div')
      cell.style.width = `${100 / gameGridWidth}%`//will need to play about with width and height to make it responsive
      cell.style.height = `${100 / gameGridHeight}%`
      cell.innerText = i //keep during coding and then delete
      gameGrid.appendChild(cell)
      gameGridCells.push(cell)  
      //border
      if (i % gameGridWidth === 0 || i % gameGridWidth === gameGridWidth - 1 || i > gameGridCellCount - gameGridWidth) {
        gameGridCells[i].classList.add('block')
      }
    }
  }
  generateGrid()
  

  //DEFINING THE TETROMINOES
  class Tetromino {
    constructor(type = [], cellPositions = [], currentTLSpawnPosition = 4, nextTLSpawnPosition = 4){
      this.type = type
      this.cellPositions = cellPositions
      this.currentTLSpawnPosition = currentTLSpawnPosition
      this.nextTLSpawnPosition = nextTLSpawnPosition
    }
  }
  let activeTetromino = new Tetromino([], [], 4) 
  

  const ITetromino = [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
  const OTetromino = [[1, 1],[1, 1]]
  const TTetromino = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
  const JTetromino = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  const LTetromino = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
  const STetromino = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
  const ZTetromino = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]

  const tetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]
  

  //SPAWN
  function spawnTetromino(tetromino){
    let cellRender = tetromino.currentTLSpawnPosition
    for (let i = 0; i < tetromino.type.length; i++){
      for (let j = 0; j < tetromino.type.length; j++){
        if (tetromino.type[i][j] === 1){
          gameGridCells[cellRender].classList.add('block')
          tetromino.cellPositions.push(cellRender)
        }        
        cellRender ++
      }
      cellRender += (gameGridWidth - tetromino.type.length)
    }
  }
  //DESPAWN
  function despawnTetromino(tetromino){
    tetromino.cellPositions = []
    let cellRender = tetromino.currentTLSpawnPosition
    for (let i = 0; i < tetromino.type.length; i++){
      for (let j = 0; j < tetromino.type.length; j++){
        if (tetromino.type[i][j] === 1){
          gameGridCells[cellRender].classList.remove('block')
        }
        cellRender ++
      }
      cellRender += (gameGridWidth - tetromino.type.length)
    }
  }
  //POSITION CHECK
  function tetrominoPositionCheck(tetromino){
    let cellCheck = tetromino.currentTLSpawnPosition
    for (let i = 0; i < tetromino.type.length; i++){
      for (let j = 0; j < tetromino.type.length; j++){
        if (tetromino.type[i][j] === 1){
          tetromino.cellPositions.push(cellCheck)
        }        
        cellCheck ++
      }
      cellCheck += (gameGridWidth - tetromino.type.length)
    }
  }

  //MOVEMENTS
  //function Movements (tetromino, movement){
  //  if (movement = moveDown)
  // m}


  function moveDown(tetromino){
    despawnTetromino(tetromino)

    tetromino.nextTLSpawnPosition = tetromino.currentTLSpawnPosition + gameGridWidth
    
    if (checkMovementClash(tetromino)){
      tetromino.currentTLSpawnPosition = tetromino.nextTLSpawnPosition  
    }
    spawnTetromino(tetromino)
  }

  function moveLeft(tetromino){
    despawnTetromino(tetromino)
    tetromino.currentTLSpawnPosition --  
    spawnTetromino(tetromino)
  }

  function moveRight(tetromino){
    despawnTetromino(tetromino)
    tetromino.currentTLSpawnPosition ++  
    spawnTetromino(tetromino)
  }

  function rotate(tetromino) {
    despawnTetromino(tetromino)
    const rotatedArray = []
    for (let i = 0; i < tetromino.type.length; i++) {
      rotatedArray.push([])
      for (let j = 0; j < tetromino.type.length; j++) {
        rotatedArray[i].unshift(tetromino.type[j][i])
      }
    }
    tetromino.type = rotatedArray
    spawnTetromino(tetromino)
  }

  function switchActiveTetromino(){ ///just playing about- will need refactoring after showing tetromino que
    despawnTetromino(activeTetromino)
    const newTetromino = new Tetromino(tetrominoes[Math.floor(Math.random() * 7)], [], activeTetromino.currentTLSpawnPosition)
    activeTetromino = newTetromino
    spawnTetromino(activeTetromino)
  }

  //CLASH CHECKS
  // could have a function that runs through all directions and if any will return a clash then return value 'left clash' and then when calling the function  
  function checkMovementClash(tetromino){
    const clashCheckArray = []
    let cellCheck = tetromino.nextTLSpawnPosition
    for (let i = 0; i < tetromino.type.length; i++){
      for (let j = 0; j < tetromino.type.length; j++){
        if (tetromino.type[i][j] === 1 && gameGridCells[cellCheck].classList.contains('block')){
          clashCheckArray.push('clash')
        }        
        cellCheck ++
      }
      cellCheck += (gameGridWidth - tetromino.type.length)
    }
    console.log(!clashCheckArray.some(cell => cell === 'clash'))
    return !clashCheckArray.some(cell => cell === 'clash')
  }



  //CONTROL BOARD
  function handleKeyDown(e) {
    const key = e.keyCode // store the event.keyCode in a variable to save us repeatedly typing it out
    const left = 37
    const right = 39
    const up = 38
    const down = 40
    const space = 32
    
    if (key === left){
      //if dummy check is false then move left
      moveLeft(activeTetromino)
    } else if (key === right){
      // if dummy check is false then move right
      moveRight(activeTetromino)
    } else if (key === up){
      // if dummy check -- move over THEN rotate
      rotate(activeTetromino)
    } else if (key === down){
      // if dummy check is false then move down if true then activate new tetromino
      moveDown(activeTetromino)
    } else if (key === space){
      //if dummy check is false then replace tetromino
      switchActiveTetromino()
    }
    console.log(key)
  }
  document.addEventListener('keydown', handleKeyDown)



  //GAME LOOP
  let gameLoopIntervalTime = 1000 * 1

  function gameLoop() {
    setInterval(() => {
      moveDown(activeTetromino)
      moveDown(dummyTet)
      console.log(activeTetromino.currentTLSpawnPosition)
    }, gameLoopIntervalTime)
  }

  //TEST
  
  activeTetromino.type = tetrominoes[Math.floor(Math.random() * 7)]
  //activeTet.type = tetrominoes[1]
  const dummyTet = new Tetromino(activeTetromino.type, [], activeTetromino.currentTLSpawnPosition + (gameGridWidth * 4))
  //const dummyTet = activeTetromino
  //spawnTetromino(dummyTet, activeTLSpawnPosition + (gameGridWidth * 4) )
  spawnTetromino(activeTetromino)
  //spawnTetromino(dummyTet)
  //spawnTetromino(dummyTet)
  gameLoop()


}
window.addEventListener('DOMContentLoaded', init)