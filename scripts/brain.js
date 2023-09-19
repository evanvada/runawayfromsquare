
function searchPath(brain, fall=0) {

	brain.openNodes = [];
	brain.closedNodes = [];
	brain.path = [];
	brain.path_progression = 0;

	// create starting node
	let start_node = {}
	start_node.x = brain.start_x
	start_node.y = brain.start_y
	start_node.fall = fall // distance fallen estimate
	start_node.g_cost = 0
	// start_node.h_cost = Math.abs(start_node.x-brain.end_x) + Math.abs(start_node.y-brain.end_y)
	start_node.h_cost = vecLength(start_node.x-brain.end_x, start_node.y-brain.end_y)
	start_node.cost = start_node.g_cost + start_node.h_cost
	brain.openNodes.push(start_node);

	while (brain.openNodes.length > 0) {

		// open node with the lowest cost
		let lowest_index = 0;
		for (let i = 0; i < brain.openNodes.length; i++) {
			if (brain.openNodes[i].cost < brain.openNodes[lowest_index].cost) {
				lowest_index = i;
			}
		}
		let current = brain.openNodes[lowest_index];

		// move current node from openNodes to closedNodes
		brain.openNodes.splice(lowest_index, 1);
		brain.closedNodes.push(current);

		// generate brain.path if found the end
		if (current.x == brain.end_x && current.y == brain.end_y) {
			let temp = current;
			brain.path.push(temp);
			while (temp.parent) {
				brain.path.push(temp.parent);
				temp = temp.parent;
			}
			brain.path.reverse();
			return true;
		}

		// for each possible nearby node
		let possible_neighbors = findPossibleNeighbors(brain, current)
		for (let i = 0; i < possible_neighbors.length; i++) {
			let possible_neighbor = possible_neighbors[i];

			let possible_closed_index = brain.closedNodes.findIndex(n => n.x == possible_neighbor.x && n.y == possible_neighbor.y)
			let possible_open_index = brain.openNodes.findIndex(n => n.x == possible_neighbor.x && n.y == possible_neighbor.y)

			// if the node is closed, we skip it
			if (possible_closed_index >= 0) {
				continue
			}

			// if this new node is already taken by someone else
			if (possible_open_index >= 0) {
				// deleted it if we offer a better cost
				if (possible_neighbor.total_cost <= brain.openNodes[possible_open_index].total_cost) {
					brain.openNodes.splice(possible_open_index, 1);
				// else skip this node
				} else {
					continue
				}
			}

			let neighbor = possible_neighbor

			brain.openNodes.push(neighbor);
		}
	}
	return false;
}






function jumpPath(e, jump_dir, jump_zone, dest_dir, dest_zone, can_jump, jump_max_zone = 1) {
	let input = { x_dir: 0, jump: false}

	if (can_jump && Math.abs(jump_dir) < jump_max_zone) {
		// when on the ground go in the jumping zone and jump
		if (Math.abs(jump_dir) > jump_zone) {
			input.x_dir = Math.sign(jump_dir)
		} else {
			input.jump = true
		}
	} else {
		// when in the air, go to the destination
		if (Math.abs(dest_dir) > dest_zone) {
			input.x_dir = Math.sign(dest_dir)
		}
	}

	return input
}







function followPath(e) {
	let left = false
	let right = false
	let jump = false

	if (e.brain.path != null && e.brain.path_progression+1 < e.brain.path.length) {

		let node = e.brain.path[e.brain.path_progression]
		let next_node = e.brain.path[e.brain.path_progression+1]

		// direction from entity to node
		let dir_node = node.x+0.5-e.x
		let dir_next_node = next_node.x+0.5-e.x

		let input = { x_dir: 0, jump: false}

		switch (next_node.move) {
			case "1x0 move":
					input.x_dir = Math.sign(dir_next_node)
				break;
			case "1x1 move":
				input = jumpPath(e, dir_node, 0.7, dir_next_node, 0.2, e.can_jump)
				break;

			case "4x2 move":
			case "3x2 move":
			case "2x2 move":
				input = jumpPath(e, dir_node+0.7*Math.sign(dir_next_node), 0.1, dir_next_node, 0.2, e.can_jump)
				break;
			case "1x2 move":
				input = jumpPath(e, dir_node, 0.1, dir_next_node, 0.2, e.can_jump)
				break;
			case "0x2 move":
				input = jumpPath(e, dir_node, 0.1, dir_next_node, 0.2, e.can_jump)
				break;
			
			case "5x1 move":
			case "4x1 move":
			case "3x1 move":
			case "2x1 move":
				input = jumpPath(e, dir_node+0.8*Math.sign(dir_next_node), 0.1, dir_next_node, 0.2, e.can_jump)
				break;
			case "1x1 move":
				input = jumpPath(e, dir_node, 0.1, dir_next_node, 0.2, e.can_jump)
				break;
			case "0x1 move":
				input = jumpPath(e, dir_node, 0.1, dir_next_node, 0.2, e.can_jump)
				break;

			case "1x3 fall":
			case "1x2 fall":
			case "1x1 fall":
			case "0x1 fall":
				input.x_dir = Math.sign(dir_next_node)
				break;
		}

		jump = input.jump
		if (input.x_dir < 0) {
			left = true
		} else if (input.x_dir > 0) {
			right = true
		}



		// add progression
		if (next_node.x == Math.floor(e.x) && next_node.y == Math.floor(e.y)) {
			e.brain.path_progression += 1
		}
	}

	controlEntity(e, left, right, jump)
}




















function findPossibleNeighbors(brain, node) {
	neighbors = []
	// for each possible move, create a neighbout node
	let moves = findPossibleMoves(node, -1)
	moves = moves.concat(findPossibleMoves(node, 1));
	for (var i = 0; i < moves.length; i++) {
		let n = {}
		n.x = node.x+moves[i].x
		n.y = node.y+moves[i].y
		// update distance fallen
		if (moves[i].type.includes("fall")) {
			n.fall = node.fall
			if (moves[i].fall != null) {
				n.fall += moves[i].fall
			}
		} else {
			n.fall = 0
		}
		n.move = moves[i].type
		n.parent = node
		n.g_cost = node.g_cost + vecLength(n.x-node.x, n.y-node.y)
		// n.h_cost = Math.abs(brain.end_x-n.x) + Math.abs(brain.end_y-n.y)
		n.h_cost = vecLength(brain.end_x-n.x, brain.end_y-n.y)

		// let ally_cost

		n.cost = n.g_cost + n.h_cost
		neighbors.push(n)
	}
	return neighbors
}



function findPossibleMoves(node, flip=1) {
	let moves = []

	let O = 0 // void
	let W = 1 // wall
	let T = function(match, x_shift, y_shift) { return mapGet(node.x+x_shift*flip, node.y+y_shift, 1) == match }



// head bump jump & walk

// ░█░
// ☺·X   ☺X
// █·░   █░

	if (T(W,0, 1) // ground
	 && T(W,1, 1)
	 && T(O,1, 0)
	 && T(O,1,+1)
	 && T(O,2, 0))// end
		moves.push({x: 2*flip, y: 0, type: "2x0 move"})

	if (T(W,0, 1) // ground
	 && T(O,1, 0))// end
		moves.push({x: 1*flip, y: 0, type: "1x0 move"})

// ░···X   ░··X   ░·X   ·X   X
// ░···░   ░··░   ░·░   ·░   ·
// ☺···░   ☺··░   ☺·░   ☺░   ☺
// █···░   █··░   █·░   █░   █

	if (T(W,0, 1) // ground
	 && T(O,1,-2) && T(O,2,-2) && T(O,3,-2)
	 && T(O,1,-1) && T(O,2,-1) && T(O,3,-1)
	 && T(O,1, 0) && T(O,2, 0) && T(O,3, 0)
	 && T(O,1,+1) && T(O,2,+1) && T(O,3,+1)
	 && T(O,4,-2))// end
		moves.push({x: 4*flip, y:-2, type: "4x2 move"})

	if (T(W,0, 1) // ground
	 && T(O,1,-2) && T(O,2,-2)
	 && T(O,1,-1) && T(O,2,-1)
	 && T(O,1, 0) && T(O,2, 0)
	 && T(O,1,+1) && T(O,2,+1)
	 && T(O,3,-2))// end
		moves.push({x: 3*flip, y:-2, type: "3x2 move"})

	if (T(W,0, 1) // ground
	 && T(O,1,-2)
	 && T(O,1,-1)
	 && T(O,1, 0)
	 && T(O,1,+1)
	 && T(O,2,-2))// end
		moves.push({x: 2*flip, y:-2, type: "2x2 move"})

	if (T(W,0, 1) // ground
	 && T(O,0,-2)
	 && T(O,0,-1)
	 && T(O,1,-2))// end
		moves.push({x: 1*flip, y:-2, type: "1x2 move"})

	if (T(W,0, 1) // ground
	 && T(O,0,-1)
	 && T(O,0,-2))// end
		moves.push({x: 0*flip, y:-2, type: "0x2 move"})



// ░····X   ░···X   ░··X   ░·X   ·X   X
// ☺····░   ☺···░   ☺··░   ☺·░   ☺░   ☺
// █····░   █···░   █··░   █·░   █░   █

	if (T(W,0, 1) // ground
	 && T(O,1,-1) && T(O,2,-1) && T(O,3,-1) && T(O,4,-1)
	 && T(O,1, 0) && T(O,2, 0) && T(O,3, 0) && T(O,4, 0)
	 && T(O,1,+1) && T(O,2,+1) && T(O,3,+1) && T(O,4,+1)
	 && T(O,5,-1))// end
		moves.push({x: 5*flip, y:-1, type: "5x1 move"})

	if (T(W,0, 1) // ground
	 && T(O,1,-1) && T(O,2,-1) && T(O,3,-1)
	 && T(O,1, 0) && T(O,2, 0) && T(O,3, 0)
	 && T(O,1,+1) && T(O,2,+1) && T(O,3,+1)
	 && T(O,4,-1))// end
		moves.push({x: 4*flip, y:-1, type: "4x1 move"})

	if (T(W,0, 1) // ground
	 && T(O,1,-1) && T(O,2,-1)
	 && T(O,1, 0) && T(O,2, 0)
	 && T(O,1,+1) && T(O,2,+1)
	 && T(O,3,-1))// end
		moves.push({x: 3*flip, y:-1, type: "3x1 move"})

	if (T(W,0, 1) // ground
	 && T(O,1,-1)
	 && T(O,1, 0)
	 && T(O,1,+1)
	 && T(O,2,-1))// end
		moves.push({x: 2*flip, y:-1, type: "2x1 move"})

	if (T(W,0, 1) // ground
	 && T(O,0,-1)
	 && T(O,1,-1))// end
		moves.push({x: 1*flip, y:-1, type: "1x1 move"})

	if (T(W,0, 1) // ground
	 && T(O,0,-1))// end
		moves.push({x: 0*flip, y:-1, type: "0x1 move"})


	if (node.fall > 5) {
		// ☺░
		// ··
		// ··
		// ░X
		if (T(O,0, 1)
		 && T(O,1, 1)
		 && T(O,0, 2)
		 && T(O,1, 2)
		 && T(O,1, 3))// end
			moves.push({x: 1*flip, y: 3, type: "1x3 fall", fall: 3})
	} else if (node.fall > 1) {
		// ☺░
		// ··
		// ░X
		if (T(O,0, 1)
		 && T(O,1, 1)
		 && T(O,1, 2))// end
			moves.push({x: 1*flip, y: 2, type: "1x2 fall", fall: 2})

		// ☺░
		// ·░
		// ·X
		if (T(O,0, 1)
		 && T(O,0, 2)
		 && T(O,1, 2))// end
			moves.push({x: 1*flip, y: 2, type: "1x2 fall", fall: 2})
	} else {
		// ☺·
		// ░X
		if (T(O,1, 0)
		 && T(O,1, 1))// end
			moves.push({x: 1*flip, y: 1, type: "1x1 fall", fall: 1})

		// // ☺░
		// // ·X
		// if (T(O,0, 1)
		//  && T(O,1, 1))// end
		// 	moves.push({x: 1*flip, y: 1, type: "1x1 fall", fall: 1})
	}

	// ☺
	// X
	if (T(O,0, 1))// end
		moves.push({x: 0*flip, y: 1, type: "0x1 fall", fall: 1})


	return moves
}

















