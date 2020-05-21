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
  resetBoard();
  var ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'; //use min FEN
  board.position(ruyLopez); //set the board gui to FEN
  game = new Chess(ruyLopez + ' b KQkq - 3 3'); //set the chess.js to full FEN with turn
  updateFen();
})

//italian game
$('#italianGameBtn').on('click', function () {
  resetBoard();
  var italianGame = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R'; //use min FEN
  board.position(italianGame); //set the board gui to FEN
  game = new Chess(italianGame + ' b KQkq - 3 3'); //set the chess.js to full FEN with turn
  updateFen();
})

//example of how to reset to start position
$('#startPositionBtn').on('click', function () {
  resetBoard();
  board.position('start');
  game = new Chess();
  updateFen();
})

//flip board
$('#flipBoardBtn').on('click', function () {
  board.flip();
})

const pgn = [
  '[Event "Casual Game"]',
  '[Site "Berlin GER"]',
  '[Date "1852.??.??"]',
  '[EventDate "?"]',
  '[Round "?"]',
  '[Result "1/2 1/2"]',
  '[White "Adolf Anderssen"]',
  '[Black "Jean Dufresne"]',
  '[ECO "C52"]',
  '[WhiteElo "?"]',
  '[BlackElo "?"]',
  '[PlyCount "47"]',
  '',
  '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6',
  '4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7',
  '11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5',
  'Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6',
  '23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5',
  'hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5',
  '35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6',
  'Nf2 42.g4 Bd3 43.Re6 1/2-1/2'
]

//loadPGN
$('#loadPgnBtn').on('click', function () {
  resetBoard();
  game.load_pgn(pgn.join('\n'));
  updateFen();
})

//TODO
//MAKE A RESET FUNCTION
function resetBoard() {
  game.status = "";
  $status.html(status);
  game = new Chess();
}

//update fen and status
function updateFen() {
  $fen.html(game.fen()); //update game fen
  board.position(game.fen()); //update board fen
  updateStatus()
}

updateStatus()


// function onChange (oldPos, newPos) {
//   console.log('Position changed:')
//   console.log('Old position: ' + Chessboard.objToFen(oldPos))
//   console.log('New position: ' + Chessboard.objToFen(newPos))
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
// }

// var config = {
//   draggable: true,
//   position: start,
//   // onChange: onChange
// }
// var board = Chessboard('myBoard', config)

// $('#ruyLopezBtn').on('click', function () {
//   var ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'
//   board.position(ruyLopez)
// })

// $('#startPositionBtn').on('click', board.start)
