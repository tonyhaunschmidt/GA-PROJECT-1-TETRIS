function init() {
  //FUNCTIONS & GAMEPLAY
  const levelBrackets = [10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 650, 750, 850]
  const levelSpeeds = [1000, 800, 700, 600, 500, 450, 400, 350, 300, 250, 200, 150, 100]

  const playerOne = {
    score: 0,
    level: 0,
    linesCleared: [],
    comboCount: 0,
    scoreSpan: document.getElementById('playerOneScore'),
    levelSpan: document.getElementById('playerOneLevel'),
  }

  function updateScore(player){
    if (player.linesCleared[0] === 4){
      player.score += (800 * (player.level + 1))
      player.comboCount += 1
    } else if (player.linesCleared[0] === 3){
      player.score += (500 * (player.level + 1))
      player.comboCount += 1
    } else if (player.linesCleared[0] === 2){
      player.score += (300 * (player.level + 1))
      player.comboCount += 1
    } else if (player.linesCleared[0] === 1){
      player.score += (100 * (player.level + 1))
      player.comboCount += 1
    } else if (player.linesCleared[0] === 0){
      if (player.comboCount > 1){
        player.score += (50 * (player.comboCount - 1) * (player.level + 1))
      }
      player.comboCount = 0
    }
    currentLevel(player)
    player.scoreSpan.innerText = player.score
    player.levelSpan.innerText = player.level
  }
  function currentLevel(player){
    const totalLinesCleared = player.linesCleared.reduce((sum, lines) => sum + lines, 0)
    for (let i = 0; i < levelBrackets.length; i++){
      if (totalLinesCleared > levelBrackets[i]){
        console.log(totalLinesCleared)
        player.level = i + 1
      }
    }
  }
  function setIntervalTime(player) {
    return levelSpeeds[player.level]
  }
  function gravity(tetromino, speed) {
    setInterval(() => {
      tetromino.move('down')
    }, speed)
  }
  function holdTetromino(activeTet, nextTetOne, nextTetTwo, holdTet){
    if (holdTet.current.name === ''){
      holdTet.adopt(activeTet, 'despawn')
      activeTet.adopt(nextTetOne, 'despawn')
      activeTetromino.nextInQueue()
    } else {
      activeTet.swap(holdTet)
    }
  }

  function gameOver(){

  }



  //--GRIDS--//
  // & IN-GRID FUNCTIONALITY //
  class Grid{
    constructor(div, width, height, newTetrominoSpawnCell, fullBorder, player){
      this.div = div
      this.width = width
      this.height = height
      this.cellCount = this.width * this.height
      this.cells = []
      this.newTetrominoSpawnCell = newTetrominoSpawnCell
      this.cellsToChange = []
      this.fullBorder = fullBorder
      this.lines = []
      this.player = player
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
    setLines(){
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
        if (colour === 'shadow'){
          this.cells[this.cellsToChange[i]].classList.add('shadow')
        } else {
          this.cells[this.cellsToChange[i]].classList.add('block')
        }
        const innerCell = document.createElement('div')
        innerCell.classList.add(colour)
        this.cells[this.cellsToChange[i]].appendChild(innerCell)
      }
      this.cellsToChange = [] 
    }
    removeBlocks(shadow){
      for (let i = 0; i < this.cellsToChange.length; i++){
        if (shadow === 'shadow'){
          this.cells[this.cellsToChange[i]].classList.remove('shadow')
        } else {
          this.cells[this.cellsToChange[i]].classList.remove('block')
        }
        this.cells[this.cellsToChange[i]].removeChild(this.cells[this.cellsToChange[i]].childNodes[0])
      }
      this.cellsToChange = []
    }
    clearLine(){
      this.setLines()
      let lineCounter = 0 
      for (let i = 1; i < this.lines.length - 1; i++){
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
      this.player.linesCleared.unshift(lineCounter)  // `````````````````````````````````````````````````````````````````````
      console.log(this.player.linesCleared)
      updateScore(this.player)
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
    gameOverCheck(){
      this.setLines()
      const secondLine = this.lines[1]
      secondLine.pop()
      secondLine.shift()
      if (secondLine.some(cell => this.cells[cell].classList.contains('block'))){
        window.alert('--GAMEOVER--')
      }
    }
  }

  //GAME GRID AND SIDE GRIDS//
  const gameGrid  = new Grid(document.querySelector('.game-grid'), 12, 21, 5, false, playerOne)
  const qGrid  = new Grid(document.querySelector('.tetromino-queue'), 6, 10, 13, true, playerOne)
  const holdGrid  = new Grid(document.querySelector('.tetromino-hold'), 6, 10, 13, true, playerOne)
  gameGrid.generateGrid()
  qGrid.generateGrid()
  holdGrid.generateGrid()


  //--TETROMINOES--//
  // & TETROMINO FUNCTIONALITY //
  class Tetromino {                                                      
    constructor(name, layout = [], colour = '', grid, nextTetOne, nextTetTwo, heldTet, shadowOption = false){ 
      this.blocked = false
      this.nextTetOne = nextTetOne
      this.nextTetTwo = nextTetTwo
      this.heldTet = heldTet
      this.shadowOption = shadowOption
      this.current = {
        name: name,
        layout: layout,
        colour: colour,
        cellPositions: [],
        rotation: 0,
        grid: grid,
        TLSpawnPosition: grid.newTetrominoSpawnCell,
        shadow: [],
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
        this.current.grid.gameOverCheck()
        this.current.TLSpawnPosition = this.current.grid.newTetrominoSpawnCell
        this.adopt(this.nextTetOne)
        this.nextInQueue()
        //updateScore()
        //this.castShadow()

      } else {
        this.confirmMovement()
      }
    }
    rotate(rotations){
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
      //console.log(`after rotating layout=> ${this.next.rotation}`)
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
      //console.log(`just before checks=> ${this.next.rotation}`)
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
    swap(tetromino){ // add replace/swap movement check
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
      //this.castShadow()
    }
    adopt(tetromino, despawn){ // add replace/swap movement check
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
      //this.castShadow()
    }
    movementCheck(){ 
      this.blocked = false
      this.despawn()
      for (let i = 0; i < this.next.cellPositions.length; i++){ //change to some array
        if (this.next.grid.cells[this.next.cellPositions[i]].classList.contains('block')){
          this.blocked = true
        }
      }
      this.spawn(this.current.colour)
      //this.castShadow()
    }
    //PUT ROTATE & SWAP FUNCTION HERE? 
    confirmMovement(){        /// go thorugh these to see if they can be cut down or just do current = next etc. 
      if (this.blocked === false){
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
        this.castShadow()
      } else {
        this.next.cellPositions = []
        this.next.layout = this.current.layout
        this.next.name = this.current.name
        this.next.TLSpawnPosition = this.current.TLSpawnPosition
        this.next.rotation = this.current.rotation
        
      }
      this.blocked = false
    }
    nextInQueue(){
      randomiseTetromino(this.nextTetTwo)
      this.nextTetOne.adopt(this.nextTetTwo, 'despawn')
    }
    castShadow(){
      if (this.shadowOption === true){

        this.despawn()
        this.current.grid.cellsToChange = this.current.shadow
        this.current.grid.removeBlocks('shadow') 
    
        this.current.shadow = this.current.cellPositions
    
        while (!this.current.shadow.some(cell => this.current.grid.cells[cell + this.current.grid.width].classList.contains('block'))){
          this.current.shadow = this.current.shadow.map(cell => cell + this.current.grid.width)      
        }
        this.spawn()
        this.current.grid.cellsToChange = this.current.shadow
        this.current.grid.addBlocks('shadow')
      }
    }
  }

      
    

  //TETROMINO TYPES//
  const ITetromino = new Tetromino('I Tetromino', [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], 'lightBlue', gameGrid)
  const OTetromino = new Tetromino('O Tetromino', [[1, 1],[1, 1]], 'yellow', gameGrid)
  const TTetromino = new Tetromino('T Tetromino', [[1, 1, 1], [0, 1, 0], [0, 0, 0]], 'purple', gameGrid)
  const JTetromino = new Tetromino('J Tetromino', [[1, 1, 1], [0, 0, 1], [0, 0, 0]], 'darkBlue', gameGrid)
  const LTetromino = new Tetromino('L Tetromino', [[1, 1, 1], [1, 0, 0], [0, 0, 0]], 'orange', gameGrid)
  const STetromino = new Tetromino('S Tetromino', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green', gameGrid)
  const ZTetromino = new Tetromino('Z Tetromino', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red', gameGrid)

  const tetrominoTypes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino] 
  
  //TETROMINO RANDOMS
  function randomTetromino(grid, nextTetOne, nextTetTwo, heldTet){
    const randomTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)]
    return new Tetromino(randomTetrominoType.current.name, randomTetrominoType.current.layout, randomTetrominoType.current.colour, grid, nextTetOne, nextTetTwo, heldTet)
  }

  function randomiseTetromino(tetromino) {
    const random = randomTetromino(tetromino.current.grid)
    tetromino.current.name = random.current.name
    tetromino.current.layout = random.current.layout
    tetromino.current.colour = random.current.colour
  }
  

  //TETROMINO QUEUE//   -have a look at refactoring 
  const queuedTetrominoOne = randomTetromino(qGrid)
  const queuedTetrominoTwo = randomTetromino(qGrid)
  
  //TETROMINO ON HOLD//
  const tetrominoHeld = new Tetromino('', [], '', holdGrid) 
  //tetrominoHeld.TLSpawnPosition = holdGrid.width + 4 // can this be better? having to set spawn position after creating
  
  //IN-PLAY TETROMINO//
  const activeTetromino = randomTetromino(gameGrid, queuedTetrominoOne, queuedTetrominoTwo, tetrominoHeld, true)

 




  

  
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
      mainMenuTetromino.move('left')
    } else if (key === right){
      activeTetromino.move('right')
      mainMenuTetromino.move('right')
    } else if (key === up){
      activeTetromino.rotate(1) //add a rotate(3) for opposite rotation
    } else if (key === down){
      activeTetromino.move('down')
      mainMenuTetromino.move('down')
      //console.log('sesd')
    } else if (key === space){
      holdTetromino(activeTetromino, queuedTetrominoOne, queuedTetrominoTwo, tetrominoHeld)
      
    } 
  }
  document.addEventListener('keydown', handleKeyDown)


//NewGame
  //activeTetromino.spawnNew()
  //queuedTetrominoOne.spawnNew()
  //gravity(activeTetromino, setIntervalTime(playerOne))
  



  //MENUS AND OTHERS//--------------------
  const holder = new Grid(document.querySelector('.main-menu-grid'), 18, 30, 43, true, playerOne)
  const mainMenuGrid = new Grid(document.querySelector('.main-menu-grid'), 18, 30, 25, true, playerOne)
  mainMenuGrid.generateGrid()

  const T = new Tetromino('T', [[1, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 0], [0, 1, 1, 0]], 'purple', mainMenuGrid)
  const E = new Tetromino('E', [[1, 1, 1], [1, 1, 0], [1, 1, 1], [1, 1, 0], [1, 1, 1]], 'green', mainMenuGrid)
  const T2 = new Tetromino('T2', [[1, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 0], [0, 1, 1, 0]], 'darkBlue', mainMenuGrid)
  const R = new Tetromino('R', [[1, 1, 1], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 0, 1]], 'yellow', mainMenuGrid)
  const I = new Tetromino('I', [[1, 1], [1, 1], [1, 1],[1, 1]], 'lightBlue', mainMenuGrid)
  const S = new Tetromino('S', [[0, 1, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0]], 'red', mainMenuGrid)

  const blank = new Tetromino('blank', [], '', holder)
  const menuTetrominoTwo = new Tetromino('I', [[0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1],[0, 0, 1, 1]], 'lightBlue', holder)
  const mainMenuTetromino = new Tetromino('S', [[0, 1, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0]], 'red', mainMenuGrid, menuTetrominoTwo)
  
  function startLetters(){
    setInterval(() => {
      if (mainMenuTetromino.current.name === 'S'){
        menuTetrominoTwo.adopt(I)
      } else if (mainMenuTetromino.current.name === 'I'){
        menuTetrominoTwo.adopt(R)
      } else if (mainMenuTetromino.current.name === 'R'){
        menuTetrominoTwo.adopt(T2)
      } else if (mainMenuTetromino.current.name === 'T2'){
        menuTetrominoTwo.adopt(E)
      } else if (mainMenuTetromino.current.name === 'E'){
        menuTetrominoTwo.adopt(T)
      } else if (mainMenuTetromino.current.name === 'T'){
        menuTetrominoTwo.adopt(blank)
      }else {
        menuTetrominoTwo.current.display = []
      }
    }, 100)
  }

  //MAIN-MENU PLAY//
  mainMenuTetromino.spawnNew()
  gravity(mainMenuTetromino, 200)
  startLetters()





}
window.addEventListener('DOMContentLoaded', init)