var UI = {
	cache: {
		counter: 0,
		shadow: ["3px 10px 9px -1px rgba(0,0,0,0.75)", "-3px -10px 9px -1px rgba(0,0,0,0.75)"],
		margin: ["15%", "30%"]
	},
	
	drawPossibleMovesAndTakes: function(possibleTakes, possibleMoves) {
		Board.draw();
		if (possibleTakes.length <= 0)
			for (var i = 0; i < possibleMoves.length; i++) {
				var row = possibleMoves[i].x;
				var col = possibleMoves[i].y;
				var id = "piece_" + row + "" + col;
				
				document.getElementById(id).setAttribute("style", "background-color: red;height:100%;cursor:pointer");
				document.getElementById(id).setAttribute("onclick", "Board.doMove(" + row + "," + col + ")")
			}
		
		for (var i = 0; i < possibleTakes.length; i++) {
			var row = possibleTakes[i].x;
			var col = possibleTakes[i].y;
			var id = "piece_" + row + "" + col;
			
			document.getElementById(id).setAttribute("style", "background-color: red;height:100%;cursor:pointer");
			document.getElementById(id).setAttribute("onclick", 
					"Board.doTake(" + row + "," + col + "," + possibleTakes[i].takenPiece.x + "," + possibleTakes[i].takenPiece.y + ")");
		}
	},
	
	clearPossibleMoves: function() {
		Board.draw();
	},
	
	highlightActivePiece: function(pieceId, color) {
		if (color == 1) {
			document.getElementById(pieceId).setAttribute("style", "opacity: 0.3;cursor: pointer;");
		} else if (color == -1) {
			document.getElementById(pieceId).setAttribute("style", "background-color: aliceblue;cursor: pointer;");
		}
	},
	reverseShadows: function() {
		var array = document.getElementsByClassName("piece");
		var counter = ++UI.cache.counter;
		for (var i = 0; i < array.length; i++) {
			
			var newShadow = UI.cache.shadow[counter % 2];
			var newMargin = UI.cache.margin[counter % 2];
			array[i].style['-moz-box-shadow'] = newShadow;
			array[i].style['box-shadow']= newShadow;
			array[i].style['-webkit-box-shadow']= newShadow;
			array[i].style['margin-top'] = newMargin;
		}
	}
}