var Util = {
	getCopyOfPiece: function(piece) {
		var newPiece = new P(piece.color);
		
		newPiece.setType(piece.getType());
		newPiece.setTypeList(piece.getTypeList());
		
		return newPiece;
	}
}

var directions = [{x: 1, y: 1}, 
                  {x: 1, y: -1}, 
                  {x: -1, y: 1}, 
                  {x: -1, y: -1}];


function myMove(oldRow, oldCol, newRow, newCol, cpu) {
	var oldId = "piece_" + oldRow + "" + oldCol;
	
	var length = (newRow > oldRow) ? (newRow - oldRow) : (oldRow - newRow);
	var x = (newRow > oldRow) ? 1 : -1;
	var y = (newCol > oldCol) ? -1: 1;
	
	var elem = document.getElementById(oldId);   
	
	var pos = 0;
	var id = setInterval(frame, 1.5);
	
	function frame() {
    if (pos == length * 100) {
    	clearInterval(id);
    	Game.scope.currentPlayer = 0 - Game.scope.currentPlayer;
    	Board.draw();
    	
		if (!Game.checkWin()) {
			if (!cpu) {
				AI.makeMove();
			} else {
				//my move;
			}
		}
    } else {
    	pos ++; 
    	elem.style.top = (pos * x) + '%'; 
    	elem.style.left = (pos * y) + '%'; 
    }
  }
}

function myTake(oldRow, oldCol, take, color, cpu) {
	var oldId = "piece_" + oldRow + "" + oldCol;
	var takenId = "piece_" + take.takenPiece.x + "" + take.takenPiece.y;
	var newRow = take.x;
	var newCol = take.y;
	
	var length = (newRow > oldRow) ? (newRow - oldRow) : (oldRow - newRow);
	var x = (newRow > oldRow) ? 1 : -1;
	var y = (newCol > oldCol) ? -1: 1;
	var deg2rad = Math.PI / 180;
	
	var elem = document.getElementById(oldId);  
	var takenPiece = document.getElementById(takenId);
	elem.style['z-index'] = 100;
	
	var pos = 0;
	var rad = 1;
	var top = 0;
	var id = setInterval(frame, 1.5);
	Piece.scope.activePiece = [take.x, take.y];
	
	function frame() {
		if (pos == length * 100) {
			elem.style['z-index'] = 10;
	    	clearInterval(id);
	    	Board.draw();
	    	
	    	if (!Game.checkWin()) {
	    		var takes = Piece.findPossibleTakes(newRow, newCol, color);
	    		if (takes.length > 0) {
	    			if (!cpu)
	    				UI.drawPossibleMovesAndTakes(takes, []);
	    			else {
	    				
	    				//TODO: Find the best take, because there could be more than one option.
	    				var extraTake = new Take(takes[0].x, takes[0].y, {x: takes[0].takenPiece.x, y: takes[0].takenPiece.y});
    					Piece.takePiece(Board.scope.board, extraTake, true);
	    			}
	    		} else {
	    			Game.scope.currentPlayer = 0 - Game.scope.currentPlayer;
	    	    	Board.draw();
	    			if (!cpu) {
	    				AI.makeMove();
	    			}
	    		}
			}
	    } else {
	    	pos++; 
	    	
	    	if (length * 100 < 300 || (length * 100 >= 300 && (length*100 - pos) <= 200)) {
	    		var radius = document.getElementsByClassName("boardBox")[0].offsetWidth * 1.5;
	    		var rad = radius * Math.sin(pos * 0.9 * deg2rad);
	    		
	    		elem.style.top = (pos * x) - rad + '%'; 
	    		elem.style.left = (pos * y) + '%'; 
	    		
	    		if (length*100 - pos <= 60) {
	    			takenPiece.style.width = (length*100 - pos) + "%";
	    			takenPiece.style.height = (length*100 - pos) + "%";
	    			
	    		}
	    	} else {
	    		elem.style.top = (pos * x) + '%'; 
	        	elem.style.left = (pos * y) + '%'; 
	    	}
	    }
	}
}