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
      cell.style.width = `${100 / gameGridWidth}%`
      cell.style.height = `${100 / gameGridHeight}%`
      cell.innerText = i //keep during coding and then delete
      gameGrid.appendChild(cell)
      gameGridCells.push(cell)
    }
  }
  generateGrid()

  //will need to play about with width and height to make it responsive
  
  
  //IN PLAY/ACTIVE TETROMINO
  let ActiveTetromino = []
  let TLSpawnPosition = 4   //top left spawn position


  //DEFINING THE TETROMINOES
  const ITetromino = [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  const OTetromino = [[1, 1],[1, 1]]
  const TTetromino = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
  const JTetromino = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  const LTetromino = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
  const STetromino = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
  const ZTetromino = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]

  const tetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]
  

  //SPAWN
  function SpawnTetromino(tetromino, TLSpawnPosition){
    for (let i = 0; i < tetromino.length; i++){
      for (let j = 0; j < tetromino.length; j++){
        if (tetromino[i][j] === 1){
          gameGridCells[TLSpawnPosition].classList.add('block')
        }
        TLSpawnPosition ++
      }
      TLSpawnPosition += (gameGridWidth - tetromino.length)
    }
  }
  //DESPAWN
  function despawnTetromino(tetromino, TLSpawnPosition){
    for (let i = 0; i < tetromino.length; i++){
      for (let j = 0; j < tetromino.length; j++){
        if (tetromino[i][j] === 1){
          gameGridCells[TLSpawnPosition].classList.remove('block')
        }
        TLSpawnPosition ++
      }
      TLSpawnPosition += (gameGridWidth - tetromino.length)
    }
  }
  

  //MOVEMENTS

  //function checkClash() {
  //check clash with wall and check clash with other block classes
  //(run through the active array)-- may need one for each direction
  //}


  function moveDown(){
    despawnTetromino(ActiveTetromino, TLSpawnPosition)
    //check clash function
    TLSpawnPosition += gameGridWidth
    SpawnTetromino(ActiveTetromino, TLSpawnPosition)
  }

  function moveLeft(){
    despawnTetromino(ActiveTetromino, TLSpawnPosition)
    //check clash function
    TLSpawnPosition --  
    SpawnTetromino(ActiveTetromino, TLSpawnPosition)
  }

  function moveRight(){
    despawnTetromino(ActiveTetromino, TLSpawnPosition)
    //check clash function
    TLSpawnPosition ++  
    SpawnTetromino(ActiveTetromino, TLSpawnPosition)
  }

  function rotate() {
    despawnTetromino(ActiveTetromino, TLSpawnPosition)
    const rotatedArray = []
    for (let i = 0; i < ActiveTetromino.length; i++) {
      rotatedArray.push([])
      for (let j = 0; j < ActiveTetromino.length; j++) {
        rotatedArray[i].unshift(ActiveTetromino[j][i])
      }
    }
    ActiveTetromino = rotatedArray
    SpawnTetromino(ActiveTetromino, TLSpawnPosition)
  }


  //CONTROL BOARD
  function handleKeyDown(e) {
    const key = e.keyCode // store the event.keyCode in a variable to save us repeatedly typing it out
    const left = 37
    const right = 39
    const up = 38
    const down = 40
    
    if (key === left){
      moveLeft()
    } else if (key === right){
      moveRight()
    } else if (key === up){
      rotate()
    } else if (key === down){
      moveDown()
    }
  }
  document.addEventListener('keydown', handleKeyDown)



  //GAME LOOP
  let gameLoopIntervalTime = 1000 * 1

  function gameLoop() {
    setInterval(() => {
      moveDown()
    }, gameLoopIntervalTime)
  }

  //TEST
  ActiveTetromino = tetrominoes[Math.floor(Math.random() * 7)]
  SpawnTetromino(ActiveTetromino, TLSpawnPosition)
  gameLoop()


}
window.addEventListener('DOMContentLoaded', init)