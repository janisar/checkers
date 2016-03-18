var Game = {
	scope: {
	},
	
	start: function() {
		Game.scope.currentPlayer = -1;
	},
	
	checkWin: function() {
		var player1 = 0;
		var player2 = 0;
		
		for(var i = 0; i < Board.scope.board.length; i++) {
			for (var j = 0; j < Board.scope.board[i].length; j++) {
				if (Board.scope.board[i][j].color == -1 && 
						(Piece.findPossibleMoves(i, j, -1).length > 0 ||
						Piece.findPossibleTakes(i, j, -1).length > 0)) {
					player1++;
				} else if (Board.scope.board[i][j].color == 1 && 
						(Piece.findPossibleMoves(i, j, 1).length > 0 ||
						Piece.findPossibleTakes(i, j, 1).length > 0)) {
					player2++;
				}
			}
		}
		if (player1 == 0 || player2 == 0) {
			alert("Game Over!");
			return true;
		}
		return false;
	}
}

var Point = function(x, y) {
	this.x = x;
	this.y = y;
};

var Take = function (x, y, takenPiece, myPiece) {
	this.x = x;
	this.y = y;
	this.takenPiece = takenPiece;
	this.myPiece = myPiece;
	
};

var P = function (color) {
	
	this.color = color;
	this.permanentKing = false;
	
	var type = 0;
	var typeList = [];
	
	this.setType = function(t) {
		type = t;
	};
	
	this.addType = function(type) {
		typeList.push(type);
	}
	
	this.getType = function() {
		return type;
	}
	
	this.getPreviousType = function() {
		if (typeList.length > 0)
			return typeList.pop();
		else return 0;
	}
	
	this.getTypeList = function() {
		return typeList;
	};
	
	this.setTypeList = function(list) {
		typeList = list;
	};
};

Game.start();