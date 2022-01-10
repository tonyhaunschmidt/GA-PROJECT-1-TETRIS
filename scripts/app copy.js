function init() {

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
  
  
  //TETROMINO QUEUE
  function randomTetromino() {
    return tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
  }
  const tetrominoQueue = [randomTetromino(), randomTetromino(), randomTetromino(), randomTetromino()]

  //IN-PLAY TETROMINO
  //const activeTetromino = new Tetromino(randomTetromino().layout, 0, [], newTetrominoSpawnCell, 'green')
  let activeTetromino = randomTetromino()
  const nextPosition = new Tetromino(activeTetromino.layout, 0, [], newTetrominoSpawnCell, activeTetromino.colour)
  const tetrominoShadow = new Tetromino()
  //tetrominoShadow.colour = 'grey'
  //for shadow- should be able to just play about with teh spawn position

  
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
      cellCheck += (gameGridWidth - nextPosition.layout.length)
    }
    return !clashCheckArray.some(cell => cell === 'clash')
  }

  function movement(movement){
    activeTetromino.despawn()
    //
    //nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
    if (movement === 'move down'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + gameGridWidth
      nextPosition.layout = activeTetromino.layout
    } else if (movement === 'move left'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition - 1
      nextPosition.layout = activeTetromino.layout
    } else if (movement === 'move right'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + 1
      nextPosition.layout = activeTetromino.layout
    } else if (movement === 'rotate'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition
      nextPosition.layout = []
      for (let i = 0; i < activeTetromino.layout.length; i++) { // add a while loop that moves over if block class is 
        nextPosition.layout.push([])
        for (let j = 0; j < activeTetromino.layout.length; j++) {
          nextPosition.layout[i].unshift(activeTetromino.layout[j][i])
        }
      }
    } else if (movement === 'swap'){
      const placeHolder = activeTetromino
      activeTetromino = tetrominoQueue[0]
      tetrominoQueue.unshift(placeHolder)
    }
    if (movementCheck(nextPosition)){
      activeTetromino.TLSpawnPosition = nextPosition.TLSpawnPosition
      activeTetromino.layout = nextPosition.layout 
    } else { 
      if (movement === 'move down') { //--TETROMINO LANDING--
        activeTetromino.spawn()
        clearedLine() 
        //gameOver()
        activeTetromino = tetrominoQueue[0] 
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


  //IN-PLAY TETROMINO 
  //change this to an object? 
  //class ATetromino {
  //  constructor(type = TTetromino, cellPositions = [], currentTLSpawnPosition = newTetrominoSpawnCell, nextTLSpawnPosition = newTetrominoSpawnCell, nextTypeAndRotation = []){
  //    this.type = type
  //    this.cellPositions = cellPositions
  //    this.currentTLSpawnPosition = currentTLSpawnPosition
  //    this.nextTLSpawnPosition = nextTLSpawnPosition
  //    this.nextTypeAndRotation = nextTypeAndRotation
  //  }
  //function spawn() {
  // let cellRender = active.TLSpawnPosition
  //  for (let i = 0; i < this.type.layout.length; i++){
  //    for (let j = 0; j < this.type.layout.length; j++){
  //      if (this.type.layout[i][j] === 1){
  //        gameGridCells[cellRender].classList.add('block')
  //        this.cellPositions.push(cellRender)
  //        const innerCell = document.createElement('div')
  //        innerCell.classList.add(this.type.colour)
  //        gameGridCells[cellRender].appendChild(innerCell)
  //      }        
  //      cellRender ++
  //    }
  //    cellRender += (gameGridWidth - this.type.layout.length)
  //  }
  //}
  //  despawn(){
  //    this.cellPositions = []
  //    let cellRender = this.currentTLSpawnPosition
  //    for (let i = 0; i < this.type.layout.length; i++){
  //      for (let j = 0; j < this.type.layout.length; j++){
  //        if (this.type.layout[i][j] === 1){ 
  //          gameGridCells[cellRender].classList.remove('block')
  //          gameGridCells[cellRender].removeChild(gameGridCells[cellRender].childNodes[0])
  //        }
  //        cellRender ++
  //      }
  //      cellRender += (gameGridWidth - this.type.layout.length)
  //    }
  //  }
  //  checkMovementClash(){
  //    const clashCheckArray = []
  //    let cellCheck = this.nextTLSpawnPosition
  //    for (let i = 0; i < this.nextTypeAndRotation.length; i++){
  //      for (let j = 0; j < this.nextTypeAndRotation.length; j++){
  //        if (this.nextTypeAndRotation[i][j] === 1 && gameGridCells[cellCheck].classList.contains('block')){
  //          clashCheckArray.push('clash')
  //        }        
  //        cellCheck ++
  //      }
  //      cellCheck += (gameGridWidth - this.type.layout.length) //does this need to be changed to nexttypeandrotation??
  //    }
  //    return !clashCheckArray.some(cell => cell === 'clash')
  //  }
  //  movement(movement){
  //    this.despawn()   
  //    if (movement === 'move down'){
  //      this.nextTLSpawnPosition = this.currentTLSpawnPosition + gameGridWidth
  //      this.nextTypeAndRotation = this.type.layout
  //    } else if (movement === 'move left'){
  //      this.nextTLSpawnPosition = this.currentTLSpawnPosition - 1
  //      this.nextTypeAndRotation = this.type.layout
  //    } else if (movement === 'move right'){
  //      this.nextTLSpawnPosition = this.currentTLSpawnPosition + 1
  //      this.nextTypeAndRotation = this.type.layout
  //    } else if (movement === 'rotate'){
  //      this.nextTLSpawnPosition = this.currentTLSpawnPosition
  //      this.nextTypeAndRotation = []
  //      for (let i = 0; i < this.type.layout.length; i++) { // add a while loop that moves over if block class is 
  //        this.nextTypeAndRotation.push([])
  //        for (let j = 0; j < this.type.layout.length; j++) {
  //          this.nextTypeAndRotation[i].unshift(this.type.layout[j][i])
  //        }
  //      }
  //    } else if (movement === 'swap'){ //need nextColour and for that to match up like the spawn position and layout. 
  //      this.nextTypeAndRotation = tetrominoes[Math.floor(Math.random() * tetrominoes.length)].layout //change from random to next in que
  //    }
  //    if (this.checkMovementClash()){
  //      this.currentTLSpawnPosition = this.nextTLSpawnPosition
  //      this.type.layout = this.nextTypeAndRotation
  //      
  //    } else { 
  //      if (movement === 'move down') { //--TETROMINO LANDING--
  //        this.spawn()
  //        this.clearedLine() 
  //        //gameOver()
  //        this.type = (tetrominoes[Math.floor(Math.random() * tetrominoes.length)])  //change from random to next in que
  //        this.currentTLSpawnPosition = newTetrominoSpawnCell
  //      }
  //    }
  //    this.spawn()
  //  }
  //  clearedLine() {
  //    let clearedLineCounter = 0
  //    const tetrominoLineNumbers = this.cellPositions.map(cell => Math.floor(cell / gameGridWidth))
  //    for (let i = 0; i < tetrominoLineNumbers.length; i++){
  //      const lineArray = [[], []]
  //      for (let j = 1; j < gameGridWidth - 1; j++){
  //        lineArray[0].push((gameGridWidth * tetrominoLineNumbers[i]) + j)
  //        lineArray[1].push(gameGridCells[(gameGridWidth * tetrominoLineNumbers[i]) + j].classList.contains('block'))
  //      }
  //      if (lineArray[1].every(cell => cell === true)){ //--CLEARED LINE--
  //        for (let j = 0; j < lineArray[0].length; j++){
  //          gameGridCells[lineArray[0][j]].classList.remove('block') 
  //          gameGridCells[lineArray[0][j]].removeChild(gameGridCells[lineArray[0][j]].childNodes[0])
  //        }
  //        clearedLineCounter ++
  //        for (let j = tetrominoLineNumbers[i] * gameGridWidth; j >= 0; j--){ //--DROPPING THE BLOCKS--
  //          if (j % gameGridWidth !== 0 && j % gameGridWidth !== gameGridWidth - 1 && gameGridCells[j].classList.contains('block')){
  //            gameGridCells[j].classList.remove('block')
  //            const colour = gameGridCells[j].childNodes[0].classList
  //            gameGridCells[j].removeChild(gameGridCells[j].childNodes[0])
  //            //add animation?? - on and off class with delay. 
  //            gameGridCells[j + gameGridWidth].classList.add('block')
  //            const innerCell = document.createElement('div')
  //            innerCell.classList.add(colour)
  //            gameGridCells[j + gameGridWidth].appendChild(innerCell)
  //          }
  //        }
  //      }
  //    }
  //    if (clearedLineCounter === 4){
  //      console.log('TETRIS')
  //    }
  //  }
  //}
  //const activeTetromino = new Tetromino() 
  
  
  

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
  let gameLoopIntervalTime = 1000 * 1

  function gameLoop() {
    setInterval(() => {
      movement('move down')
    }, gameLoopIntervalTime)
  }

  //TEST
  activeTetromino.spawn()
  gameLoop()


  //activeTetromino.type = tetrominoes[Math.floor(Math.random() * 7)]
  //activeTet.type = tetrominoes[1]
  //const dummyTet = new Tetromino(activeTetromino.type, [], activeTetromino.currentTLSpawnPosition + (gameGridWidth * 4))
  //dummyTet.spawn()
  //const dummyTet = activeTetromino
  //spawnTetromino(dummyTet, activeTLSpawnPosition + (gameGridWidth * 4) )
  //activeTetromino.spawn()
  //spawnTetromino(dummyTet)
  //spawnTetromino(dummyTet)
  //gameLoop()

  

}
window.addEventListener('DOMContentLoaded', init)