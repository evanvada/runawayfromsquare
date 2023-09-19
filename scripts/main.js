

gravity = 0.01
friction = 0.98

player = new Player(2.5, 2.5);
monsters.push(new Monster(15.5, 2.5))
monsters.push(new Monster(15.5, 2.5))

camera = {
	x: 0,
	y: 0,
	zoom: 64,
}

toDrawBrain = false


function update() {
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.imageSmoothingEnabled = false;
	
	ctx.fillStyle = "rgba(63, 63, 127, 1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// if (key["u"]) {
	// 	console.log("searchPath")
	// 	monsters[0].brain.start_x = Math.floor(monsters[0].x)
	// 	monsters[0].brain.start_y = Math.floor(monsters[0].y)
	// 	monsters[0].brain.end_x = Math.floor(player.x)
	// 	monsters[0].brain.end_y = Math.floor(player.y)
	// 	searchPath(monsters[0].brain)
	// }

	// if (mouse.left && !last_mouse.left) {
	// 	let pos = Trans_SW(camera, mouse.x, mouse.y)
	// 	let x = Math.floor(pos.x)
	// 	let y = Math.floor(pos.y)
	// 	// console.log(x, y)
	// 	if (map[y] != null || map[y][x] != null) {
	// 		map[y][x] = !map[y][x]
	// 	}
	// }

	
	if (key["b"] && !last_key["b"]) {
		toDrawBrain = !toDrawBrain
	}

	
	if (key["+"]) { camera.zoom += 0.01*camera.zoom }
	if (key["-"]) { camera.zoom -= 0.01*camera.zoom }

	if (player.life > 0) {
		player.update()
	}
	updateArray(coins)

	if (score == max_score) {
		for (var i = 0; i < monsters.length; i++) {
			monsters[i].despawn()
		}


		let x = player.x+Math.random()*40-20
		let y = player.y+Math.random()*40-20
		if (Math.random() < 0.2) {
			for (var i = 0; i < 40; i++) {
				particles.push(new Particle(x, y, "rgba(255, 0, 0, 1)", 0.3, 5, 30))
				particles.push(new Particle(x, y, "rgba(255, 127, 0, 1)", 0.3, 5, 30))
				particles.push(new Particle(x, y, "rgba(63, 255, 0, 1)", 0.3, 5, 30))
				particles.push(new Particle(x, y, "rgba(0, 127, 255, 1)", 0.3, 5, 30))
				particles.push(new Particle(x, y, "rgba(127, 0, 255, 1)", 0.3, 5, 30))
			}
		}
	}


	updateArray(monsters)
	updateArray(particles)




	drawMap()
	drawArray(coins)
	drawArray(particles)
	if (player.life > 0) {
		player.draw()
	}
	drawArray(monsters)

	if (toDrawBrain) {
		drawBrain(monsters[0].brain)
	}

	const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
	gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
	gradient.addColorStop(Math.min(player.life/100, 1-player.hurting), "rgba(0, 0, 0, 0)");
	gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 10;
	ctx.lineJoin = "round";
	ctx.lineCap = 'round';
	ctx.font = "30px Arial";
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.strokeStyle = "rgba(63, 63, 127, 1)";
	ctx.strokeText(score+"/"+max_score, 10, 40);
	ctx.strokeText(Math.round(player.life), 10, 70);
	ctx.fillText(score+"/"+max_score, 10, 40);
	ctx.fillText(Math.round(player.life), 10, 70);

}









