function init() {

  //SETTING THE GRID
  const gameGrid = document.querySelector('.game-grid')
  const gameGridWidth = 10
  const gameGridHeight = 25
  const gameGridCellCount = gameGridWidth * gameGridHeight
  const gameGridCells = []
  const newTetrominoSpawnCell = Math.floor(gameGridWidth / 2)

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


  //THE TETROMINOS
  // makes these into objects too? for the colour?
  // const ITetromino = {blocks: [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], colour = 'green']
  // would require a bit more refactoring to target the block positions and then impliment the colour of the block on spawn. 
  const ITetromino = [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
  const OTetromino = [[1, 1],[1, 1]]
  const TTetromino = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
  const JTetromino = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  const LTetromino = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
  const STetromino = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
  const ZTetromino = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]

  const tetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]


  //TETROMINO
  class Tetromino {
    constructor(type = [], cellPositions = [], currentTLSpawnPosition = newTetrominoSpawnCell, nextTLSpawnPosition = newTetrominoSpawnCell, nextTypeAndRotation = []){
      this.type = type
      this.cellPositions = cellPositions
      this.currentTLSpawnPosition = currentTLSpawnPosition
      this.nextTLSpawnPosition = nextTLSpawnPosition
      this.nextTypeAndRotation = nextTypeAndRotation
    }
    spawn(){
      let cellRender = this.currentTLSpawnPosition
      for (let i = 0; i < this.type.length; i++){
        for (let j = 0; j < this.type.length; j++){
          if (this.type[i][j] === 1){
            gameGridCells[cellRender].classList.add('block')
            this.cellPositions.push(cellRender)
          }        
          cellRender ++
        }
        cellRender += (gameGridWidth - this.type.length)
      }
    }
    despawn(){
      this.cellPositions = []
      let cellRender = this.currentTLSpawnPosition
      for (let i = 0; i < this.type.length; i++){
        for (let j = 0; j < this.type.length; j++){
          if (this.type[i][j] === 1){
            gameGridCells[cellRender].classList.remove('block')
          }
          cellRender ++
        }
        cellRender += (gameGridWidth - this.type.length)
      }
    }
    checkMovementClash(){
      const clashCheckArray = []
      let cellCheck = this.nextTLSpawnPosition
      for (let i = 0; i < this.nextTypeAndRotation.length; i++){
        for (let j = 0; j < this.nextTypeAndRotation.length; j++){
          if (this.nextTypeAndRotation[i][j] === 1 && gameGridCells[cellCheck].classList.contains('block')){
            clashCheckArray.push('clash')
          }        
          cellCheck ++
        }
        cellCheck += (gameGridWidth - this.type.length)
      }
      return !clashCheckArray.some(cell => cell === 'clash')
    }
    movement(movement){
      this.despawn()     
      if (movement === 'move down'){
        this.nextTLSpawnPosition = this.currentTLSpawnPosition + gameGridWidth
        this.nextTypeAndRotation = this.type
      } else if (movement === 'move left'){
        this.nextTLSpawnPosition = this.currentTLSpawnPosition - 1
        this.nextTypeAndRotation = this.type
      } else if (movement === 'move right'){
        this.nextTLSpawnPosition = this.currentTLSpawnPosition + 1
        this.nextTypeAndRotation = this.type
      } else if (movement === 'rotate'){
        this.nextTLSpawnPosition = this.currentTLSpawnPosition
        this.nextTypeAndRotation = []
        for (let i = 0; i < this.type.length; i++) { // add a while loop that moves over if block class is 
          this.nextTypeAndRotation.push([])
          for (let j = 0; j < this.type.length; j++) {
            this.nextTypeAndRotation[i].unshift(this.type[j][i])
          }
        }
      } else if (movement === 'swap'){
        this.nextTypeAndRotation = tetrominoes[Math.floor(Math.random() * 7)] //change from random to next in que
      }
      if (this.checkMovementClash()){
        this.currentTLSpawnPosition = this.nextTLSpawnPosition
        this.type = this.nextTypeAndRotation
        
      } else { 
        if (movement === 'move down') { //--TETROMINO LANDING--
          this.spawn()
          this.clearedLine() 
          //gameOver()
          this.type = (tetrominoes[Math.floor(Math.random() * 7)])  //change from random to next in que
          this.currentTLSpawnPosition = newTetrominoSpawnCell
          
        }
      }
      this.spawn()
    }
    clearedLine() {
      let clearedLineCounter = 0
      const tetrominoLineNumbers = this.cellPositions.map(cell => Math.floor(cell / gameGridWidth))
      for (let i = 0; i < tetrominoLineNumbers.length; i++){
        const lineArray = [[], []]
        for (let j = 1; j < gameGridWidth - 1; j++){
          lineArray[0].push((gameGridWidth * tetrominoLineNumbers[i]) + j)
          lineArray[1].push(gameGridCells[(gameGridWidth * tetrominoLineNumbers[i]) + j].classList.contains('block'))
        }
        if (lineArray[1].every(cell => cell === true)){ //--CLEARED LINE--
          for (let j = 0; j < lineArray[0].length; j++){
            gameGridCells[lineArray[0][j]].classList.remove('block') 
          }
          clearedLineCounter ++
        }
      }
      if (clearedLineCounter === 4){
        console.log('TETRIS')
      }
    }
  }
  const activeTetromino = new Tetromino() 
  
  
  

  //CONTROL BOARD
  function handleKeyDown(e) {
    const key = e.keyCode
    const left = 37
    const right = 39
    const up = 38
    const down = 40
    const space = 32
    
    if (key === left){
      activeTetromino.movement('move left')
    } else if (key === right){
      activeTetromino.movement('move right')
    } else if (key === up){
      activeTetromino.movement('rotate')
    } else if (key === down){
      activeTetromino.movement('move down')
    } else if (key === space){
      activeTetromino.movement('swap')
    }
  }
  document.addEventListener('keydown', handleKeyDown)



  //GAME LOOP
  let gameLoopIntervalTime = 1000 * 1

  function gameLoop() {
    setInterval(() => {
      activeTetromino.movement('move down')
    }, gameLoopIntervalTime)
  }

  //TEST
  
  activeTetromino.type = tetrominoes[Math.floor(Math.random() * 7)]
  //activeTet.type = tetrominoes[1]
  //const dummyTet = new Tetromino(activeTetromino.type, [], activeTetromino.currentTLSpawnPosition + (gameGridWidth * 4))
  //dummyTet.spawn()
  //const dummyTet = activeTetromino
  //spawnTetromino(dummyTet, activeTLSpawnPosition + (gameGridWidth * 4) )
  activeTetromino.spawn()
  //spawnTetromino(dummyTet)
  //spawnTetromino(dummyTet)
  gameLoop()


}
window.addEventListener('DOMContentLoaded', init)