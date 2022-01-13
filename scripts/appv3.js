function init() {

  //GAME STATS  -make this object??
  //score
  //time


  //SETTING THE GRIDS//
  //ADDING/REMOVE BLOCK METHODS//
  //CLEAR LINE FUNCTIONALITY//
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
      this.lines = []
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
    }
    generateBorder(){ 
      for (let i = 0; i < this.cellCount; i++){
        if (i % this.width === 0 || i % this.width === this.width - 1 || i > this.cellCount - this.width){
          this.cellsToChange.push(i)
        } else if (this.fullBorder === true && i < this.width){
          this.cellsToChange.push(i)
        }
      }
      this.addBlocks('grey')
    }
    SetLines(){
      this.lines = []
      for (let i = 0; i < this.height; i++){
        this.lines.push([])
        for (let j = 0; j < this.width - 1; j++){
          this.lines[i].push((i * this.width) + j)
        }
      }
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
    clearLine(){
      this.SetLines()
      let lineCounter = 0 //move this to game stats in an array and then refactor the bottom of this for the blocks dropping
      for (let i = 1; i < this.lines.length - 1; i++){
        //const lineCheck = []
        //for (let j = 1; j < this.width - 1; j++){
        //  lineCheck.push(this.cells[(this.lines[i][j])].classList.contains('block'))
        //}
        //if (lineCheck.every(cell => cell === true)){ //-clearing line
        if (this.lines[i].every(cell => this.cells[cell].classList.contains('block'))){
          for (let j = 1; j < this.width - 1; j++){
            this.cellsToChange.push(this.lines[i][j])
          }
          lineCounter ++
          if (lineCounter === 4){
            console.log('--TETRIS--')
          }
        }         
      }
      let lowestClearedCell = this.cellsToChange[0] 
      this.removeBlocks()   //switch removeBlock out for an animation?
      for (let i = lineCounter; i > 0; i --){
        for (let j = lowestClearedCell - 3; j > 0; j--){
          if (j % this.width !== 0 && j % this.width !== this.width - 1 && this.cells[j].classList.contains('block')){
            const colour = this.cells[j].childNodes[0].classList
            this.cellsToChange.push(j)
            this.removeBlocks()
            this.cellsToChange.push(j + this.width)
            this.addBlocks(colour)
          }
        }
        lowestClearedCell += this.width
      }
    }
    gameOver(){
      this.SetLines()
      const firstLine = this.lines[0]
      firstLine.pop()
      firstLine.shift()
      console.log(firstLine)
      if (firstLine.some(cell => this.cells[cell].classList.contains('block'))){
        window.alert('--GAME OVER--') //CHANGE ONCE GAME IS FINISHED
      }
    }
  }
  const gameGrid  = new Grid(document.querySelector('.game-grid'), 12, 21, 5)
  const qGrid  = new Grid(document.querySelector('.tetromino-queue'), 10, 6, 25, true)
  const holdGrid  = new Grid(document.querySelector('.tetromino-hold'), 10, 6, 25, true)
  gameGrid.generateGrid()
  qGrid.generateGrid()
  holdGrid.generateGrid()


  //TETROMINOES//
  class Tetromino {                                                      
    constructor(name, layout = [], colour = '', grid, nextTetOne, nextTetTwo, heldTet){ 
      this.active = false
      this.blocked = false
      this.nextTetOne = nextTetOne
      this.nextTetTwo = nextTetTwo
      this.heldTet = heldTet
      this.current = {
        name: name,
        layout: layout,
        colour: colour,
        cellPositions: [],
        rotation: 0,
        grid: grid,
        TLSpawnPosition: grid.newTetrominoSpawnCell,
        
      }
      this.next = {
        name: name,
        layout: layout,
        colour: colour,
        cellPositions: [],
        rotation: 0,
        grid: grid,
        TLSpawnPosition: grid.newTetrominoSpawnCell,
      }
      
      //this.shadow = {
      //  name: name,
      //  layout: layout,
      //  colour: colour,
      //  cellPositions: [],
      //  rotation: 0,
      //  grid: gameGrid,
      //} 
      //this.TLSpawnPosition = this.current.grid.newTetrominoSpawnCell
    }
    spawn() {
      this.current.grid.cellsToChange = this.current.cellPositions
      this.current.grid.addBlocks(this.current.colour)
    }
    despawn() {
      this.current.grid.cellsToChange = this.current.cellPositions
      this.current.grid.removeBlocks()
    }
    spawnNew(){
      this.current.cellPositions = []
      let cellRender = this.current.TLSpawnPosition
      for (let i = 0; i < this.current.layout.length; i++){
        for (let j = 0; j < this.current.layout.length; j++){
          if (this.current.layout[i][j] === 1){
            this.current.cellPositions.push(cellRender)
          }        
          cellRender ++
        }
        cellRender += (this.current.grid.width - this.current.layout.length)
      }
      if (this.current.name === 'I Tetromino'){
        this.current.cellPositions = this.current.cellPositions.map(cell => cell - (this.current.grid.width * 2))
      }
      this.spawn()
    }
    move(movement){
      if (movement === 'down'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell + this.current.grid.width)
        this.next.TLSpawnPosition = this.current.TLSpawnPosition + this.current.grid.width
        console.log(`next=> ${this.next.cellPositions}`)
        console.log(`current=> ${this.current.cellPositions}`)
      }
      if (movement === 'left'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell - 1)
        this.next.TLSpawnPosition = this.current.TLSpawnPosition - 1
      }
      if (movement === 'right'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell + 1)
        this.next.TLSpawnPosition = this.current.TLSpawnPosition + 1
      }
      this.movementCheck()
      if (movement === 'down' && this.blocked === true){ //LANDING
        this.current.grid.clearLine()
        this.current.grid.gameOver()
        this.current.TLSpawnPosition = this.current.grid.newTetrominoSpawnCell
        //this.next.TLSpawnPosition = this.current.TLSpawnPosition
        this.adopt(this.nextTetOne)
        

      } else {
        this.confirmMovement()
      }
    }
    rotate(rotations){
      console.log(`current=> ${this.next.rotation}`)
      //rotating the layout                   //happy with this
      while (rotations > 0){
        const rotatedLayout = []
        for (let i = 0; i < this.current.layout.length; i++) {
          rotatedLayout.push([])
          for (let j = 0; j < this.current.layout.length; j++) {
            rotatedLayout[i].unshift(this.next.layout[j][i])
          }
        }
        this.next.layout = rotatedLayout
        this.next.rotation = (this.next.rotation + 1) % 4
        rotations --
      } 
      console.log(`after rotating layout=> ${this.next.rotation}`)
      /// getting cell positions (next)                //happy with this
      let cellRender = this.current.TLSpawnPosition
      for (let i = 0; i < this.next.layout.length; i++){
        for (let j = 0; j < this.next.layout.length; j++){
          if (this.next.layout[i][j] === 1){
            this.next.cellPositions.push(cellRender)
          }        
          cellRender ++
        }
        cellRender += (this.current.grid.width - this.next.layout.length)
      }
      console.log(`just before checks=> ${this.next.rotation}`)
      //checking if it can move there
      this.movementCheck()  // can maybe add all of below to the check function // or new function?? should be able to apply too for swaping
      if (this.blocked === false){
        this.confirmMovement() // take confirm movements out and move them to bottom? 
      } else if (this.current.rotation === 3){
        this.next.cellPositions = this.next.cellPositions.map(cell => cell - 1)
        this.next.TLSpawnPosition = this.current.TLSpawnPosition - 1
        this.movementCheck()
        if (this.block === false){
          this.confirmMovement()
        } else if (this.next.name === 'I Tetromino'){
          this.next.cellPositions = this.next.cellPositions.map(cell => cell - 2)
          this.next.TLSpawnPosition = this.current.TLSpawnPosition - 2
          this.movementCheck
          this.confirmMovement

        }
      } else if (this.current.rotation === 1){
        this.next.cellPositions = this.next.cellPositions.map(cell => cell + 1)
        this.next.TLSpawnPosition = this.current.TLSpawnPosition + 1
        this.movementCheck()
        if (this.blocked === false){
          this.confirmMovement()
        } else if (this.next.name === 'I Tetromino'){
          this.next.cellPositions = this.next.cellPositions.map(cell => cell + 2)
          this.next.TLSpawnPosition = this.current.TLSpawnPosition + 2
          this.movementCheck
          this.confirmMovement
        }
      }
    }
    swap(tetromino){ // not quite working? also needs to add check parameters
      this.despawn()
      tetromino.despawn()
      tetromino.next.name = this.current.name
      tetromino.next.layout = this.current.layout
      tetromino.next.colour = this.current.colour
      this.next.name = tetromino.current.name
      this.next.layout = tetromino.current.layout
      this.next.colour = tetromino.current.colour
      tetromino.current.name = tetromino.next.name
      tetromino.current.layout = tetromino.next.layout
      tetromino.current.colour = tetromino.next.colour
      this.current.name = this.next.name
      this.current.layout = this.next.layout
      this.current.colour = this.next.colour
      this.spawnNew()
      tetromino.spawnNew()
    }
    adopt(tetromino, despawn){ // not quite working? also needs to add check parameters
      if (despawn === 'despawn'){
        this.despawn()
      }
      this.next.name = tetromino.current.name
      this.next.layout = tetromino.current.layout
      this.next.colour = tetromino.current.colour
      this.current.name = this.next.name
      this.current.layout = this.next.layout
      this.current.colour = this.next.colour
      this.spawnNew()
    }
    movementCheck(){ 
      this.blocked = false
      console.log(this.next.cellPositions)
      console.log(this.current.TLSpawnPosition)
      this.despawn()
      for (let i = 0; i < this.next.cellPositions.length; i++){ //change to some array
        if (this.next.grid.cells[this.next.cellPositions[i]].classList.contains('block')){
          this.blocked = true
        }
      }
      this.spawn(this.current.colour)
    }
    //PUT ROTATE & SWAP FUNCTION HERE? 
    confirmMovement(){        /// go thorugh these to see if they can be cut down or just do current = next etc. 
      if (this.blocked === false){
        console.log('movement confirmed')
        console.log(this.next.cellPositions)
        console.log(this.next.TLSpawnPosition)
        this.despawn()
        this.current.cellPositions = this.next.cellPositions
        this.current.rotation = this.next.rotation
        this.current.layout = this.next.layout
        this.current.name = this.next.name
        this.current.TLSpawnPosition = this.next.TLSpawnPosition
        this.spawn(this.current.colour)
        this.next.cellPositions = []
        this.next.layout = this.current.layout
        this.next.name = this.current.name
        this.next.TLSpawnPosition = this.current.TLSpawnPosition
      } else {
        console.log('movement blocked')
        console.log(this.next.cellPositions)
        console.log(this.next.TLSpawnPosition)
        this.next.cellPositions = []
        this.next.layout = this.current.layout
        this.next.name = this.current.name
        this.next.TLSpawnPosition = this.current.TLSpawnPosition
        this.next.rotation = this.current.rotation
        
      }
      this.blocked = false
      //console.log(this.current)
    }
  }
    //rotationAndSwapCheck(movement){
    //  console.log(this.blocked)
    //  console.log(movement === 'rotate' || movement === 'swap')
    //  console.log(this.next.rotation)
    //  console.log(this.next.rotation === 3)

    //  if (this.blocked === true && (movement === 'rotate' || movement === 'swap') && this.current.rotation === 3){ //and rotate position
    //    this.next.cellPositions = this.current.cellPositions.map(cell => cell - (this.current.grid.width * 1) - 1)
    //    this.TLSpawnPosition = this.TLSpawnPosition - (this.current.grid.width * 1) - 1
    //    this.movementCheck()
    //    console.log('second check after movements')
    //  } else {
    //    //console.log('blocked')
    //    //console.log(this.blocked)
    //    this.next.cellPositions = this.current.cellPositions
    //    this.next.rotation = this.current.rotation
    //    this.next.layout = this.current.layout
    //    this.next.colour = this.current.colour
    //    this.next.name = this.current.name
    //    this.next.TLSpawnPosition = this.current.TLSpawnPosition
    
        //console.log(this.current.TLSpawnPosition)
        //console.log(this.next.TLSpawnPosition)
        //console.log(this.current.rotation)
      
    

      


    
    
      
    
    //adopt(tetromino, layout, rotation, cellPositions, TLSpawnPosition, colour){
    //  if (layout === true){
    //    this.layout = tetromino.layout
    //  }
    //  if (rotation === true){
    //    this.rotation = tetromino.rotation
    //  }
    //  if (cellPositions === true){
    //    this.cellPositions = tetromino.cellPositions
    //  }
    //  if (TLSpawnPosition === true){
    //    this.TLSpawnPosition = tetromino.TLSpawnPosition
    //  }
    //  if (colour === true){
    //    this.colour = tetromino.colour
    //  }
    //}


  //TETROMINO TYPES//
  const ITetromino = new Tetromino('I Tetromino', [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], 'lightBlue', gameGrid)// can maybe get rid of name for all tetrominoes objects
  const OTetromino = new Tetromino('O Tetromino', [[1, 1],[1, 1]], 'yellow', gameGrid)
  const TTetromino = new Tetromino('T Tetromino', [[1, 1, 1], [0, 1, 0], [0, 0, 0]], 'purple', gameGrid)
  const JTetromino = new Tetromino('J Tetromino', [[1, 1, 1], [0, 0, 1], [0, 0, 0]], 'darkBlue', gameGrid)
  const LTetromino = new Tetromino('L Tetromino', [[1, 1, 1], [1, 0, 0], [0, 0, 0]], 'orange', gameGrid)
  const STetromino = new Tetromino('S Tetromino', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green', gameGrid)
  const ZTetromino = new Tetromino('Z Tetromino', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red', gameGrid)

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino] 
  
  function randomTetromino(grid, nextTetOne, nextTetTwo, heldTet){
    const randomTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
    return new Tetromino(randomTetrominoType.current.name, randomTetrominoType.current.layout, randomTetrominoType.current.colour, grid, nextTetOne, nextTetTwo, heldTet)
  }
  
  

  
  //TETROMINO QUEUE//   -have a look at refactoring 
  const queuedTetrominoOne = randomTetromino(qGrid)
  ///queuedTetrominoOne.TLSpawnPosition = qGrid.width + 2//these especially will need refactoring for change size of screen
  const queuedTetrominoTwo = randomTetromino(qGrid)
  //queuedTetrominoTwo.TLSpawnPosition = qGrid.width + 6
  //queuedTetrominoOne.spawn(qGrid)
  //queuedTetrominoTwo.spawn(qGrid)
  
  //function nextInQueue(){
  //  queuedTetrominoOne.despawn(qGrid) 
  //  queuedTetrominoTwo.despawn(qGrid)
  //  queuedTetrominoOne.adopt(queuedTetrominoTwo, true, false, false, false, true)
  //  const queuedTetrominoThree = randomTetromino('Queued Tetromino 3')
  //  queuedTetrominoTwo.adopt(queuedTetrominoThree, true, false, false, false, true)
  //  queuedTetrominoOne.spawn(qGrid)
  //  queuedTetrominoTwo.spawn(qGrid)
  //}

  //TETROMINO ON HOLD//
  const tetrominoHeld = new Tetromino('', [], '', holdGrid) 
  //tetrominoHeld.TLSpawnPosition = holdGrid.width + 4 // can this be better? having to set spawn position after creating
  

  //IN-PLAY TETROMINO//
  const activeTetromino = randomTetromino(gameGrid, queuedTetrominoOne, queuedTetrominoTwo, tetrominoHeld)

 
  
 


  //FUNCTIONS & GAMEPLAY
  let gameLoopIntervalTime = 1000 * 1 //put this at the top //maybe move else where?

  function gravity() {
    setInterval(() => {
      activeTetromino.move('down')
    }, gameLoopIntervalTime)
  }

  function landed(activeTet, nextTetOne, nextTetTwo){
    activeTet.adopt(nextTetOne)
    nextInQueue(nextTetOne, nextTetTwo)
    //activeTet.current.grid.gameOver()
    activeTet.current.grid.clearLine()
  }

  function holdTetromino(activeTet, nextTetOne, nextTetTwo, holdTet){
    if (holdTet.current.name === ''){
      holdTet.adopt(activeTet, 'despawn')
      activeTet.adopt(nextTetOne, 'despawn')
      nextInQueue(nextTetOne, nextTetTwo)
    } else {
      activeTet.swap(holdTet)
    }
  }

  function nextInQueue(nextTetOne, nextTetTwo){
    //
  }



  //const playerOne = {
  //  activeTet: activeTetromino,
  //}



  //NewGame
  activeTetromino.spawnNew()
  queuedTetrominoOne.spawnNew()
  
  gravity()
  
  
  
  
  
  
  
  
  //CONTROL BOARD
  function handleKeyDown(e) {
    const key = e.keyCode
    const left = 37
    const right = 39
    const up = 38
    const down = 40
    const space = 32 // add different keys (number pad)(touch screen for phone?)
    
    if (key === left){
      activeTetromino.move('left')
    } else if (key === right){
      activeTetromino.move('right')
    } else if (key === up){
      activeTetromino.rotate(1) //add a rotate(3) for opposite rotation
    } else if (key === down){
      activeTetromino.move('down')
    } else if (key === space){
      holdTetromino(activeTetromino, queuedTetrominoOne, queuedTetrominoTwo, tetrominoHeld)
    } 
  }
  document.addEventListener('keydown', handleKeyDown)


}
window.addEventListener('DOMContentLoaded', init)