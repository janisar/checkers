var Piece = {
		
	scope: {
		
	},
	
	onClick: function(row, col) {
		var color = Board.scope.board[row][col].color;
		var possibleMoves = Piece.findPossibleMoves(row, col, color);
		var possibleTakes = Piece.findPossibleTakes(row, col, color);
		
		if (color === Game.scope.currentPlayer && 
				possibleMoves.length > 0 || possibleTakes.length > 0) {
			
			Piece.scope.activePiece = [row, col];
			var id = "piece_" + row + "" + col;

			if (!Piece.canTake(row, col, color)) {
				UI.highlightActivePiece(id, color);
				UI.drawPossibleMovesAndTakes(possibleTakes, possibleMoves);
			}
		}
	},
	
	fitsInBoard: function(col, row) {
		if (col >= 0 && col < 8 && row >= 0 && row < 8) {
			return true;
		}
		return false;
	},
	
	canTake: function(r, c, color) {
		var result = true;
		var totalTakes = 0;
		for (var row = 0; row < Board.scope.board.length; row++) {
			for (var col = 0; col < Board.scope.board[row].length; col++) {
				if (Board.scope.board[row][col].color == color) {
					var takes = Piece.findPossibleTakes(row, col, color);
					if (takes.length > 0) {
						totalTakes++;
						for (var i = 0; i < takes.length; i++) {
							if (takes[i].myPiece.x == r && takes[i].myPiece.y == c) {
								result = false;
							}
						}
					}
				}
			}
		}
		return (totalTakes == 0) ? false : result;
	},
	
	findPossibleKingTakes: function(row, col, color, possibleTakes) {
		for (var i = 0; i < directions.length; i++) {
			var dx = directions[i].x;
			var dy = directions[i].y;
			var x = dx;
			var y = dy;
			
			while (Piece.fitsInBoard(col + y, row + x) && Board.scope.board[row + x][col + y].color == 0) {
				x += dx;
				y += dy;
			}
			x -= dx;
			y -= dy;
			if (Piece.fitsInBoard(col + y + (2*dy), row + x + (2*dx)) && 
					Board.scope.board[row+x+dx][col+y+dy].color == (0-color) && 
					Board.scope.board[row+x+(2*dx)][col+y+(2*dy)].color == 0) {
				
				possibleTakes.push(
						new Take(row + x + (2*dx), col + y + (2*dy), 
								{x: row + x + dx, y: col + y + dy, piece: Board.scope.board[row+x+dx][col+y+dy]},
								{x: row, y: col}));
			}
		}
	},
	
	findPossibleTakes: function(row, col, color) {
		var possibleTakes = [];
		if (Board.scope.board[row][col].permanentKing) {
			Piece.findPossibleKingTakes(row, col, color, possibleTakes);
		}
		for (var i = 0; i < directions.length; i++) {
			var x = directions[i].x;
			var y = directions[i].y;
			
			if (Piece.fitsInBoard(col + (2*y), row + (2*x)) && Board.scope.board[row+x][col+y].color == (0-color) && 
					Board.scope.board[row+(2*x)][col+(2*y)].color == 0) {
				possibleTakes.push(
						new Take(row+(2*x), col+(2*y), 
								{x: row+x, y: col+y, piece: Board.scope.board[row+x][col+y]},
								{x: row, y: col}));
			}
		}
		return possibleTakes;
	},
	
	findPossibleKingMoves: function(row, col, color, possibleMoves) {
		for (var i = 0; i < directions.length; i++) {
			var y = 1* directions[i].y;
			var x = 1 * directions[i].x;
			
			while (Piece.fitsInBoard(col + y, row + x) && 
					Board.scope.board[row + x][col + y].color == 0) {
				
				possibleMoves.push(new Point(row + x, col + y));
				x += (1*directions[i].x);
				y += (1*directions[i].y);
			}
		}
		return possibleMoves;
	},
	
	findPossibleMoves: function(row, col, color) {
		var possibleMoves = [];
		// white
		if (Board.scope.board[row][col].permanentKing) {
			Piece.findPossibleKingMoves(row, col, color, possibleMoves);
		}
		if (color == -1 || Board.scope.board[row][col].permanentKing) {
			if (row - 1 >= 0 && col - 1 >= 0 && 
					Board.scope.board[row-1][col-1].color == 0) {
				possibleMoves.push(new Point(row - 1, col - 1));
			}
			if (row - 1 >= 0 && col + 1 < 8 && 
					Board.scope.board[row-1][col+1].color == 0) {
				possibleMoves.push(new Point(row - 1, col + 1));
			}
		}
		if (Board.scope.board[row][col].permanentKing || color == 1) {
			if (row + 1 < 8 && col - 1 >= 0 && 
					Board.scope.board[row+1][col-1].color == 0) {
				possibleMoves.push(new Point(row + 1, col - 1));
			}
			if (row + 1 < 8 && col + 1 < 8 && 
					Board.scope.board[row+1][col+1].color == 0) {
				possibleMoves.push(new Point(row + 1, col + 1));
			}
		} 
		return possibleMoves;
	},
	
	movePiece: function(board, newRow, newCol, finalMove) {
		var oldRow = Piece.scope.activePiece[0];
		var oldCol = Piece.scope.activePiece[1];
		
		var movingPiece = board[oldRow][oldCol];
		var color = board[oldRow][oldCol].color;
		var previousType = board[oldRow][oldCol].getType();
		
		board[oldRow][oldCol] = new P(0);
		
		board[newRow][newCol] = movingPiece;
		
		if ((color == 1 && newRow == 7) || (color == -1 && newRow == 0)) {
			board[newRow][newCol].setType(1);
			board[newRow][newCol].addType(previousType);
		}
	
		if (finalMove) {
			if ((color == 1 && newRow == 7) || (color == -1 && newRow == 0)) {
				board[newRow][newCol].permanentKing = true;
			}
			
			myMove(oldRow, oldCol, newRow, newCol, true);
		}
	},
	
	undoMove: function(board, row, col, oldRow, oldCol, currentPlayer) {
		var previousPiece = board[row][col];
		board[oldRow][oldCol] = previousPiece;
		board[oldRow][oldCol].color = currentPlayer;
		
		if ((currentPlayer === -1 && row === 0) || (currentPlayer === 1 && row === 7)) {
			board[oldRow][oldCol].setType(board[oldRow][oldCol].getPreviousType());
		}

		board[row][col] = new P(0);
	},
	
	takePiece: function(board, take, finalMove) {
		var oldRow = Piece.scope.activePiece[0];
		var oldCol = Piece.scope.activePiece[1];
		var color = Board.scope.board[oldRow][oldCol].color;
		
		board[take.takenPiece.x][take.takenPiece.y].color = 0;
		board[take.takenPiece.x][take.takenPiece.y].setType(0);
		Piece.movePiece(board, take.x, take.y, false);
		
		if (finalMove) {
			if ((color == 1 && take.x == 7) || (color == -1 && take.x == 0)) {
				board[take.x][take.y].permanentKing = true;
			}
			
			myTake(oldRow, oldCol, take, color, true)
		}
	},
	
	undoTake: function(board, row, col, takenRow, takenCol, takenPiece, oldRow, oldCol, currentPlayer) {
		board[takenRow][takenCol] = takenPiece;
		board[takenRow][takenCol].color = -currentPlayer;
		Piece.undoMove(board, row, col, oldRow, oldCol, currentPlayer);
	}
}