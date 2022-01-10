function init() {

  //GAME STATS
  //score
  //time
  let gameLoopIntervalTime = 1000 * 1

  
  //SETTING THE GRID  //can this be tidied up??
  const gameGrid = document.querySelector('.game-grid')
  const gameGridWidth = 10
  const gameGridHeight = 25
  const gameGridCellCount = gameGridWidth * gameGridHeight
  const gameGridCells = []
  const newTetrominoSpawnCell = Math.floor((gameGridWidth / 2) - 1)
  

  function generateGrid(){
    for (let i = 0; i < gameGridCellCount; i++){
      const cell = document.createElement('div')
      cell.style.width = `${100 / gameGridWidth}%`//will need to play about with width and height to make it responsive
      cell.style.height = `${100 / gameGridHeight}%`
      //cell.innerText = i //keep during coding and then delete
      gameGrid.appendChild(cell)
      gameGridCells.push(cell)  
      //border
      if (i % gameGridWidth === 0 || i % gameGridWidth === gameGridWidth - 1 || i > gameGridCellCount - gameGridWidth) {
        gameGridCells[i].classList.add('block')
        const innerCell = document.createElement('div')
        innerCell.classList.add('grey')
        gameGridCells[i].appendChild(innerCell)
      }
    }
  }
  generateGrid()



  //TETROMINOS
  class Tetromino {                                                      
    constructor(layout = [], rotation = 0, cellPositions = [], TLSpawnPosition = newTetrominoSpawnCell, colour = ''){
      this.layout = layout
      this.rotation = rotation
      this.cellPositions = cellPositions
      this.TLSpawnPosition = TLSpawnPosition
      this.colour = colour
    }
    spawn() {
      let cellRender = this.TLSpawnPosition
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){
            gameGridCells[cellRender].classList.add('block')
            this.cellPositions.push(cellRender) //can maybe tidy up a bit??
            const innerCell = document.createElement('div')
            innerCell.classList.add(this.colour)
            gameGridCells[cellRender].appendChild(innerCell)
          }        
          cellRender ++
        }
        cellRender += (gameGridWidth - this.layout.length)
      }
    }
    despawn(){
      this.cellPositions = []
      let cellRender = this.TLSpawnPosition
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){ 
            gameGridCells[cellRender].classList.remove('block')
            gameGridCells[cellRender].removeChild(gameGridCells[cellRender].childNodes[0])
          }
          cellRender ++
        }
        cellRender += (gameGridWidth - this.layout.length)
      }
    }
  }



  //TETROMINO TYPES
  const ITetromino = new Tetromino([[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], 0, [], newTetrominoSpawnCell, 'lightBlue')
  const OTetromino = new Tetromino([[1, 1],[1, 1]], 0, [], newTetrominoSpawnCell, 'yellow')
  const TTetromino = new Tetromino([[1, 1, 1], [0, 1, 0], [0, 0, 0]], 0, [], newTetrominoSpawnCell, 'purple')
  const JTetromino = new Tetromino([[0, 1, 0], [0, 1, 0], [1, 1, 0]], 0, [], newTetrominoSpawnCell, 'darkBlue')
  const LTetromino = new Tetromino([[0, 1, 0], [0, 1, 0], [0, 1, 1]], 0, [], newTetrominoSpawnCell, 'orange')
  const STetromino = new Tetromino([[0, 1, 1], [1, 1, 0], [0, 0, 0]], 0, [], newTetrominoSpawnCell, 'green')
  const ZTetromino = new Tetromino([[1, 1, 0], [0, 1, 1], [0, 0, 0]], 0, [], newTetrominoSpawnCell, 'red')

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]
  function randomTetromino(){
    return tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
  }
  
  //TETROMINO QUEUE   -make display -havng issues with swap and next- need to visualise it. 
  const tetrominoQueue = [randomTetromino(), randomTetromino(), randomTetromino(), randomTetromino()]
  //display
  //const nextTetrominoGrid = document.querySelector('.game-grid')
  //const nextGridWidth = 10
  //const gameGridHeight = 25
  //const gameGridCellCount = gameGridWidth * gameGridHeight
  //const gameGridCells = []
  //const newTetrominoSpawnCell = Math.floor((gameGridWidth / 2) - 1)
  

  //function generateGrid(){
  //  for (let i = 0; i < gameGridCellCount; i++){
  //    const cell = document.createElement('div')
  //    cell.style.width = `${100 / gameGridWidth}%`//will need to play about with width and height to make it responsive
  //   cell.style.height = `${100 / gameGridHeight}%`
  //    //cell.innerText = i //keep during coding and then delete
  //    gameGrid.appendChild(cell)
  //    gameGridCells.push(cell)  
  //    //border
  //    if (i % gameGridWidth === 0 || i % gameGridWidth === gameGridWidth - 1 || i > gameGridCellCount - gameGridWidth) {
  //      gameGridCells[i].classList.add('block')
  //      const innerCell = document.createElement('div')
  //      innerCell.classList.add('grey')
  //      gameGridCells[i].appendChild(innerCell)
  //    }
  //  }
  //}
  //generateGrid()

  //IN-PLAY TETROMINO
  const activeTetromino = new Tetromino(randomTetromino().layout, 0, [], newTetrominoSpawnCell, randomTetromino().colour) //can this be done better? 
  const nextPosition = new Tetromino(activeTetromino.layout, 0, [], newTetrominoSpawnCell, activeTetromino.colour)
  const tetrominoShadow = new Tetromino()
  //tetrominoShadow.colour = 'grey'

  
  //MOVEMENT
  function movementCheck(){
    const clashCheckArray = []
    let cellCheck = nextPosition.TLSpawnPosition
    for (let i = 0; i < nextPosition.layout.length; i++){
      for (let j = 0; j < nextPosition.layout.length; j++){
        if (nextPosition.layout[i][j] === 1 && gameGridCells[cellCheck].classList.contains('block')){
          clashCheckArray.push('clash')
        }        
        cellCheck ++
      }
      cellCheck += (gameGridWidth - activeTetromino.layout.length)//should this be next??
    }
    return !clashCheckArray.some(cell => cell === 'clash')
  }

  function movement(movement){
    activeTetromino.despawn()
    //
    nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
    nextPosition.layout = activeTetromino.layout
    nextPosition.colour = activeTetromino.colour
    if (movement === 'move down'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + gameGridWidth
      //nextPosition.layout = activeTetromino.layout
    } else if (movement === 'move left'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition - 1
      //nextPosition.layout = activeTetromino.layout
    } else if (movement === 'move right'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + 1
      //nextPosition.layout = activeTetromino.layout
    } else if (movement === 'rotate'){
      //nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
      nextPosition.layout = []
      for (let i = 0; i < activeTetromino.layout.length; i++) { // add a while loop that moves over if block class is 
        nextPosition.layout.push([])
        for (let j = 0; j < activeTetromino.layout.length; j++) {
          nextPosition.layout[i].unshift(activeTetromino.layout[j][i])
        }
      }
    } else if (movement === 'swap'){
      nextPosition.layout = tetrominoQueue[0].layout
      nextPosition.colour = tetrominoQueue[0].colour
      tetrominoQueue[0].layout = activeTetromino.layout
      tetrominoQueue[0].colour = activeTetromino.colour //there must be more elegant solution to this?? 
    }
    if (movementCheck()){
      activeTetromino.TLSpawnPosition = nextPosition.TLSpawnPosition
      activeTetromino.layout = nextPosition.layout
      activeTetromino.colour = nextPosition.colour 
    } else { 
      if (movement === 'move down') { //--TETROMINO LANDING--
        activeTetromino.spawn()
        clearedLine() 
        //gameOver()
        activeTetromino.layout = tetrominoQueue[0].layout
        activeTetromino.colour = tetrominoQueue[0].colour
        activeTetromino.TLSpawnPosition = newTetrominoSpawnCell
        //activeTetromino = tetrominoQueue[0] 
        tetrominoQueue.push(randomTetromino())
        tetrominoQueue.shift()
      }
    }
    activeTetromino.spawn()
  }

  //GAME MECHANICS
  function clearedLine() {
    let clearedLineCounter = 0
    const tetrominoLineNumbers = activeTetromino.cellPositions.map(cell => Math.floor(cell / gameGridWidth))
    for (let i = 0; i < tetrominoLineNumbers.length; i++){
      const lineArray = [[], []]
      for (let j = 1; j < gameGridWidth - 1; j++){
        lineArray[0].push((gameGridWidth * tetrominoLineNumbers[i]) + j)
        lineArray[1].push(gameGridCells[(gameGridWidth * tetrominoLineNumbers[i]) + j].classList.contains('block'))
      }
      if (lineArray[1].every(cell => cell === true)){ //--CLEARED LINE--
        for (let j = 0; j < lineArray[0].length; j++){
          gameGridCells[lineArray[0][j]].classList.remove('block') 
          gameGridCells[lineArray[0][j]].removeChild(gameGridCells[lineArray[0][j]].childNodes[0])
        }
        clearedLineCounter ++
        for (let j = tetrominoLineNumbers[i] * gameGridWidth; j >= 0; j--){ //--DROPPING THE BLOCKS--
          if (j % gameGridWidth !== 0 && j % gameGridWidth !== gameGridWidth - 1 && gameGridCells[j].classList.contains('block')){
            gameGridCells[j].classList.remove('block')
            const colour = gameGridCells[j].childNodes[0].classList
            gameGridCells[j].removeChild(gameGridCells[j].childNodes[0])
            //add animation?? - on and off class with delay. 
            gameGridCells[j + gameGridWidth].classList.add('block')
            const innerCell = document.createElement('div')
            innerCell.classList.add(colour)
            gameGridCells[j + gameGridWidth].appendChild(innerCell)
          }
        }
      }
      if (clearedLineCounter === 4){
        console.log('TETRIS')
      }
    }
  }
  


  //CONTROL BOARD
  function handleKeyDown(e) {
    const key = e.keyCode
    const left = 37
    const right = 39
    const up = 38
    const down = 40
    const space = 32 // add different keys (number pad)(touch screen for phone?)
    
    if (key === left){
      movement('move left')
    } else if (key === right){
      movement('move right')
    } else if (key === up){
      movement('rotate')  //change up to drop and have x & z for rotates in different directions (call rotate * 3)
    } else if (key === down){
      movement('move down')
    } else if (key === space){
      movement('swap')
    }
  }
  document.addEventListener('keydown', handleKeyDown)



  //GAME LOOP
  function gameLoop() {
    setInterval(() => {
      movement('move down')
    }, gameLoopIntervalTime)
  }




  //TEST
  activeTetromino.spawn()
  gameLoop()




}
window.addEventListener('DOMContentLoaded', init)