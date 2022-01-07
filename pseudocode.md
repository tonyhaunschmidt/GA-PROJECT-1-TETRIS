set up gameGrid:
-gameGrid- queryselect for the grid <div>
-set const- gameGridWidth = ????
-set const- gameGridHeight = ?????
-set const- gameGridCellCount = gameGridWidth * gameGridHeight
-set const- gameGridCells = []


make Grid (function):
2- for (let i=0; i < gameGridCellCount; i++){
  cell = document.createElement('div')
  cell.inntext = i //keep during coding and then delete
  gameGrid.appendChild(cell)
  gameGridCells.push(cell)

  -set height of .grid div= (1/gameGridHeight)
  -set width of .grid div- (1/gameGridwidth)

}


define tetromino arrays:
ITetromino = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
OTetromino = [[1, 1],[1, 1]]
TTetromino = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
JTetromino = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
LTetromino = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
STetromino = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
ZTetromino = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]

Tetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]

spawn tetromino (function) arguments- have firstSpawnPostion (this will be used later for when you replace a tetromino)
1- chooses a random tetromino from tetrominoes array. //maybe move this out of this function later for creating a que
2- 
for (let i = 0; i < tetrominoes.randomTetromino.length; i++){
  for (let j = 0, j < tetrominoes.randomTetromino.length; j++){
    if (tetrominoes.randomTetromino[i][j] === 1){
      gameGridCells[firstSpawnPosition].classList.add('block')
    }
    firstSpawnPosition ++
  }
  firstSpawnPosition =+ gameGridWidth
}

this should run through the choice tetromino and add the block class where needed. 