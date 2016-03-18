var AI = {
	constants: {
		pieceVal: 10000,
		myPieceVal: 30000,
		oppPieceVal: 15000,
		kingVal: 8000
	}, 
	scope: {
		
	},
	
	makeMove: function() {
		var me = Game.scope.currentPlayer;
		var opponent = 0 - me;
		var takes = AI.findTakes(me, opponent);
		AI.currentSituation(me, opponent);
		MiniMax.scope.originalPlayer = me;
		var bestValue = MiniMax.minimax(Board.scope.board, me, 6);
		console.log(bestValue);
		if (bestValue[1].length > 0) {
			AI.takePiece(takes, bestValue[1], me, true);
			Game.checkWin();
		} else {
			Piece.scope.activePiece = [bestValue[2][bestValue[2].length - 1].x, bestValue[2][bestValue[2].length - 1].y];
			Piece.movePiece(Board.scope.board, bestValue[2][0].x, bestValue[2][0].y, true);
			Game.checkWin();
		}
	},
	
		
	calculateSituation: function(player) {
		var sum = 0;
		var opponent = (0 - player);
		var currentMyPieces = AI.scope.currentPieces[player];
		var currentOppPieces = AI.scope.currentPieces[opponent];
		
		var oppPieces = 0;
		var myPieces = 0;
		var myKings = 0;
		var oppKings = 0;
		
		for (var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].color == MiniMax.scope.originalPlayer) {
					sum += MiniMax.scope.boardEval[i][j] * player;
				}
				if (Board.scope.board[i][j].color == player) {
					myPieces++;
					if (Board.scope.board[i][j].getType() == 1) {
						myKings++;
					}
				} else if (Board.scope.board[i][j].color == (0 - player)){
					oppPieces++;
					if (Board.scope.board[i][j].getType() == 1) {
						oppKings++;
					}
				}
			}
		}
		var kingDiff = myKings - oppKings;
		var myDiff = currentMyPieces - myPieces;
		var oppDiff = currentOppPieces - oppPieces;
		sum += (oppDiff - myDiff) * player * AI.constants.myPieceVal;
		sum += kingDiff * player * AI.constants.kingVal;
		
		return sum;
	},
	
	findTakes: function(me, opponent) {
		var possibleTakes = [];
		for (var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].color == me) {
					var takes = Piece.findPossibleTakes(i, j, me);
					if (takes.length > 0) {
						takes.push(new Point(i, j));
						possibleTakes.push(takes);
					}
				}
			}
		}
		return possibleTakes;
	},
	
	findMoves: function(me, opponent) {
		var possibleMoves = [];
		for (var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].color == me) {
					var moves = Piece.findPossibleMoves(i, j, me);
					if (moves.length > 0) {
						moves.push(new Point(i, j));
						possibleMoves.push(moves);
					}
				}
			}
		}
		return possibleMoves;
	},
	
	takePiece: function(takes, bestTake, currentPlayer) {
		for (var i = 0; i < takes.length; i++) {
			if (takes[i][0].x == bestTake[0].x && takes[i][0].y == bestTake[0].y) {
				var take = new Take(takes[i][0].x, takes[i][0].y, {x: takes[i][0].takenPiece.x, y: takes[i][0].takenPiece.y});
				Piece.scope.activePiece = [takes[i][takes[i].length - 1].x, takes[i][takes[i].length - 1].y];
				
				Piece.takePiece(Board.scope.board, take, true);
				break;
			}
		}
	},
	
	currentSituation: function(me, opponent) {
		var oppPieces = 0;
		var myPieces = 0;
		for (var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].color == 1) {
					myPieces++;
				} else if (Board.scope.board[i][j].color == (-1)){
					oppPieces++;
				}
			}
		}
		
		AI.scope.currentPieces ={ "1": myPieces, "-1": oppPieces};
	}
}