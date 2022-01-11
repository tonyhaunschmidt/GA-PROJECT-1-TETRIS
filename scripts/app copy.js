function init() {

  //GAME STATS  -make this object??
  //score
  //time
  

  //SETTING THE GRIDS & ADD/REMOVE BLOCK METHODS//
  class Grid{
    constructor(div, width, height, newTetrominoSpawnCell, fullBorder){
      this.div = div
      this.width = width
      this.height = height
      this.cellCount = this.width * this.height
      this.cells = []
      this.newTetrominoSpawnCell = newTetrominoSpawnCell
      this.cellsToChange = []
      this.fullBorder = fullBorder
    }
    generateGrid(){
      for (let i = 0; i < this.cellCount; i++){
        const cell = document.createElement('div')
        cell.style.width = `${100 / this.width}%`//will need to play about with width and height to make it responsive
        cell.style.height = `${100 / this.height}%`
        this.div.appendChild(cell)
        this.cells.push(cell)  
      }
      this.generateBorder()
      this.addBlocks('grey')
    }
    addBlocks(colour){
      for (let i = 0; i < this.cellsToChange.length; i++){
        this.cells[this.cellsToChange[i]].classList.add('block')
        const innerCell = document.createElement('div')
        innerCell.classList.add(colour)
        this.cells[this.cellsToChange[i]].appendChild(innerCell)
      }
      this.cellsToChange = [] 
    }
    removeBlocks(){
      for (let i = 0; i < this.cellsToChange.length; i++){
        this.cells[this.cellsToChange[i]].classList.remove('block')
        this.cells[this.cellsToChange[i]].removeChild(this.cells[this.cellsToChange[i]].childNodes[0])
      }
      this.cellsToChange = []
    }
    generateBorder(){ 
      for (let i = 0; i < this.cellCount; i++){
        if (i % this.width === 0 || i % this.width === this.width - 1 || i > this.cellCount - this.width){
          this.cellsToChange.push(i)
        } else if (this.fullBorder === true && i < this.width){
          this.cellsToChange.push(i)
        }
      }
    }
  }
  const gameGrid  = new Grid(document.querySelector('.game-grid'), 12, 21, 5)
  gameGrid.generateGrid()
  const qGrid  = new Grid(document.querySelector('.tetromino-queue'), 10, 6, 5, true)
  qGrid.generateGrid()
  const holdGrid  = new Grid(document.querySelector('.tetromino-hold'), 10, 6, 5, true)
  holdGrid.generateGrid()
  



  //ADDING AND REMOVING BLOCK CELLS//
  //function addBlocks(grid, cellArray = [], colour){
  //  for (let i = 0; i < cellArray.length; i++){
  //    grid.cells[cellArray[i]].classList.add('block')
  //    const innerCell = document.createElement('div')
  //    innerCell.classList.add(colour)
  //    grid.cells[cellArray[i]].appendChild(innerCell)
  //  }
  //}
  //function removeBlocks(grid, cellArray = []){
  //  for (let i = 0; i < cellArray.length; i++){
  //    grid.cells[cellArray[i]].classList.remove('block')
  //    grid.cells[cellArray[i]].removeChild(grid.cells[cellArray[i]].childNodes[0])
  //  }
  //}
    
  //addBlocks(gameGrid, [1, 2, 5, 7, 8, 220], 'grey')
  //removeBlocks(gameGrid, [1, 2])

  

  //TETROMINOES//
  class Tetromino {                                                      
    constructor(name, layout = [], colour){
      this.name = name
      this.layout = layout
      this.rotation = 0 //DO I NEED THIS??
      this.cellPositions = []
      this.TLSpawnPosition = gameGrid.newTetrominoSpawnCell //will maybe need to change this to bottom position of qgrid// DO I NEED THIS? 
      this.colour = colour
    }
    updateCellPositions(grid){
      this.cellPositions = []
      let cellRender = this.TLSpawnPosition
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){
            this.cellPositions.push(cellRender)
          }        
          cellRender ++
        }
        cellRender += (grid.width - this.layout.length)
      }
    }
    spawn(grid) {
      this.updateCellPositions(grid)
      grid.cellsToChange = this.cellPositions
      grid.addBlocks(this.colour)
    }
    despawn(grid) {
      this.updateCellPositions(grid)
      grid.cellsToChange = this.cellPositions
      grid.removeBlocks()
    }
    //spawn(grid) {
    //  let cellRender = this.TLSpawnPosition
    //  for (let i = 0; i < this.layout.length; i++){
    //    for (let j = 0; j < this.layout.length; j++){
    //      if (this.layout[i][j] === 1){
    //        grid.cells[cellRender].classList.add('block')
    //        this.cellPositions.push(cellRender) //can maybe tidy up a bit??
    //        const innerCell = document.createElement('div')
    //        innerCell.classList.add(this.colour)
    //        grid.cells[cellRender].appendChild(innerCell)
    //      }        
    //      cellRender ++
    //    }
    //    cellRender += (grid.width - this.layout.length)
    //  }
    //}
    //despawn(grid){
    //  this.cellPositions = [] //if refactor- move to end i.e. updatecellposition(), remove classes, CP=[]
    //  let cellRender = this.TLSpawnPosition
    //  for (let i = 0; i < this.layout.length; i++){
    //    for (let j = 0; j < this.layout.length; j++){
    //      if (this.layout[i][j] === 1){ 
    //        grid.cells[cellRender].classList.remove('block')
    //        grid.cells[cellRender].removeChild(grid.cells[cellRender].childNodes[0])
    //      }
    //      cellRender ++
    //    }
    //    cellRender += (grid.width - this.layout.length)
    //  }
    //}
  }


  //TETROMINO TYPES//
  const ITetromino = new Tetromino('I Tetromino', [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], 'lightBlue')
  const OTetromino = new Tetromino('O Tetromino', [[1, 1],[1, 1]], 'yellow')
  const TTetromino = new Tetromino('T Tetromino', [[1, 1, 1], [0, 1, 0], [0, 0, 0]], 'purple')
  const JTetromino = new Tetromino('J Tetromino', [[0, 1, 0], [0, 1, 0], [1, 1, 0]], 'darkBlue')
  const LTetromino = new Tetromino('L Tetromino', [[0, 1, 0], [0, 1, 0], [0, 1, 1]], 'orange')
  const STetromino = new Tetromino('S Tetromino', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green')
  const ZTetromino = new Tetromino('Z Tetromino', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red')

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino] 
  
  function randomTetromino(name){
    const randomTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
    return new Tetromino(name, randomTetrominoType.layout, randomTetrominoType.colour)
  }
  
  //IN-PLAY TETROMINO//
  const activeTetromino = randomTetromino('Active Tetromino')
  const nextPosition = new Tetromino('Next Position', activeTetromino.layout, activeTetromino.colour)

  //TETROMINO SHADOW//
  const tetrominoShadow = new Tetromino('Tetromino Shadow', activeTetromino.layout, 'grey')
  function castShadow(){  
    tetrominoShadow.despawn(gameGrid)
    tetrominoShadow.layout = activeTetromino.layout  
    tetrominoShadow.TLSpawnPosition = activeTetromino.TLSpawnPosition
    //while (!movementCheck(tetrominoShadow)){ this isn't right-
    //  tetrominoShadow.TLSpawnPosition -= gameGrid.width
    //}
    tetrominoShadow.spawn(gameGrid)
  }
  

  //TETROMINO QUEUE//   -have a look at refactoring 
  const queuedTetrominoOne = randomTetromino('Queued Tetromino 1')
  queuedTetrominoOne.TLSpawnPosition = qGrid.width + 2//these especially will need refactoring for change size of screen
  const queuedTetrominoTwo = randomTetromino('Queued Tetromino 2')
  queuedTetrominoTwo.TLSpawnPosition = qGrid.width + 6
  queuedTetrominoOne.spawn(qGrid) // can maybe have this in a loop
  queuedTetrominoTwo.spawn(qGrid)
  function nextInQueue(){ //can surely make this into a loop- put objects in an array and run through
    queuedTetrominoOne.despawn(qGrid) 
    queuedTetrominoTwo.despawn(qGrid)
    queuedTetrominoOne.layout = queuedTetrominoTwo.layout
    queuedTetrominoOne.colour = queuedTetrominoTwo.colour
    const queuedTetrominoThree = randomTetromino('Queued Tetromino 3')
    queuedTetrominoTwo.layout = queuedTetrominoThree.layout
    queuedTetrominoTwo.colour = queuedTetrominoThree.colour
    queuedTetrominoOne.spawn(qGrid) // can maybe have this in a loop
    queuedTetrominoTwo.spawn(qGrid)
  }

  //TETROMINO ON HOLD//
  const tetrominoHeld = new Tetromino('Tetromino on Hold') 
  tetrominoHeld.TLSpawnPosition = holdGrid.width + 4
  
  //MOVEMENT//
  function movementCheck(NextPositionOrShadow){ //changed nextPositoon to nextPositonOrShadow to help shadow function- return if not used. 
    NextPositionOrShadow.cellPositions = []
    let cellCheck = NextPositionOrShadow.TLSpawnPosition
    for (let i = 0; i < NextPositionOrShadow.layout.length; i++){
      for (let j = 0; j < NextPositionOrShadow.layout.length; j++){
        if (NextPositionOrShadow.layout[i][j]){
          NextPositionOrShadow.cellPositions.push(cellCheck)
        }
        cellCheck ++  
      }
      cellCheck += (gameGrid.width) - NextPositionOrShadow.layout.length
      
      console.log(NextPositionOrShadow.cellPositions)
    }
    for (let i = 0; i < NextPositionOrShadow.cellPositions.length; i++){
      if (gameGrid.cells[NextPositionOrShadow.cellPositions[i]].classList.contains('block')){ //fix this
        return false
      }
    }
    //then add for different shapes
    return true
  }




  //function movementCheck(NextPositionOrShadow){ //changed nextPositoon to nextPositonOrShadow to help shadow function- return if not used. 
  //  const clashCheckArray = []
  //  let cellCheck = NextPositionOrShadow.TLSpawnPosition
  //  for (let i = 0; i < NextPositionOrShadow.layout.length; i++){
  //    for (let j = 0; j < NextPositionOrShadow.layout.length; j++){
  //      if (NextPositionOrShadow.layout[i][j] === 1 && gameGrid.cells[cellCheck].classList.contains('block')){
  //        clashCheckArray.push('clash')
  //      }        
  //      cellCheck ++
  //    }
  //    cellCheck += (gameGrid.width - nextPositionOrShadow.layout.length)
  //  }
  //  return !clashCheckArray.some(cell => cell === 'clash')
  //}

  function movement(movement){
    activeTetromino.despawn(gameGrid)
    nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
    nextPosition.layout = activeTetromino.layout
    nextPosition.colour = activeTetromino.colour //can i do this all at once? 
    if (movement === 'move down'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + gameGrid.width
    } else if (movement === 'move left'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition - 1
    } else if (movement === 'move right'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + 1
    } else if (movement === 'rotate'){ //need to solve for wall clash
      nextPosition.layout = []
      for (let i = 0; i < activeTetromino.layout.length; i++) { // add a while loop that moves over if block class is can incorporate rotate value? 
        nextPosition.layout.push([])
        for (let j = 0; j < activeTetromino.layout.length; j++) {
          nextPosition.layout[i].unshift(activeTetromino.layout[j][i])
        }
      }
    } else if (movement === 'swap'){// need to solve for wall clash
      if (tetrominoHeld.colour === ''){
        nextPosition.layout = queuedTetrominoOne.layout
        nextPosition.colour = queuedTetrominoOne.colour
      } else {
        nextPosition.layout = tetrominoHeld.layout
        nextPosition.colour = tetrominoHeld.colour
      }
    }
    if (movementCheck(nextPosition)){
      if (movement === 'swap'){
        tetrominoHeld.despawn(holdGrid)
        tetrominoHeld.layout = activeTetromino.layout
        tetrominoHeld.colour = activeTetromino.colour
        tetrominoHeld.spawn(holdGrid)
      } 
      activeTetromino.TLSpawnPosition = nextPosition.TLSpawnPosition
      activeTetromino.layout = nextPosition.layout
      activeTetromino.colour = nextPosition.colour
      
    } else { 
      if (movement === 'move down') { //--TETROMINO LANDING--
        activeTetromino.spawn(gameGrid)
        clearedLine() 
        //gameOver()
        activeTetromino.layout = queuedTetrominoOne.layout
        activeTetromino.colour = queuedTetrominoOne.colour
        activeTetromino.TLSpawnPosition = gameGrid.newTetrominoSpawnCell
        nextInQueue() 
      } 
    }
    activeTetromino.spawn(gameGrid)
    //castShadow()
  }

  //GAME MECHANICS
  //clearing lines
  function clearedLine() {
    let clearedLineCounter = 0
    const tetrominoLineNumbers = activeTetromino.cellPositions.map(cell => Math.floor(cell / gameGrid.width))
    for (let i = 0; i < tetrominoLineNumbers.length; i++){
      const lineArray = [[], []]
      for (let j = 1; j < gameGrid.width - 1; j++){
        lineArray[0].push((gameGrid.width * tetrominoLineNumbers[i]) + j)
        lineArray[1].push(gameGrid.cells[(gameGrid.width * tetrominoLineNumbers[i]) + j].classList.contains('block'))
      }
      if (lineArray[1].every(cell => cell === true)){ //--CLEARED LINE--
        for (let j = 0; j < lineArray[0].length; j++){
          gameGrid.cells[lineArray[0][j]].classList.remove('block') 
          gameGrid.cells[lineArray[0][j]].removeChild(gameGrid.cells[lineArray[0][j]].childNodes[0])
        }
        clearedLineCounter ++
        for (let j = tetrominoLineNumbers[i] * gameGrid.width; j >= 0; j--){ //--DROPPING THE BLOCKS--
          if (j % gameGrid.width !== 0 && j % gameGrid.width !== gameGrid.width - 1 && gameGrid.cells[j].classList.contains('block')){
            gameGrid.cells[j].classList.remove('block')
            const colour = gameGrid.cells[j].childNodes[0].classList
            gameGrid.cells[j].removeChild(gameGrid.cells[j].childNodes[0])
            //add animation?? - on and off class with delay. 
            gameGrid.cells[j + gameGrid.width].classList.add('block')
            const innerCell = document.createElement('div')
            innerCell.classList.add(colour)
            gameGrid.cells[j + gameGrid.width].appendChild(innerCell)
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







  //PLAY GAME
  activeTetromino.spawn(gameGrid)
  //gravity()



}
window.addEventListener('DOMContentLoaded', init)