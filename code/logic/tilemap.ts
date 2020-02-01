import {
	WORLD_WIDTH,
	WORLD_HEIGHT,
	POLLUTION_SPREAD_RATE,
	OZONE_DAMAGE_RATE,
	EARTH_SCORCH_RATE,
	EARTH_HEAL_RATE
} from "../data/constants";

export { Tile, Tilemap }

class Tile {
	x: number; // 0..width
	y: number; // 0..height
	pollution: number; // 0..INF
	pollutionDiff: number;
	ozone: number; // 0..1
	trail: boolean;
	wind: [number, number]; // [-INF..INF, -INF..INF]
	scorch: number; // 0..1

	toString(): string {
		return "pollution:" + this.pollution.toFixed(2) + " | ozone:" + this.ozone.toFixed(2) + "\nwind:[" + this.wind[0].toFixed(2) + "," + this.wind[1].toFixed(2) + "] | scorch:" + this.scorch.toFixed(2);
	}
}

class Tilemap {
	readonly width: number;
	readonly height: number;
	readonly matrix: Tile[][];
	debuggingEnabled: boolean;

	constructor() {
		this.width = WORLD_WIDTH;
		this.height = WORLD_HEIGHT;
		this.matrix = [];
		for (let x = 0; x < this.width; x++) {
			this.matrix[x] = [];
			for (let y = 0; y < this.height; y++) {
				let newTile: Tile = new Tile();
				newTile.x = x;
				newTile.y = y;
				newTile.pollution = 0;
				newTile.pollutionDiff = 0;
				newTile.ozone = 1;
				newTile.trail = false;
				newTile.wind = [0, 0];
				newTile.scorch = 0;
				this.matrix[x][y] = newTile;
			}
		}
	}

	log(): void {
		let logMatrix: string[][] = this.matrix.map(column => column.map(tile => tile.toString()));
		console.table(logMatrix);
	}

	getTileWrapped(x: number, y: number): Tile {
		if (x < 0) x += this.width;
		else if (x >= this.width) x -= this.width;

		if (y < 0) { y = 0 }
		else if (y >= this.height) { y = this.height - 1; }

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
	repairOzoneAt(x: number, y: number): void { this.matrix[x][y].ozone = 1; }

	simulate(): void {
		// earth is scorched or healed where necessary
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				if (tile.ozone == 0) {
					tile.scorch += EARTH_SCORCH_RATE;
					if (tile.scorch > 1) tile.scorch = 1;
				} else {
					tile.scorch -= EARTH_HEAL_RATE;
					if (tile.scorch < 0) tile.scorch = 0;
				}
			}
		}

		// ozone is damaged
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				tile.ozone -= tile.pollution * OZONE_DAMAGE_RATE;
				if (tile.ozone < 0) tile.ozone = 0;
			}
		}

		// wind spreads pollution
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				if (tile.wind[0] == 0 && tile.wind[1] == 0) continue;

				let spreadAmount: number = POLLUTION_SPREAD_RATE * tile.pollution;
				let totalWind: number = Math.abs(tile.wind[0]) + Math.abs(tile.wind[1]);

				if (tile.wind[0] > 0) {
					let tile: Tile = this.getTileWrapped(x + 1, y);
					tile.pollutionDiff += spreadAmount * tile.wind[0] / totalWind; // spread east
				} else if (tile.wind[0] < 0) {
					let tile: Tile = this.getTileWrapped(x - 1, y);
					tile.pollutionDiff -= spreadAmount * tile.wind[0] / totalWind // spread west
				}

				if (tile.wind[1] > 0) {
					let tile: Tile = this.getTileWrapped(x, y + 1);
					tile.pollutionDiff += spreadAmount * tile.wind[1] / totalWind // spread north
				} else if (tile.wind[1] < 0) {
					let tile: Tile = this.getTileWrapped(x, y - 1);
					tile.pollutionDiff -= spreadAmount * tile.wind[1] / totalWind // spread south
				}

				tile.pollution -= spreadAmount;
			}
		}

		// pollution is resolved
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				tile.pollution += tile.pollutionDiff;
				tile.pollutionDiff = 0;
			}
		}
	}
}