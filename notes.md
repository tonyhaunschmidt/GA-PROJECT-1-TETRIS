Tetris

Tetriminos = will need to have an array of different tetriminos

1 -O

0 0
0 0

2 -I

0 0 0 0

3 - S

0 0
   0 0

4 -Z

   0 0
0 0

5 -J

0
0 0 0

6 - L

    0
0 0 0

7 - T
       
  0
0 0 0


Active tetrimino:
-when the tetrimino is between spawning and landing (I.e. active) it will need to have an active class so the landing tetriminos are not moving also. Active class is removed on landing. 


Spawn random tetrimino:
-triggered at start of game and when a tetrimino has landed
-run a random number generator between 1 & 7 each of which is assigned to the different tetrimino. 
-when we know which tetrimino is to be spawned we can run a different function for each.
	this functions will assign a block class to the correct cells I.e.


1 1 1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1  

Where the 1s are the empty grid and the 0s are the block. 

Will need to think about this more but for the purpose of moving the tetrimino and keeping it all together- maybe the cells making the tetrimino needs to be an array of the occupied cells. Ie.

0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
15  16  17  18  19  20  21  22  23  24 25  26  27  28  29
30  31  32  33  34  35  36  37  38  39 40  41  42  43  44
45  46  47  48  49  50  51  52  53  54 55  56  57  58  59

[position 4, position 5, postion 20, position 21]  =  tertimino shape 3 (in above list)


Tetrimino dropping:
Only applies to active class. 
Run an interval loop for the blocks to move down a cell every interval. 
(This will just be the same as sam’s weird cat moving across a grid but applied to all block classes so the whole tetrimino moves together)


Left & right move:
-only applies to active class. 
-On left and right key press 
-similar to dropping- move all cells with the same function. 
-clash with wall:
	-again, similar to sam’s weird cat clashing with outside of the grid but it can run through each of the array indices of the tetrimino for the class. Ie.

if (key === right && tetriminoCurrentPosition[0] % width !== width - 1 && tetriminoCurrentPosition[1] % width !== width - 1 && tetriminoCurrentPosition[2] % width !== width - 1 && tetriminoCurrentPosition[3] % width !== width - 1) { 
      	tetriminoCurrentPosition.map(blockPosition = > block ++)
}  


Speed up drop:
-only applies to active class
-On down key press- increase drop interval time
-On down key lift- return drop interval time
Dropinterval time is a variable set above. 


Tetrimino has landed:
-If the next TetriminoPosition cell has a block class in it then remove active class and change to landed- this will stop any of the interaction the player can have with the tetrimino    
-need to play about with the timing and oder of functions so you can have one final move left or right before it is locked. I believe in the Nintendo one you can slip a block in that way, 
-triggers the spawn of the next tetrimino
-run check of completed line:



Check  for completed line:
-runs when a tetrimino lands
-checks each line at a time
	-checks each cell on line for block class
		-if all cells have block class then run removeLine
For (let i=0; i =< hight; i += width){
	for (let j=0; j =< width; j++){
		cellToCheck = i + j
		lineArray.pop(position i + j)
	{
}
Can use this code to create a lineArray and then run an any method to see if any are blank. If this returns false then the whole line is occupied and can trigger the remove line function.  


removeLine:
-runs when a line is complete
-sets all cells in that line to not have block class
-moves all blockcells higher up in the grid to move down one. (Can check for blocks higher up just by checking all the cells positions lower than the lowest in the line- should be able to preform this whole function with a while loop going towards 0.) 


Rotate:
-only applied to active tetrimino
-on space bar key
-????
My initial thoughts are to have a separate function for each type of tetrimino where  it runs through each index and depending on the type of tetrimino, each block cell will move to a new position:
I.e.

0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
15 16 17  18 19 20 21 22 23 24 25 26 27 28 29
30 31 32 3334 35 3637 38 39 4041 42 43 44
45 46 47 4849 50 5152 53 54 5556 57 58 59

[position 4, position 5, position 20, position 21]  =  tertimino shape 3 (in above list)

After rotation:
[position 4, position 19, postion 20, position 35]

Not sure if this is the best way of doing it- will think about it longer!

1

0 0
0 0

Stays same- no need for rotation


3

0 0
   0 0

Starter position- [position 4, position 5, position 20, position 21] 
finsih position- [position 4, position 19, postion 20, position 35]

Index 1 = index 1
Index 2 = index 3 -1
Index 3 = index 3
Index 4 = index 2 + (width * 2)   //will need to run before index 2 changes

starter position- [position 4, position 19, postion 20, position 35]
4	19	20	49 — doesn’t work!


How about I do a full block??????
[0 0  1
1  0 0
1  1  1]

*= block
Tetrimino = 	[positions: 4*, 5*, 6, 
					19, 20*, 21*, 
					34, 35, 36]
1st rotate	[positions: 4*, 5, 6, 
					19*, 20*, 21, 
					34, 35*, 36]
2nd rotate	[positions: 4*, 5*, 6, 
					19, 20*, 21*, 
					34, 35, 36]
3rd rotate	[positions: 4, 5, 6*, 
					19, 20*, 21*, 
					34, 35*, 36]


I think it might be best to have a rotate value assigned to the tetrimino:
	-initial
	-rotate1
	-rotate 2
	-rotate 3

And then depending on that value, for each different tetrimino the value dictates what indices of the tetrimino is assigned a block value

i.e. if active tetrimino = tetrimino3
 And active tetrimino = initial then: activeTetrimino[0], activeTetrimino[1], activeTetrimino[3] & activeTetrimino[5] have a block class
 And active tetrimino = rotate1 then: activeTetrimino[0], activeTetrimino[1], activeTetrimino[3] & activeTetrimino[5] have a block class
 And active tetrimino = rotate2 then: activeTetrimino[0], activeTetrimino[1], activeTetrimino[3] & activeTetrimino[5] have a block class
 And active tetrimino = rotate3 then: activeTetrimino[0], activeTetrimino[1], activeTetrimino[3] & activeTetrimino[5] have a block class

This will still require a lot of hard code!


Rotate an array of arrays!!
[[1, 2, 3],
[4, 5, 6],
[7, 8, 9]]

Target:
[[7, 4, 1],
[8, 5, 2],
[9, 6, 3]]

function rotateSquareArray(array){
  const rotatedArray = []
  for (let i = 0; i < array.length; i++) {
    rotatedArray.push([])
    for (let j = 0; j < array.length; j++) {
      rotatedArray[i].unshift(array[j][i])
    }
  }
  return rotatedArray
}



For wall clash on rotate:
Would be able to do a check of the acctive tetrimino array to see if the next position is going to be outside of the grid and if so to -1 or -2 to each of the positions. Or +1/ +2



gameOver:
-triggered by tetrimino being on top row
-if should work to have a check running to see if just before spawning a new tetrimino if any of the the top row has block class then game over. Similar to checking for complete line but have a some method rather than an any.  

-show game over screen
	-high score
	-play again button


Extras:
Speed up:
	-just decrease the interval time of the drops the higher the score gets (interval time = variable)

pop up for getting a tetris 4 rows in one go

hard drop- enter

shadow- to show where block will go

replace tetrimino
