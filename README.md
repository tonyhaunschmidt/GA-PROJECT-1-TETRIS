GA PROJECT 1- TETRIS
OPEN IN BROWSER
BRIEF
Using Vanilla HTML, CSS and JavaScript the assignment was to build a grid based game in one week. Wanting to challenge myself and seeing it as a big step up from what we covered in the lectures I decided to recreate the classic game, Tetris. This project really solidified my fundamental JavaScript and let me flex my logic based coding skills.

TIMEFRAME
7 Days

TECHNOLOGIES
HTML
CSS
JavaScript
OUTLINE
Tetris is a puzzle game where the player has to fit different shaped blocks (called Tetriminoes) together so that they make a complete line across the playing board. Once a line is achieved it is removed from the game board and the player's score is increased.

The player can move the Tetriminoes left and right and rotate them clockwise in 90º increments.

The aim of the game is to get as many points as possible before the game board is filled with Tetriminoes.

PLANNING
What we had learnt in class was to give a single-celled sprite movement around a board. The challenge for me was to develop this further to have multi-celled sprites, that can come in different shapes, have the same movement around the board as well as have the ability to rotate.

I had a lot of ideas and was very excited to start coding however instead, I initially spent time pseudo-coding and writing down all my initial thoughts. This was so that I could narrow down what problems there were to solve and to try to figure out the most optimal solution for each problem so it would then be easier to code when it came to it as well as helping me keep track of my ideas.

All my inital thoughts and notes are saved here.

For the initial planning stage, my focus was purely on problem solving and figuring out the game mechanics. It was hard to plan too far ahead as a large part of this project was experimenting with the grid and problem solving to acheive the MVP of the game.

In hindsight and maybe now that I am much more comfortable with the grid based logic and movement of multiple-celled sprites, I have learnt from not planning out a more vigurous detail of the basic MVP and all the extras I could then add afterwards. I feel that I fell into a bit of a refactoring loop during this project in which even before acheiving the full MVP I found myself refactoring most of my code to accomodate the next feature and additionally refactoring after I achieved the MVP to organise and reorganise my code. This unfortunately ate into my time and left me feeling not entirely satisfied with the final result.

THE GRID
The way that the grid is generated is by firstly selecting the grid container element from the DOM and defining it to a variable. I then defined the width and height of the grid in cells. My main Tetris gameplay grid is 12w x 21h in cells. I then used the height and width to calculate the entire cell count. Once I had the grid container DOM element and the cell count I simply ran a for loop in that for the count of cells, I created a cell div element and then appended it as a child to the grid container.

In addition, I wanted the cells to be easily accessable in my JavaScript so I could implement the gameplay. To do this I defined a variable called cells and set it to an empty array. In the same for loop above, I push each newly created DOM element variable into this array. This array of cells is very useful moving forward as you can then manipulate them by adding or removing a class or apending or removing a child element to each cell. This class or child element can be a representative of a sprite or game object that can then be programmed to move from cell to cell.

Finally in my CSS code I style both the grid container and the cells to appear visually in the game, with the most important properties appearing on the grid container being the display set to 'flex' and for the flex to wrap.

Initially my grid set up was a handful of variables and the function that ran the for loop as described above however, through my refactoring this eventually developed into having a grid class which was good because it allowed me to develop methods onto the class such as the generate grid function described above, generate border function which set the outside layer of the grid to grey blocks no matter the dimensions of the grid and also gave you the option to not border the top, as well as gameplay functionality used to check if there should be a game over, if a line should be cleared and to add or remove blocks. Obviously having a grid class made it very easy for me to add additional grids which you can see I did to acccomplish the next and held Tetromino containers, the interactive titlescreen and the different playing options.

grid class

THE TETROMINOES
There are 7 different Tetrominoes in the game Tetris. Each are composed of four blocks connected orthoogonally to create a unique shape from each other. Each have specific names based on letters of the alphabet indicitive of their shape.

I Tetromino
I Tetromino

O Tetromino
O Tetromino

T Tetromino
T Tetromino

J Tetromino
J Tetromino

L Tetromino
L Tetromino

S Tetromino
S Tetromino

Z Tetromino
Z Tetromino

A challenge was to figure out the best way to group the 4 blocks in terms of cells they occupy. This was so I can code their movement accross the board. My initial thoughts were to have an array of occupied cells.

tetromino thoughts 1

This would make it easy for me to move them left, right and down however I was struggling to think of a possible way in which to rotate them. I was very conciuos that I did not want to hard code different rotation algorithms for different shapes in different rotation positions and knew that I could figure out a way to code one solution that would work for all.

I soon realised that it would be much easier to program a rotation of a square containing a shape as opposed to having a rule that can rotate a collection of different shapes, and so the next development of my line of thought was to expand the array of cells and then my rotation algorithm can change which of these cells will be a block cell.

tetromino thoughts 2

This still didn't fully solve the rotation problem as I was still finding it difficult to think of an elegant algorithm that would work for all Tetromino shapes. One of the tricky aspects was that the square would not always be 3x3 as the I and O Tetrominoes are unique in their lengths.

Finally I decided that the best way in which to define my Tetromino layouts was an array of arrays creating a sort of matrix as detailed below. This made it easy for me to allocate a block class to the cells I needed and I could easily invert the matrix to rotate the layout.

tetromino thoughts 3

Furthermore, although I kept an array of the occupied cells defined in the Tetromino objects, the layouts of the Tetrominoes were defined differently as detailed below. This meant that I could use the layout matrices, where the 0s are non-occupied and the 1s are blocks, to map which cells to push to the occupied cell array on the first spawn of that particular Tetromino or a more complex movement like a rotation or Tetromino swap.

tetrominoes_defined

INITIAL SPAWN, MOVEMENT & ROTATION
As well as having a grid class, I also made a class for the Tetrominoes. The main Tetromino objects that I wanted to implement were the active Tetromino, the held Tetromino and the next Tetromino. Once the active Tetromino lands it actually jumps back up to the top and adopts the layout and color of the next Tetromino instead of a new object being created. This is because once the Tetrominoes have landed, they no longer need to be defined as a Tetromino and are really just loose blocks on the board. To make the appearance that it is landing and a new one is created, the active Tetromino does not despawn it's block cells before respawning at the top of the board.

Initial Spawn
For the initial spawn, a random Tetromino layout is chosen from an array of all 7 possible Tetrominoes. I then call my spawnNew method that essentially finds all the cells that the new Tetromino should occupy. What this function does is starting from the top-left cell of where I want the Tetromino to appear, it maps the Tetromino layout, starting from the top-left cell of the layout matrix, onto the grid. It does this by running through the matrix and where that matrix position corresponds to as a grid cell, checks if that matrix position is unoccupied or a block and, if it is a block, it will add that grid cell to the cellPositions array.

Now that we have all the cell positions of the Tetromino, the spawn method is called in which it lets the grid object know what cells to change into a block and what colour, and then calls the addBlocks grid method that adds the block class to those cells.

spawnNew

spawn

addBlocks

Movement
An interesting problem that I enjoyed solving was the collision of a moving Tetromino in either landing or moving into a space already occupied by a block cell.

How I solved this problem was by having a 'next' object defined within my Tetromino class. This object was where I defined the proposed next position of the active Tetromino. I then used these details to run a check to see if any of the proposed cells it wants to move into are already occupied. This movement check temporarily despawns the active Tetromino so that it doesn't mistake the active Tetromino's blocks for stationary ones. If the check confirms that all the cells are ok to be moved into, I despawn the current position of the Tetromino, set the new current position to the proposed position and then respawn the Tetromino.

movement

movementCheck

confirmMovement

ROTATION
As described above the rotation of the Tetrominoes was probably one of the most challenging aspects to creating the MVP of this game. I beleive that the key to solving this was how I defined the layout and position of the active Tetromino.

The rotation function basically works very similaraly to the spawnNew function in that it runs through the layout matrix to map the layout to the grid cells. It also works very similarily to the general movement function in that the proposed cells that the Tetromino wants to move into are pushed to a 'next' array to be checked to see if they are already occupied before respawning in that position. Of course, before both of these actions are carried out, the layout needs to be rotated. This is done with the simple function below where through a nested for loop I basicaly create a new matrix that inverses the existing matrix by creating an array of empty arrays and then pushes the elements from the existing matrix into those arrays in an inverse order.

rotate

CONCLUSION AND KEY LEARNING
If I am being totally honest with myself, I'm not entirely satisfied with the final outcome of this project and as mentioned above I think, down to a lack of vigorous planning and having to spend a lot of time refactoring my code, I feel like I could have made a much more finished game in the given time limit. This is definitely a lesson I've learnt and something I am looking forward to actioning in future projects.

Saying that, I had a tremendous amount of fun creating this as my first project. Tetris is a game I love and was a big part of my childhood. Having only started my coding journey very recently, I'm proud that I'm able to recreate something like Tetris and I'm looking forward to further experiments with JavaScript and general coding logic to create many more things as well as continuing to grow and learn new skills and technologies.

FUTURE IMPROVEMENTS
There are a few things that I began to add which you can see evidence for in my code however due to time constraints I was unable to complete.

Wall kicks- on rotation if a Tetromino conflicts with blocks to it's left or right, if not creating further conflicts with another block, it moves over to complete it's rotation.
Drop shadow- the Tetromino projects a shadow to the position it will currently end up in.
2 player- Currently 2 player is available to use however there is no interaction between the two games. I would have liked to create some kind of interaction between them for example, the more points player 1 gets, the faster player 2's game gets.
Further developments I would have liked to include are:

Responsive design
Music and sound effects
Quick drop to drop the Tetromino right down to point of landing
Leaderboard
KNOWN BUGS
Occasionally when a line is cleared the blocks are not cleared properly and then the above blocks come down and occupy the same cells. This creates an unclearable line.
If you rotate the active Tetromino before swapping it to the held Tetromino it can occupy the wall cells.
CONTACT
I would love to receive any feedback or hear about any of your similar projects. Please get in touch!

tonyhaunschmidt@gmail.com

tonyhaunschmidt.com

LinkedIn/tonyhaunschmidt

My GitHub Profile and Other Projects
