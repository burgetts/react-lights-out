import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

// is it better to put helper functions somewhere else?

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/


function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.4}) {
  const [board, setBoard] = useState(createBoard());

  /* Helper function that deep clones array */
  function cloneArray(arr) {  
    // Deep copy arrays. Going one level deep seems to be enough.
    var clone = [];
    for (let i=0; i<arr.length; i++) {
      clone.push( arr[i].slice(0) )
    }
    return clone;
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for (let i = 0; i < nrows; i++){
      let row = []
      for (let j = 0; j < ncols; j++){
        // decide if cell is lit or unlit
        let d = Math.random()
        d < chanceLightStartsOn ? row.push(true) : row.push(false)
      }
      // push row into board
      initialBoard.push(row)
    }
    return initialBoard;
  }
 
  /* Check board in state to determine whether the player has won. Returns true or false. */
  function hasWon() {
    for (let row of board){
      if (row.includes(true)){
        return false
      }
    }
    return true
  }

  function flipCellsAround(coord) {

    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // make deep copy of old board
      const boardCopy = cloneArray(oldBoard)

      // flip cell and cells around it
      flipCell(y, x, boardCopy)
      flipCell(y, x-1, boardCopy) // left
      flipCell(y, x+1, boardCopy) // right
      flipCell(y+1, x, boardCopy) // down
      flipCell(y-1, x, boardCopy) // up
     
      return boardCopy
    });
  }

  // if the game is won, just show a winning msg 
  if (hasWon()){
    return (
      <h1> Congrats, you won! </h1>
    )
  }

  // else, render cells
  return (
    <>
    <h1> Lights Out </h1>
    <table> 
      <tbody>
     
        {board.map((row,idx1) => { return ( 
            <tr>
              {row.map((cell, idx2) => <Cell coord = {`${idx1}-${idx2}`} isLit = {cell} flipCellsAroundMe = {flipCellsAround}/>)}
            </tr> 
         )})}

     </tbody>
    </table>
    </>
  )
}

export default Board;
