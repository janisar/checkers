<html>
	<head>
		<title>Checkers</title>
		<link rel="stylesheet" href="assets/css/style.css">
	</head>
	<body onload="Board.draw()">

		<input type="radio" checked id="radio-me" name="select"/>    
		<input type="radio" id="radio-opp" name="select"/>    
		<div class="separator"></div>
		<div class="space3d">                
			<div class="_3dbox">      
				<div class="_3dface _3dface--front"></div>      
				<div class="_3dface _3dface--top">
						<div id = "checkersBoard" class = "checkersBoard"></div>
				</div>      
				<div class="_3dface _3dface--bottom"></div>      
				<div class="_3dface _3dface--left"></div>      
				<div class="_3dface _3dface--right"></div>      
				<div class="_3dface _3dface--back"></div>    
			</div>    
		</div>
		<script type="text/javascript" src="assets/js/ui.js"></script>		
		<script type="text/javascript" src="assets/js/game.js"></script>
		<script type="text/javascript" src="assets/js/Util.js"></script>		
		<script type="text/javascript" src="assets/js/board.js"></script>
		<script type="text/javascript" src="assets/js/piece.js"></script>
		<script type="text/javascript" src="assets/js/minimax.js"></script>
		<script type="text/javascript" src="assets/js/ai.js"></script>
		<script>
			document.getElementById("radio-me").addEventListener("click", UI.reverseShadows);
			document.getElementById("radio-opp").addEventListener("click", UI.reverseShadows);
		</script>
	</body>
</html>
