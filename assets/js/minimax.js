var MiniMax = {
		scope: {
			boardEval: [
			            [8, 0, 8, 0, 8, 0, 8, 0],
			            [0, 4, 0, 4, 0, 4, 0, 8],
			            [8, 0, 2, 0, 2, 0, 4, 0],
			            [0, 4, 0, 1, 0, 2, 0, 8],
			            [8, 0, 2, 0, 1, 0, 4, 0],
			            [0, 4, 0, 2, 0, 2, 0, 8],
			            [8, 0, 4, 0, 4, 0, 4, 0],
			            [0, 8, 0, 8, 0, 8, 0, 8]
        	]
		},
		
		minimax: function(board, currentPlayer, depth) {
			if (depth == 0) {
				return [AI.calculateSituation(currentPlayer), [], []];
			}
			
			var takes = AI.findTakes(currentPlayer, 0 - currentPlayer);
			var moves = AI.findMoves(currentPlayer, 0 - currentPlayer);
			
			var bestValue = Infinity;
			var bestTake = [];
			var bestMove = [];
			var maximizingPlayer = false;
			
			if (currentPlayer == 1) {
				maximizingPlayer = true;
				bestValue = -Infinity;
			}
			
			if (takes.length > 0) {
				for (var i = 0; i < takes.length; i++) {
					var take = new Take(takes[i][0].x, takes[i][0].y, {x: takes[i][0].takenPiece.x, y: takes[i][0].takenPiece.y, piece: takes[i][0].takenPiece.piece});
					var movesToRevert = [take];
					Piece.scope.activePiece = [takes[i][takes[i].length - 1].x, takes[i][takes[i].length - 1].y];
					Piece.takePiece(board, take, false);
					takes[i][0].extraTakes = [];
					var extraMoves = Piece.findPossibleTakes(take.x, take.y, currentPlayer);
					var previousTake = take;
					while (extraMoves.length > 0) {
						var extraTake = new Take(extraMoves[0].x, extraMoves[0].y, {x: extraMoves[0].takenPiece.x, y: extraMoves[0].takenPiece.y, piece: extraMoves[0].takenPiece.piece});
						takes[i][0].extraTakes.push(extraTake);
						Piece.scope.activePiece = [previousTake.x, previousTake.y];
						Piece.takePiece(board, extraTake, false);
						movesToRevert.push(extraTake);
						var extraMoves = Piece.findPossibleTakes(extraTake.x, extraTake.y, currentPlayer);
						previousTake = extraTake;
					}
					
					var value = MiniMax.minimax(board, 0 - currentPlayer, depth - 1);
					
					if (maximizingPlayer) {
						if (value[0] > bestValue) {
							bestValue = value[0];
							bestTake = takes[i];
						}
					} else {
						if (value[0] < bestValue) {
							bestValue = value[0];
							bestTake = takes[i];
						}
					}
					
					for (var t = 0; t < movesToRevert.length; t++) {
						Piece.undoTake(
								board,
								movesToRevert[t].x,
								movesToRevert[t].y,
								movesToRevert[t].takenPiece.x, 
								movesToRevert[t].takenPiece.y,
								movesToRevert[t].takenPiece.piece,
								takes[i][takes[i].length - 1].x, 
								takes[i][takes[i].length - 1].y,
								currentPlayer);
					}
					Piece.scope.activePiece = [takes[i][takes[i].length - 1].x, takes[i][takes[i].length - 1].y];
				}
			} else {
				for (var i = 0; i < moves.length; i++) {
					Piece.scope.activePiece = [moves[i][moves[i].length - 1].x, moves[i][moves[i].length - 1].y];
					for (var j = 0; j < moves[i].length - 1; j++) {
						Piece.movePiece(board,
								moves[i][j].x, 
								moves[i][j].y,
								false);
						
						var value = MiniMax.minimax(board, 0 - currentPlayer, depth - 1);
						
						if (maximizingPlayer) {
							if (value[0] > bestValue) {
								bestValue = value[0];
								bestMove = [moves[i][j], moves[i][moves[i].length - 1]];
							}
						} else {
							if (value[0] < bestValue) {
								bestValue = value[0];
								bestMove = [moves[i][j], moves[i][moves[i].length - 1]];
							}
						}
						
						Piece.undoMove(
								board,
								moves[i][j].x,
								moves[i][j].y,
								moves[i][moves[i].length - 1].x, 
								moves[i][moves[i].length - 1].y,
								currentPlayer);
						Piece.scope.activePiece = [moves[i][moves[i].length - 1].x, moves[i][moves[i].length - 1].y];
					}
				} 
			}
			
			return [bestValue, bestTake, bestMove];
		}
}