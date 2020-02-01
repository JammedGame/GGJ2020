export { Tile, Tilemap }

const POLLUTION_SPREAD_RATE: number = 0.01;
const OZONE_DAMAGE_RATE: number = 0.01;
const EARTH_SCORCH_RATE: number = 0.01;
const EARTH_HEAL_RATE: number = 0.01;

class Tile {
	x: number; // 0..width
	y: number; // 0..height
	pollution: number; // 0..1
	pollutionDiff: number;
	ozone: number; // 0..1
	trail: boolean;
	wind: [number, number]; // [-1..1, -1..1] 
	scorch: number; // 0..1
}

class Tilemap {
	width: number;
	height: number;
	matrix: Tile[][];

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.matrix = [];
		for (let x = 0; x < width; x++) {
			this.matrix[x] = [];
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

	getTileAt(x: number, y: number): Tile {
		if (x < 0) x += this.width;
		else if (x >= this.width) x += this.width;

		if (y < 0) { y = 1 - y; x = (x + this.width / 2) % this.width; }
		else if (y >= this.height) { y = 2 * this.height - y - 1; x = (x + this.width / 2) % this.width; }

		return this.matrix[x][y];
	}

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
	setTrailAt(x: number, y: number, value: boolean): void { this.matrix[x][y].trail = value; };
	clearTrail(): void { this.matrix.forEach(column => column.forEach(tile => tile.trail = false)); }
	restoreOzoneAt(x: number, y: number): void { this.matrix[x][y].ozone = 1; }

	simulate(): void {
		this.spreadPollution();
		this.damageOzone();
		this.scorchOrHealEarth();
	}
	spreadPollution(): void {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile = this.matrix[x][y];
				if (tile.wind[0] == 0 && tile.wind[1] == 1) continue;

				let spreadAmount = POLLUTION_SPREAD_RATE * tile.pollution;
				let totalWind = Math.abs(tile.wind[0]) + Math.abs(tile.wind[1]);

				if (tile.wind[0] > 0) this.getTileAt(x + 1, y).pollutionDiff += spreadAmount * tile.wind[0] / totalWind; // spread east
				else if (tile.wind[0] < 0) this.getTileAt(x - 1, y).pollutionDiff -= spreadAmount * tile.wind[0] / totalWind // spread west

				if (tile.wind[1] > 0) this.getTileAt(x, y + 1).pollutionDiff += spreadAmount * tile.wind[1] / totalWind // spread north
				else if (tile.wind[1] < 0) this.getTileAt(x, y - 1).pollutionDiff -= spreadAmount * tile.wind[1] / totalWind // spread south

				tile.pollution -= spreadAmount;
			}
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile = this.matrix[x][y];
				tile.pollution += tile.pollutionDiff;
				tile.pollutionDiff = 0;
			}
		}
	}
	damageOzone(): void {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile = this.matrix[x][y];
				tile.ozone -= tile.pollution * OZONE_DAMAGE_RATE;
				if (tile.ozone < 0) tile.ozone = 0;
			}
		}
	}
	scorchOrHealEarth(): void {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile = this.matrix[x][y];
				if (tile.ozone == 0) {
					tile.scorch += EARTH_SCORCH_RATE;
					if (tile.scorch > 1) tile.scorch = 1;
				} else {
					tile.scorch -= EARTH_HEAL_RATE;
					if (tile.scorch < 0) tile.scorch = 0;
				}
			}
		}
	}
}
