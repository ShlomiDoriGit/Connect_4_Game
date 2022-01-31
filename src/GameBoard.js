

const RowCount = 6
const ColCount = 7
export  const Yellow = 2
export  const Red = 1
export  const Empty = 0
function count(inputArray,item){
    const map = inputArray.reduce(
        (acc,key) => acc.set(key,(acc.get(key) || 0) + 1),
        new Map())
        return map.get(item) || 0

}
export function createBoard(){
    let board=[]
    for(let row = 0; row < 6 ; row++)
    {
        board.push([])
    }
    board.forEach(row => {
        for(let col = 0 ; col < 7 ; col++)
        {
            row.push(0)
        }        
    });

    return board;
}

export function copyBoard(board)
{
    let boardCopy= [...board]
    board.forEach((row,rowIndex)=>{
        boardCopy[rowIndex] = [...row]
    })
    return boardCopy
}

function getScore(section)
{
    let score = 0 
    if(count(section,Yellow) == 4){
        score += 100 

    }
    if(count(section,Yellow) == 3 && count(section,Empty) == 1){
        score += 10 
    }
    if(count(section,Yellow) == 2 && count(section,Empty) == 2){
        score += 5 
    }
    if(count(section,Red) == 2 && count(section,Empty) == 2){
        score -= 80 
    }
    return score
}
export function scoreBoard(board)
{
    let score = 0
    let centerColArray= []
    let centerCol = Math.floor(ColCount /2 )
    for(let row = 0; row < RowCount ; row++)
    {
        centerColArray.push(board[row[centerCol]])
    }
    let centerPieces = count(centerColArray,Yellow)
    score += centerPieces * 6 
    //score Rows
    board.forEach(row => {
        for(let col = 0 ; col < ColCount - 3; col++){
            let section = row.slice(col + 4)
            score += getScore(section)
        }
    })
    //Score cols
    for(let col = 0 ; col < ColCount; col++){
        let colArray=[]
        for(let row = RowCount -1 ; row >=0 ;row--){
            colArray.push(board[row][col])
        }
    } //Score upward diagonal
    for(let row = RowCount -1 ; row >= RowCount - 3 ;row--){
        for(let col = 0 ; col < ColCount -3 ;col++){
            let section = []
            for(let i= 0 ; i < 4 ;i++){
                section.push(board[row - i][col + i])
            }
            score += getScore(section)
        }
    }
    //Score downward diagonal
    for(let row = 0 ; row < RowCount - 3 ;row ++){
        for(let col = 0 ; col < ColCount -3 ;col++){
            let section = []
            for(let i = 0 ; i < 4 ;i++){
                section.push(board[row + i][col + i])
            }
            score += getScore(section)
        }
    }
    return score
}

export function getValidCol(board){
    let ValidCols =[]
    for(let col = 0; col < ColCount; col++)
    {
        if(isValidCol(board,col))
        {
            ValidCols.push(col)
        }
    }
    return ValidCols
}
export function isValidCol(board,col){
    return board[0][col] == 0
}

export function getRow(board,col){
    for(let row = RowCount-1; row >=0 ; row--){
        if(board[row][col] == 0){
           return row
        }
    }

}

export function minAndMax(board,depth,maxPlayer){
    let terminalPlayer = winnerMove(board,Red) ||
    winnerMove(board,Yellow) || 
    isValidCol(board).length == 0  

    if(terminalPlayer || depth == 0){
      if(terminalPlayer){
        if(winnerMove(board,Red)){
            return {score: -1000 , 
                    col: undefined}
        }
        if(winnerMove(board,Yellow)){
            return {score: 1000 ,
                   col: undefined}
        }
        return {score: 0 ,
            col: undefined}
    }else{
        return {score: scoreBoard(board) , col: undefined}
    }
 }
    let validCols = getValidCol(board)
    if(maxPlayer){
        let score = -Infinity
        let col = Math.floor(Math.random() * validCols.length)
        for(let i = 0 ; i < validCols.length; i++){
            let newCol = validCols[i]
            let row = getRow(board,newCol)
            let boardCopy = copyBoard(board)
            dropPiece(boardCopy,row,newCol ,Yellow)
            let result = minAndMax(boardCopy,depth -1 ,false)
            let newScore = result.score
            if(newScore > score){
                score = newScore
                col = newCol
            }
        }
        return {score: score , col: col} 
    }else{
        let score = Infinity
        let col = Math.floor(Math.random() * validCols.length)

        for(let i = 0; i < validCols.length; i++){
            let newCol = validCols[i]
            let row = getRow(board,newCol)
            let boardCopy = copyBoard(board)
            dropPiece(boardCopy,row,newCol ,Red)
            let result = minAndMax(boardCopy,depth -1 ,true)
            let newScore = result.score
            if(newScore < score){
                score = newScore
                col = newCol
            }
        }
        return {score: score , col: col} 
    }
    
}
export function dropPiece(board,row,col,color){
    board[row][col] = color
}

export function getWinnerPieses(board,color)
{
    //ckeck all rows
    for(let c =0 ; c< RowCount - 3; c++)
    {
        for(let r = 0 ; r< RowCount; r++){
            if(board[r][c] == color &&
               board[r][c+1] == color &&
               board[r][c+2] == color &&
               board[r][c+3] == color
               ){
                   return [
                       {row: r ,col: c},
                       {row: r ,col: c + 1},
                       {row: r ,col: c + 2},
                       {row: r ,col: c + 3},]
               }
        }
        //check all cols
        for(let c = 0 ; c< ColCount; c++)
        {
            for(let r = RowCount - 1 ; r >= RowCount - 1; r--){
                if(board[r][c] == color &&
                   board[r - 1][c] == color &&
                   board[r - 2][c] == color &&
                   board[r - 3][c] == color
                   ){
                       return [
                           {row: r ,col: c},
                           {row: r -1,col: c},
                           {row: r -2,col: c },
                           {row: r -3,col: c },]
                   }
            }
       }
        //chack upward diagonals
   for(let c = 0 ; c < ColCount-3 ; c++)
   {
       for(let r = RowCount-1 ; r>=RowCount-3; r--){
           if(board[r][c] == color &&
              board[r-1][c +1] == color &&
              board[r-2][c +2] == color &&
              board[r-3][c +3] == color
              ){
                return [
                    {row: r ,col: c},
                    {row: r -1,col: c + 1},
                    {row: r -2,col: c  +2},
                    {row: r -3,col: c  +3},
                ]
              }
       }
   }

    //chack  downward diagonals
    for(let c = 0 ; c < ColCount-3 ; c++)
    {
        for(let r = 0 ; r < RowCount-3; r++){
            if(board[r][c] == color &&
               board[r + 1][c +1] == color &&
               board[r + 2][c +2] == color &&
               board[r + 3][c +3] == color
               ){
                return [
                    {row: r ,col: c},
                    {row: r +1,col: c + 1},
                    {row: r +2,col: c  +2},
                    {row: r +3,col: c  +3},
                ]
               }
        }
    }
  }
}
export function winnerMove(board,color)
{
    //ckeck all rows
    for(let c = 0 ; c <  RowCount - 3; c++)
    {
        for(let r = 0 ; r< RowCount; r++){
            if(board[r][c] == color &&
               board[r][c+1] == color &&
               board[r][c+2] == color &&
               board[r][c+3] == color){
                   return true
               }
        }
    }

    //chack all coloumns
    for(let c = 0 ; c< ColCount; c++)
    {
        for(let r = RowCount-1 ; r >= RowCount-3; r--){
            if(board[r][c] == color &&
               board[r-1][c] == color &&
               board[r-2][c] == color &&
               board[r-3][c] == color){
                   return true
               }
        }
    }
   //chack diagonals
   for(let c = 0 ; c < ColCount-3 ; c++)
   {
       for(let r = RowCount-1 ; r>=RowCount-3; r--){
           if(board[r][c] == color &&
              board[r-1][c +1] == color &&
              board[r-2][c +2] == color &&
              board[r-3][c +3] == color){
                  return true
              }
       }
   }

    //chack diagonals
    for(let c = 0 ; c < ColCount-3 ; c++)
    {
        for(let r = 0 ; r < RowCount-3; r++){
            if(board[r][c] == color &&
               board[r + 1][c +1] == color &&
               board[r + 2][c +2] == color &&
               board[r + 3][c +3] == color){
                   return true
               }
        }
    }
  }


