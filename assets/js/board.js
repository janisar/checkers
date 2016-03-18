var Board = {
	scope: {
        board: [
        	[new P(1), new P(0), new P(1), new P(0), new P(1), new P(0), new P(1), new P(0)],
        	[new P(0), new P(1), new P(0), new P(1), new P(0), new P(1), new P(0), new P(1)],
        	[new P(1), new P(0), new P(1), new P(0), new P(1), new P(0), new P(1), new P(0)],
        	[new P(0), new P(0), new P(0), new P(0), new P(0), new P(0), new P(0), new P(0)],
        	[new P(0), new P(0), new P(0), new P(0), new P(0), new P(0), new P(0), new P(0)],
        	[new P(0), new P(-1), new P(0), new P(-1), new P(0), new P(-1), new P(0), new P(-1)],
        	[new P(-1), new P(0), new P(-1), new P(0), new P(-1), new P(0), new P(-1), new P(0)],
        	[new P(0), new P(-1), new P(0), new P(-1), new P(0), new P(-1), new P(0), new P(-1)],
        ]
	},
	
	consoleAllKings: function() {
		for (var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].permanentKing) {
					console.log(i + "  " + j + "  permanent");
				}
				if (Board.scope.board[i][j].getType() == 1) {
					console.log(i + "  " + j + "  getType()");
				}
			}
		}
	},
	
	draw: function() {
		var board = "<div>";
		var color = 1;
		
		for (var row = 0; row <= 7; row++) {
			var boardRow = "<div class = 'checkersRow'>";
			
			for (var col = 0; col <= 7; col++) {
				boardRow += "<div class = 'boardBox box_" + color + "'>" + Board.getPiece(row, col) + "</div>";
				color = 3 - color;
			}
			
			color = 3 - color;
			boardRow += "</div>";
			board += boardRow;
		}
		board += "</div>"
		document.getElementById("checkersBoard").innerHTML = board;
		
		Board.resize();
	},
	
	resize: function() {
		var width = document.defaultView.getComputedStyle(document.getElementById("checkersBoard"), "div")['width'];
		document.getElementById("checkersBoard").setAttribute("style", "height: " + width + ";");
	},
	
	getPiece: function(row, col) {

		if (Board.scope.board[row][col].color === 0) {
			return "<section id = 'piece_" + row + "" + col + "'>&nbsp;</section>";
		} 
		
		var disabledClassName = (Board.scope.board[row][col].color != Game.scope.currentPlayer) ? "disabled" : "";
		var colorClassName = (Board.scope.board[row][col].color == 1) ? "blackPiece" : "whitePiece";
		
		return "<section " +
					"class = 'piece " + colorClassName + " " + disabledClassName + 
					 "' " +
					"id = 'piece_" + row + "" + col + "' " +
					"onclick = 'Piece.onClick(" + row + ", " + col + ")'>&nbsp;</section>";

	},
	
	doMove: function(row, col) {
		Piece.movePiece(Board.scope.board, row, col);
		var color = Board.scope.board[Piece.scope.activePiece[0]][Piece.scope.activePiece[1]];
		
		if (row == 0) {
			Board.scope.board[row][col].permanentKing = true;
		}
		myMove(Piece.scope.activePiece[0], Piece.scope.activePiece[1], row, col, false);
	},
	
	doTake: function(row, col, takenRow, takenCol) {
		var color = Board.scope.board[Piece.scope.activePiece[0]][Piece.scope.activePiece[1]].color;
		var take = new Take(row, col, {x: takenRow, y: takenCol});
		Piece.takePiece(Board.scope.board, take);
		
		if (row == 0) {
			Board.scope.board[row][col].permanentKing = true;
		}
		
		myTake(Piece.scope.activePiece[0], Piece.scope.activePiece[1], take, color, false);
	}
};

Board.draw();