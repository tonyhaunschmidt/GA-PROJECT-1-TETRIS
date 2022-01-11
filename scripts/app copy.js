function init() {

  //GAME STATS  -make this object??
  //score
  //time
  

  
  //SETTING THE GRID  //can this be tidied up??
  //const gameGrid = document.querySelector('.game-grid')
  //const gameGridWidth = 10
  //const gameGridHeight = 25
  //const gameGridCellCount = gameGridWidth * gameGridHeight
  //const gameGridCells = []
  //const newTetrominoSpawnCell = Math.floor((gameGridWidth / 2) - 1)
  
  class Grid{
    constructor(grid, width, height, newTetrominoSpawnCell){
      this.grid = grid
      this.width = width
      this.height = height
      this.cellCount = this.width * this.height
      this.cells = []
      this.newTetrominoSpawnCell = newTetrominoSpawnCell
    }
    generateGrid(){
      for (let i = 0; i < this.cellCount; i++){
        const cell = document.createElement('div')
        cell.style.width = `${100 / this.width}%`//will need to play about with width and height to make it responsive
        cell.style.height = `${100 / this.height}%`
        this.grid.appendChild(cell)
        this.cells.push(cell)  
      }
    }
    generateBorder(){
      for (let i = 0; i < this.cellCount; i++){
        if (i % this.width === 0 || i % this.width === this.width - 1 || i > this.cellCount - this.width) {
          this.cells[i].classList.add('block')
          const innerCell = document.createElement('div')
          innerCell.classList.add('grey')
          this.cells[i].appendChild(innerCell)
        }
      }
    }
  }

  const gameGrid  = new Grid(document.querySelector('.game-grid'), 10, 25, 5)
  //Math.floor((this.width / 2) - 1)  --will need to think about soft code for middle. deosnt like 'this.' in parameters 
  gameGrid.generateGrid()
  gameGrid.generateBorder()
  const qGrid  = new Grid(document.querySelector('.tetromino-queue'), 10, 25, 5)
  qGrid.generateGrid()
  qGrid.generateBorder()

  //function generateGrid(){
  //  for (let i = 0; i < gameGridCellCount; i++){
  //    const cell = document.createElement('div')
  //    cell.style.width = `${100 / gameGridWidth}%`//will need to play about with width and height to make it responsive
  //    cell.style.height = `${100 / gameGridHeight}%`
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



  //TETROMINOS
  class Tetromino {                                                      
    constructor(name, layout = [], colour = ''){
      this.name = name
      this.layout = layout
      this.rotation = 0
      this.cellPositions = []
      this.TLSpawnPosition = gameGrid.newTetrominoSpawnCell //will maybe need to change this to bottom position of 
      this.colour = colour
    }
    spawn(grid) {
      let cellRender = this.TLSpawnPosition
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){
            grid.cells[cellRender].classList.add('block')
            this.cellPositions.push(cellRender) //can maybe tidy up a bit??
            const innerCell = document.createElement('div')
            innerCell.classList.add(this.colour)
            grid.cells[cellRender].appendChild(innerCell)
          }        
          cellRender ++
        }
        cellRender += (grid.width - this.layout.length)
      }
    }
    despawn(grid){
      this.cellPositions = []
      let cellRender = this.TLSpawnPosition
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){ 
            grid.cells[cellRender].classList.remove('block')
            grid.cells[cellRender].removeChild(grid.cells[cellRender].childNodes[0])
          }
          cellRender ++
        }
        cellRender += (grid.width - this.layout.length)
      }
    }
  }



  //TETROMINO TYPES
  const ITetromino = new Tetromino('I Tetromino', [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], 'lightBlue')
  const OTetromino = new Tetromino('O Tetromino', [[1, 1],[1, 1]], 'yellow')
  const TTetromino = new Tetromino('T Tetromino', [[1, 1, 1], [0, 1, 0], [0, 0, 0]], 'purple')
  const JTetromino = new Tetromino('J Tetromino', [[0, 1, 0], [0, 1, 0], [1, 1, 0]], 'darkBlue')
  const LTetromino = new Tetromino('L Tetromino', [[0, 1, 0], [0, 1, 0], [0, 1, 1]], 'orange')
  const STetromino = new Tetromino('S Tetromino', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green')
  const ZTetromino = new Tetromino('Z Tetromino', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red')

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino] 
  //function randomTetromino(){
  //  return tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
  //}
  function randomTetromino(name){
    const randomTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
    return new Tetromino(name, randomTetrominoType.layout, randomTetrominoType.colour)
  }
  
  //const test = new Tetromino('test', randomTetromino().layout, randomTetromino().colour)

  //const test = randomTetromino('test')
  //const test = randomTetromino('test')
  //test.spawn(gameGrid)


  
  //TETROMINO QUEUE   -make display -havng issues with swap and next- need to visualise it. 
  //const tetrominoQueue = [randomTetromino(), randomTetromino(), randomTetromino(), randomTetromino()] //look at
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
  const activeTetromino = randomTetromino('Active Tetromino')
  const nextPosition = new Tetromino('Next Position', activeTetromino.layout, activeTetromino.colour)
  const tetrominoShadow = new Tetromino('Tetromino Shadow', activeTetromino.layout, 'grey')

  //test
  activeTetromino.spawn(gameGrid)
  nextPosition.spawn(qGrid)
  

  
  //MOVEMENT
  function movementCheck(){
    const clashCheckArray = []
    let cellCheck = nextPosition.TLSpawnPosition
    for (let i = 0; i < nextPosition.layout.length; i++){
      for (let j = 0; j < nextPosition.layout.length; j++){
        if (nextPosition.layout[i][j] === 1 && gameGrid.cells[cellCheck].classList.contains('block')){
          clashCheckArray.push('clash')
        }        
        cellCheck ++
      }
      cellCheck += (gameGrid.width - nextPosition.layout.length)//should this be next??
    }
    return !clashCheckArray.some(cell => cell === 'clash')
  }

  function movement(movement){
    activeTetromino.despawn(gameGrid)
    nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
    nextPosition.layout = activeTetromino.layout
    nextPosition.colour = activeTetromino.colour //can i do this all at once? 
    if (movement === 'move down'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + gameGrid.width
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
      for (let i = 0; i < activeTetromino.layout.length; i++) { // add a while loop that moves over if block class is can incorporate rotate value? 
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
        activeTetromino.spawn(gameGrid)
        //clearedLine() 
        //gameOver()
        activeTetromino.layout = tetrominoQueue[0].layout //swap?
        activeTetromino.colour = tetrominoQueue[0].colour
        activeTetromino.TLSpawnPosition = newTetrominoSpawnCell
        //activeTetromino = tetrominoQueue[0] 
        tetrominoQueue.push(randomTetromino())
        tetrominoQueue.shift()
      }
    }
    activeTetromino.spawn(gameGrid)
  }

  //GAME MECHANICS
  //clearing lines
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

  //gravity
  let gameLoopIntervalTime = 1000 * 1
  function gravity() {
    setInterval(() => {
      movement('move down')
    }, gameLoopIntervalTime)
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








  //TEST
  //activeTetromino.spawn(gameGrid)
  //gravity()




}
window.addEventListener('DOMContentLoaded', init)