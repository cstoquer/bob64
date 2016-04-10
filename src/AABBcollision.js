
function AABBcollision(a, b) {
	return a.x < b.x + b.width  
		&& a.y < b.y + b.height
		&& b.x < a.x + a.width 
		&& b.y < a.y + a.height;
}

module.exports = AABBcollision;
