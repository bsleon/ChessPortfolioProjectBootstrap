// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function updateStatus() {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // alert(moveColor)

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}
//********EDIT HERE */***************/

//set options for board
var config = {
  sparePieces: false,
  showNotation: true,
  orientation: 'white',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

//initialize board with above config options
board = Chessboard('myBoard', config)

//example of how to setup a position(ruy lopez)
$('#ruyLopezBtn').on('click', function () {
  game.reset();
  var ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'; //use min FEN
  board.position(ruyLopez); //set the board gui to FEN
  game = new Chess(ruyLopez + ' b KQkq - 3 3'); //set the chess.js to full FEN with turn
  updateFen();
})

//italian game
$('#italianGameBtn').on('click', function () {
  game.reset();
  var italianGame = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R'; //use min FEN
  board.position(italianGame); //set the board gui to FEN
  game = new Chess(italianGame + ' b KQkq - 3 3'); //set the chess.js to full FEN with turn
  updateFen();
})

//example of how to reset to start position
$('#startPositionBtn').on('click', function () {
  game.reset();
  board.position('start');
  game = new Chess();
  updateFen();
})

//flip board
$('#flipBoardBtn').on('click', function () {
  board.flip();
})

//Move History
$('#moveHistoryBtn').on('click', function () {
  alert(game.history());
})


//RESET FUNCTION
// function resetBoard() {
//   game.status = "";
//   $status.html(status);
//   game = new Chess();
// }

//update fen and status
function updateFen() {
  $fen.html(game.fen()); //update game fen
  board.position(game.fen()); //update board fen
  updateStatus();
}

//*****PGN STUFF*********/
const pgn = [
  
  '[Event "Paris"]',
  '[Site "Paris FRA"]',
  '[Date "1858.??.??"]',
  '[EventDate "?"]',
  '[Round "?"]',
  '[Result "1-0"]',
  '[White "Paul Morphy"]',
  '[Black "Duke Karl / Count Isouard"]',
  '[ECO "C41"]',
  '[WhiteElo "?"]',
  '[BlackElo "?"]',
  '[PlyCount "33"]',
  '',
  '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7',
  '8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8',
  '13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0'
]

var index = 0;
var fens = [];

//loadPGN
$('#loadPgnBtn').on('click', function () {
  game.reset();
  game.load_pgn(pgn.join('\n'));
  updateFen();
  index=0;
  fens = [];
  fensMaker();
})

function fensMaker(){
  var moves = game.history();
  var tmpGame = new Chess();
  var startingPos = tmpGame.fen();
  for(var i=0; i<moves.length; ++i)
  {
    tmpGame.move(moves[i]);
    fens[i] = tmpGame.fen();
  }
  //add the start position
  fens.unshift(startingPos);

  index = fens.length;
}

// If Prev button clicked, move backward one
$('#prevBtn').on('click', function () {
 console.log(index);
 if(index == fens.length) --index;
  if(index > 0){
    console.log(index);
    board.position(fens[--index]);
    }
});

// If Next button clicked, move forward one
$('#nextBtn').on('click', function () {
  if(index < fens.length){
  board.position(fens[++index]);
  }
});

// If Start button clicked, go to start position
$('#startPositionBtn2').on('click', function () {
  board.position(fens[0]);
  index=0;
});

// If End button clicked, go to end position
$('#endPositionBtn').on('click', function () {
  board.position(fens[fens.length - 1]);
  index=fens.length;
});

// If Play button clicked, animate moves from current position until end
$('#playBtn').on('click', function () {
  //loop through game fens from current position until end
  //at each iteration, use board.move(currentFens) to animate the piece
  console.log("play btn clicked");
  var moves = game.history();
  for(var i=0; i<fens.length; ++i)
  {
    board.move(moves[i]);
  }
  board.move('e2-e4');
});

//#TODO
//add status as the moves are clicked, currently status stays stuck at checkmate
//this is because the game position in chess.js isnt updated, only the board.position in chessboard.js is

//#TODO
//add a board setup feature

//#TODO
//figure out how to make notation outside of the board or make a custom board rim with notation

//#TODO
//add custom board colors and pieces options


updateStatus();
