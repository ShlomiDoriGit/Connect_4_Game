<template>
  <div id="app">
   <h4 v-show="!gameOver">
     Player <span v-if="turn == this.player1"> 1</span><span v-else> 2 </span></h4>
     <h4 v-show="gameOver">
       Player <span v-if="turn == this.player1"> 1 </span><span v-else> 2 </span>Wins!</h4>

      <div class="wrapper">
        <div class="board">
          <div 
            v-for="(col,colIndex) in board[0]"
           :key="'col-' +colIndex" 
           :style="{left: colIndex *50 + 'px'}"
            class="col"
            @click="takeTurn(colIndex)"
            ></div>
            <div class="row" v-for="(row,rowIndex) in board" :key="rowIndex">
          <svg v-for="(col,colIndex) in row" 
          :key="colIndex"
          width="50" 
          height="50"
          >
            <circle
            :id="'circle-' + rowIndex + '-' + colIndex"
             :class="{
                 empty: col == 0 ,
                 red: col ==1,
                 yellow: col == 2}"
                  cx="25" cy="25" r="20" 
                  />
          </svg>
        </div>
      </div>
    </div>
    <button type="button" v-show="gameOver" @click="resetGame()">Reset Game</button>
  </div>
</template>

<script>
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms))
}
function hightLightPieces(pieces){
  pieces.forEach(piece => {
    document.getElementById(
      'circle-' +
     piece.row + '-' +
     piece.col).classList.add('flash')
  });
}
import * as GameBoard from './GameBoard'
export default {
  name: 'App',
  data() {
    return{
      board: [],
      turn: 0,
      player1 :0,
      player2 :1 ,
      red: 1,
      yellow: 2,
      gameOver: false,
      empty: 0
    };
  },
  methods:{
    selectBestCol(){
      let validCols = GameBoard.getValidCol(this.board)
      let highestScore = -1000
      let col = Math.floor(Math.random * validCols.length)
      for(let i = 0; i< validCols.length; i++)
      {
        let newCol = validCols[i]
        let row = GameBoard.getRow(this.board,newCol)
        let boardCopy = GameBoard.copyBoard(this.board)
        GameBoard.dropPiece(boardCopy,row,newCol)
        let newScore = GameBoard.scoreBoard(boardCopy)
        if(newScore > highestScore)
        {
          highestScore=newScore
          col = newCol
        }
      }
      return col
    },
    resetGame(){
      this.board = GameBoard.createBoard()
      this.gameOver=false;
      this.turn = this.player1; 
    },
    takeTurn(col){
      if(!this.gameOver && 
      GameBoard.isValidCol(this.board,col)
      && this.turn == this.player1){
        let row = GameBoard.getRow(this.board,col);
        let color = this.turn == this.player1 ? this.red : this.yellow ;
        GameBoard.dropPiece(this.board,row,col,color);
        if(GameBoard.winnerMove(this.board,color))
        {
          this.gameOver=true
        }else{
          this.turn += 1 ;
          this.turn %= 2 ;
          sleep(1000).then(()=> {
            this.smartTurn();
          })
          
        }
      }
    },
    smartTurn(){
      //let col = this.selectBestCol()
      let result = GameBoard.minAndMax(this.board, 2,true)
      let col = result.col
      let row = GameBoard.getRow(this.board,col)
      GameBoard.dropPiece(this.board,row,col,this.yellow)
      if(GameBoard.winnerMove(this.board,this.yellow)){
        this.gameOver = true
      }else{
          this.turn += 1 ;
          this.turn %= 2 ;
        }
    },
  },
  created(){
    this.board = GameBoard.createBoard()
  
  },
  updated(){
    if(this.gameOver){
      let color = this.turn == this.player1 ? this.red : this.yellow ;
      let pieces = GameBoard.getWinnerPieses(this.board,color)
      hightLightPieces(pieces)
    }
  },
  components: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.row{
  background-color: blue;
  display: flex;
}

.wrapper{
display: flex;
justify-content: center;
}

circle.empty{
  fill: #fff;
}
circle.red{
  fill:red;
}
circle.yellow{
  fill: yellow;
}

.col{
  position: absolute;
  top:0;
  width: 50px;
  height: 100%;
  transition: background-color 0.1s ease-in-out;
  background-color: transparent ;

}
.col:hover{
  background-color: rgb(255,222, 255,0.2);
}
.board{
  position:relative;
}
#animation 

circle.red.flash{
  animation: pulse-red 1.2s ease-in-out infinite
}

circle.yellow.flash{
  animation: pulse-yellow 1.2s ease-in-out infinite
}

@keyframes pulse-red {
  0%{
    fill: #d50000
  }
   50%{
    fill: #ff8f8f
  }
  0%{
    fill: #d50000
  }
}
@keyframes pulse-yellow {
   0%{
    fill: #add400
  }
   50%{
    fill: #fffdab
  }
  0%{
    fill: #add400
  }
}
</style>
