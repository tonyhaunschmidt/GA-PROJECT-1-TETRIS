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
Despawn is the same except for removing the block class


These spawn & despawn functions will be used on pretty much every move of the game
  -we just need to change the start position and for rotations or switch of tetromino, we just change the tetromino argument. 



active Tetromino Status update (function)-- is this needed? 
-updates all the stats of the active tetromino- to be used just before spawning


MOVEMENT:
pattern for any movement
1- call despawnTetromino
2- call checkClash
2- Tetromino Status Update (tetromino & spawn position)
3 -Call spawnTetromino

// will also need a refresh of dummy and shadow if using. 

movedown (function)
1- call despawnTetromino
2- check clash function
3- spawn position += width
4- Call spawnTetromino

moveLeft (function)
1- call despawnTetromino
2- check clash function
3- spawn position --
4- Call spawnTetromino

moveRight (function)
1- call despawnTetromino
2- check clash function
3- spawn position ++
4- Call spawnTetromino

rotate (function)
1- call despawnTetromino
2- check clash function
3- rotate
4- Call spawnTetromino
//will need to move over if there is a clash!-- need to think about

checkClash (function)
 // could have a function that runs through all directions and if any will return a clash then return value 'left clash' and then when calling the function

  //have outside of whole grid have a block class- this way we will only need to check for block class
  //can we create a next postion array that passes through??
  //so instead of just moving the spawn postion- dummy move it and then run a dummy respawn that checks if any of the cells that the block class would be added to already has a block class. 



keys;
calls the movement functions



GAMELOOP:
move down



