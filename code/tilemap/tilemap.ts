export { Tile, Tilemap }

class Tile {
	x: number; // 0..width
	y: number; // 0..height
	pollution: number; // 0..1
	ozone: number; // 0..1
	trail: boolean;
	wind: [number, number]; // [-1..1, -1..1] 
	scorch: number; // 0..1
}

class Tilemap {
	matrix: Tile[][];

	constructor(width: number, height: number) {
		this.matrix = Tile[width][height];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				let newTile = new Tile();
				newTile.x = x;
				newTile.y = y;
				newTile.pollution = 0;
				newTile.ozone = 1;
				newTile.trail = false;
				newTile.wind = [0, 0];
				newTile.scorch = 0;
				this.matrix[x][y] = newTile;
			}
		}
	}

	getTileAt(x: number, y: number): Tile { return this.matrix[x][y]; }
	getPollutionAt(x: number, y: number): number { return this.matrix[x][y].pollution; };
	getOzoneAt(x: number, y: number): number { return this.matrix[x][y].ozone; };
	getScorchAt(x: number, y: number): number { return this.matrix[x][y].scorch; };
	getWindAt(x: number, y: number): [number, number] { return this.matrix[x][y].wind; };
	getTrailAt(x: number, y: number): boolean { return this.matrix[x][y].trail; };

	getPollutionMatrix(): number[][] { return this.matrix.map(column => column.map(tile => tile.pollution)); };
	getOzoneMatrix(): number[][] { return this.matrix.map(column => column.map(tile => tile.ozone)); };
	getScorchMatrix(): number[][] { return this.matrix.map(column => column.map(tile => tile.scorch)); };
	getTrailPositions(): [number, number][] { return [].concat(...this.matrix).filter(tile => tile.trail).map(tile => tile.wind); };

	setPollutionAt(x: number, y: number, value: number): void { this.matrix[x][y].pollution = value; };
	setWindAt(x: number, y: number, vx: number, vy: number): void { this.matrix[x][y].wind = [vx, vy]; };
}
