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
      this.SetLines()
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
      let lineCounter = 0 //move this to game stats in an array and then refactor the bottom of this for the blocks dropping
      for (let i = 1; i < this.lines.length - 1; i++){
        const lineCheck = []
        for (let j = 1; j < this.width - 1; j++){
          lineCheck.push(this.cells[(this.lines[i][j])].classList.contains('block'))
        }
        if (lineCheck.every(cell => cell === true)){ //-clearing line
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
      for (let i = lineCounter; i > 0; i --){ //CAN MAYBE MOVE FROM HERE DOWNWARDS TO BE ANOTHER METHOD FOR BLOCKS DROPPING. 
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
  }
  const gameGrid  = new Grid(document.querySelector('.game-grid'), 12, 21, 5)
  const qGrid  = new Grid(document.querySelector('.tetromino-queue'), 10, 6, 5, true)
  const holdGrid  = new Grid(document.querySelector('.tetromino-hold'), 10, 6, 5, true)
  gameGrid.generateGrid()
  qGrid.generateGrid()
  holdGrid.generateGrid()


  //TETROMINOES//
  class Tetromino {                                                      
    constructor(name, layout = [], colour = ''){ //maybe movecolour into a function below
      this.name = name
      this.layout = layout
      this.colour = colour
      // grid is a parameter in every method- change to parameter?
      this.active = false
      this.current = {
        cellPositions: [],
        rotation: 0,
      }
      this.next = {
        cellPositions: [],
        rotation: 0,
      }
      this.shadow = {
        cellPositions: [],
        rotation: 0,
      } 
      
      //this.layout = layout
      //this.rotation = 0 //DO I NEED THIS??
      //this.cellPositions = []
      //this.TLSpawnPosition = gameGrid.newTetrominoSpawnCell //will maybe need to change this to bottom position of qgrid// DO I NEED THIS? 
      //this.colour = colour
      //this.active = false
    }
    spawn(grid) {
      grid.cellsToChange = this.current.cellPositions
      grid.addBlocks(this.colour)
    }
    despawn(grid) {
      grid.cellsToChange = this.current.cellPositions
      grid.removeBlocks()
    }
    spawnNew(grid){
      this.current.cellPositions = []
      let cellRender = grid.newTetrominoSpawnCell
      for (let i = 0; i < this.layout.length; i++){
        for (let j = 0; j < this.layout.length; j++){
          if (this.layout[i][j] === 1){
            this.current.cellPositions.push(cellRender)
          }        
          cellRender ++
        }
        cellRender += (grid.width - this.layout.length)
      }
      this.spawn(grid)
    }
    move(movement, grid){
      if (movement === 'down'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell + grid.width)
      }
      if (movement === 'left'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell - 1)
      }
      if (movement === 'right'){
        this.next.cellPositions = this.current.cellPositions.map(cell => cell + 1)
      }
      if (movement === 'rotate'){
        this.next.rotation ++
        //const rotatedLayout = []
        //for (let i = 0; i < this.layout.length; i++) { // add a while loop that moves over if block class is can incorporate rotate value? 
        //  rotatedLayout.push([])
        //  for (let j = 0; j < this.layout.length; j++) {
        //    rotatedLayout[i].unshift(this.layout[j][i])
        //  }
        //}
        //console.log(rotatedLayout)
        let cellRender = this.current.cellPositions[0]
        for (let i = 0; i < this.rotatedLayout(this.next.rotation).length; i++){
          for (let j = 0; j < this.rotatedLayout(this.next.rotation).length; j++){
            if (this.rotatedLayout(this.next.rotation)[i][j] === 1){
              this.next.cellPositions.push(cellRender)
            }        
            cellRender ++
          }
          cellRender += (grid.width - this.layout.length)
        }
        console.log(this.next)
      }
      this.movementCheck(grid)
    }
    movementCheck(grid){ 
      console.log(this.next.cellPositions)//
      let blocked = false
      this.despawn(grid)
      for (let i = 0; i < this.next.cellPositions.length; i++){ //change to some array
        if (grid.cells[this.next.cellPositions[i]].classList.contains('block')){
          //if this.rotation = && name = //move and then recheck movement (recursion?)
          //else blocked
          blocked = true
          console.log(blocked) //
        }
      }
      this.spawn(grid, this.colour)
      if (blocked === false){
        this.confirmMovement(grid)
      }
    }
    confirmMovement(grid){
      this.despawn(grid)
      this.current.cellPositions = this.next.cellPositions
      this.spawn(grid, this.colour)
    }
    rotatedLayout(rotations){
      let nRotatedLayout = this.layout
      while (rotations > 0){
        const rotatedLayout = []
        for (let i = 0; i < nRotatedLayout.length; i++) { // add a while loop that moves over if block class is can incorporate rotate value? 
          rotatedLayout.push([])
          for (let j = 0; j < nRotatedLayout.length; j++) {
            rotatedLayout[i].unshift(nRotatedLayout[j][i])
          }
        }
        nRotatedLayout = rotatedLayout
        rotations --
      }
      return nRotatedLayout
    }
      

  }
    
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
  const ITetromino = new Tetromino('I Tetromino', [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], 'lightBlue')// can maybe get rid of name for all tetrominoes objects
  const OTetromino = new Tetromino('O Tetromino', [[1, 1],[1, 1]], 'yellow')
  const TTetromino = new Tetromino('T Tetromino', [[1, 1, 1], [0, 1, 0], [0, 0, 0]], 'purple')
  const JTetromino = new Tetromino('J Tetromino', [[0, 1, 0], [0, 1, 0], [1, 1, 0]], 'darkBlue')
  const LTetromino = new Tetromino('L Tetromino', [[0, 1, 0], [0, 1, 0], [0, 1, 1]], 'orange')
  const STetromino = new Tetromino('S Tetromino', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green')
  const ZTetromino = new Tetromino('Z Tetromino', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red')

  TTetromino.spawnNew(gameGrid)   // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  console.log(`afterNewspawn ${TTetromino.current.cellPositions}`)
  //TTetromino.move('down', gameGrid)
  TTetromino.rotatedLayout(2)
  console.log(TTetromino.next)

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino] 
  
  function randomTetromino(name){
    const randomTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
    return new Tetromino(name, randomTetrominoType.layout, randomTetrominoType.colour)
  }
  
  //IN-PLAY TETROMINO//
  const activeTetromino = randomTetromino('Active Tetromino')
  const nextPosition = new Tetromino('Next Position', activeTetromino.layout, activeTetromino.colour)

  //TETROMINO SHADOW//    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
  queuedTetrominoOne.spawn(qGrid)
  queuedTetrominoTwo.spawn(qGrid)
  
  function nextInQueue(){
    queuedTetrominoOne.despawn(qGrid) 
    queuedTetrominoTwo.despawn(qGrid)
    queuedTetrominoOne.adopt(queuedTetrominoTwo, true, false, false, false, true)
    const queuedTetrominoThree = randomTetromino('Queued Tetromino 3')
    queuedTetrominoTwo.adopt(queuedTetrominoThree, true, false, false, false, true)
    queuedTetrominoOne.spawn(qGrid)
    queuedTetrominoTwo.spawn(qGrid)
  }

  //TETROMINO ON HOLD//
  const tetrominoHeld = new Tetromino('Tetromino on Hold') 
  tetrominoHeld.TLSpawnPosition = holdGrid.width + 4 // can this be better? having to set spawn position after creating
  


  //MOVEMENT//
  function movementCheck(NextPositionOrShadow){ //changed nextPositoon to nextPositonOrShadow to help shadow function- return if not used. 
    NextPositionOrShadow.updateCellPositions(gameGrid)
    for (let i = 0; i < NextPositionOrShadow.cellPositions.length; i++){ //change to some array
      if (gameGrid.cells[NextPositionOrShadow.cellPositions[i]].classList.contains('block')){
        return false
      }
    }
    //then add for different shapes
    return true
  }

  function move(movement){
    activeTetromino.despawn(gameGrid)
    nextPosition.adopt(activeTetromino, true, false, false, true, true)
    if (movement === 'down'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition + gameGrid.width
    } else if (movement === 'left'){
      nextPosition.TLSpawnPosition = activeTetromino.TLSpawnPosition - 1
    } else if (movement === 'right'){
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
        nextPosition.adopt(queuedTetrominoOne, true, false, false, false, true)
      } else {
        nextPosition.adopt(tetrominoHeld, true, false, false, false, true)
      }
    }
    if (movementCheck(nextPosition)){
      if (movement === 'swap'){
        tetrominoHeld.despawn(holdGrid)
        tetrominoHeld.adopt(activeTetromino, true, false, false, false, true)
        tetrominoHeld.spawn(holdGrid)
      } 
      activeTetromino.adopt(nextPosition, true, false, false, true, true)
    } else {          //WHY IS THIS ELSE IF?
      if (movement === 'down') { //--TETROMINO LANDING-- // seperate function? 
        activeTetromino.spawn(gameGrid)
        gameGrid.clearLine()
        //gameOver()
        activeTetromino.adopt(queuedTetrominoOne, true, false, false, false, true)
        activeTetromino.TLSpawnPosition = gameGrid.newTetrominoSpawnCell
        nextInQueue() 
      } 
    }
    activeTetromino.spawn(gameGrid)
    //castShadow()
  }

  let gameLoopIntervalTime = 1000 * 1 //put this at the top
  function gravity() {
    setInterval(() => {
      //move('down')
      TTetromino.move('down', gameGrid)
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
      //move('left')
      TTetromino.move('left', gameGrid)
    } else if (key === right){
      //move('right')
      TTetromino.move('right', gameGrid)
    } else if (key === up){
      TTetromino.move('rotate', gameGrid)
      //move('rotate')  //change up to drop and have x & z for rotates in different directions (call rotate * 3)
    } else if (key === down){
      //move('down')
      TTetromino.move('down', gameGrid)
    } else if (key === space){
      move('swap')
    }
  }
  document.addEventListener('keydown', handleKeyDown)


  //PLAY GAME
  //activeTetromino.spawn(gameGrid)
  //gravity()



}
window.addEventListener('DOMContentLoaded', init)