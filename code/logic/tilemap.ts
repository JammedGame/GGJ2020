import {
	WORLD_WIDTH,
	WORLD_HEIGHT,
	WORLD_POLE_HEIGHT,
	WIND_INTERPOLATION_GRADIENT,
	WIND_INTERPOLATION_MAX_DISTANCE,
	POLLUTION_SPREAD_RATE,
	OZONE_DAMAGE_RATE,
	EARTH_SCORCH_RATE,
	EARTH_HEAL_RATE
} from "../data/constants";
import { Vector2 } from "three";

export { Tilemap }

class Tile {
	x: number; // 0..width
	y: number; // 0..height
	pollution: number; // 0..INF
	pollutionDiff: number;
	ozone: number; // 0..1
	trail: boolean;
	wind: [number, number]; // [-INF..INF, -INF..INF]
	interpolatedWind: [number, number];
	scorch: number; // 0..1
	visited: boolean;

	distanceWrapped(other: Tile): number {
		let xDistance = Math.abs(this.x - other.x);
		xDistance = Math.min(xDistance, WORLD_WIDTH - xDistance);
		let yDistance = this.y - other.y;
		return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
	}

	getWindiness(): number {
		return Math.sqrt(this.wind[0] * this.wind[0] + this.wind[1] * this.wind[1]);
	}

	toString(): string {
		return "pollution:" + this.pollution.toFixed(2) + " | ozone:" + this.ozone.toFixed(2) + "\nwind:[" + this.wind[0].toFixed(2) + "," + this.wind[1].toFixed(2) + "] | scorch:" + this.scorch.toFixed(2);
	}
}

class Tilemap {
	private readonly width: number;
	private readonly height: number;
	private readonly matrix: Tile[][];
	private debuggingEnabled: boolean;

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
				newTile.interpolatedWind = [0, 0];
				newTile.scorch = 0;
				this.matrix[x][y] = newTile;
			}
		}
	}

	log(): void {
		let logMatrix: string[][] = this.matrix.map(column => column.map(tile => tile.toString()));
		console.table(logMatrix);
		console.log("press T to advance simulation step-by-step");
	}

	debug(): void {
		if (!this.debuggingEnabled) {
			this.debuggingEnabled = true;
			this.log();
		} else {
			this.simulate();
			this.log();
		}
	}

	private getTileWrapped(x: number, y: number): Tile {
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
	clearTrail(): void { this.matrix.forEach(column => column.forEach(tile => tile.trail = false)); }
	repairOzoneAt(x: number, y: number): void { this.matrix[x][y].ozone = 1; }

	setTrailAt(x: number, y: number, value: boolean): void
	{
		if (this.matrix[x][y].trail != value)
		{
			this.matrix[x][y].trail = value;
			if (value) this.checkIfTrailsFormLoop();
		}
	};

	checkIfTrailsFormLoop() : void {
		let hotEscapedTiles : Tile[] = [];
		let trailBroken : boolean = false;

		for(let i = 0; i < WORLD_WIDTH; i++)
		{
			hotEscapedTiles.push(this.getTileWrapped(i, 0));
			hotEscapedTiles.push(this.getTileWrapped(i, WORLD_HEIGHT - 1));

			for(let j = 0; j < WORLD_HEIGHT; j++)
			{
				let tile = this.getTileWrapped(i, j);
				tile.visited = false;

				if (tile.trail && tile.ozone <= 0)
				{
					trailBroken = true;
				}
			}
		}

		if (trailBroken)
		{
			this.clearTrail();
			return;
		}

		while(hotEscapedTiles.length > 0)
		{
			let tile = hotEscapedTiles.pop();
			tile.visited = true;
			let hasTrail = this.getTrailAt(tile.x, tile.y);

			if (!hasTrail)
			{
				let leftTile = this.getTileWrapped(tile.x - 1, tile.y);
				let leftUpTile = this.getTileWrapped(tile.x - 1, tile.y + 1);
				let rightTile = this.getTileWrapped(tile.x + 1, tile.y);
				let rightUpTile = this.getTileWrapped(tile.x + 1, tile.y + 1);
				let upTile = this.getTileWrapped(tile.x, tile.y + 1);
				let leftBottomTile = this.getTileWrapped(tile.x - 1, tile.y - 1);
				let bottomTile = this.getTileWrapped(tile.x, tile.y - 1);
				let rightBottomTile = this.getTileWrapped(tile.x + 1, tile.y - 1);

				if (!leftTile.visited) hotEscapedTiles.push(leftTile);
				if (!leftUpTile.visited) hotEscapedTiles.push(leftUpTile);
				if (!rightTile.visited) hotEscapedTiles.push(rightTile);
				if (!rightUpTile.visited) hotEscapedTiles.push(rightUpTile);
				if (!upTile.visited) hotEscapedTiles.push(upTile);
				if (!leftBottomTile.visited) hotEscapedTiles.push(leftBottomTile);
				if (!bottomTile.visited) hotEscapedTiles.push(bottomTile);
				if (!rightBottomTile.visited) hotEscapedTiles.push(rightBottomTile);
			}
		}

		let loopedTiles : Vector2[] = [];
		for(let i = 0; i < WORLD_WIDTH; i++)
			for(let j = 0; j < WORLD_HEIGHT; j++)
			{
				let tile = this.getTileWrapped(i, j);
				if (!tile.trail && !tile.visited)
				{
					loopedTiles.push(new Vector2(i, j));
				}
			}

		if (loopedTiles.length > 0)
		{
			for(let i = 0; i < loopedTiles.length; i++)
				this.repairOzoneAt(loopedTiles[i].x, loopedTiles[i].y);

			this.clearTrail();
		}
	}

	interpolateWind(): void {
		// interpolate wind values based on closest windy neighbour
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				if (tile.wind[0] != 0 || tile.wind[1] != 0) continue;

				let closestTile: Tile = this.findClosestWindyTile(tile);
				if (closestTile == null) continue;

				let distance: number = tile.distanceWrapped(closestTile);
				let coefficient = Math.pow(WIND_INTERPOLATION_GRADIENT, distance);
				tile.interpolatedWind[0] = coefficient * closestTile.wind[0];
				tile.interpolatedWind[1] = coefficient * closestTile.wind[1];
			}
		}

		// apply interpolated wind values
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let tile: Tile = this.matrix[x][y];
				if (tile.wind[0] != 0 || tile.wind[1] != 0) continue;

				tile.wind = tile.interpolatedWind;
			}
		}
	}

	private findClosestWindyTile(tile: Tile): Tile {
		for (let radius = 1; radius <= WIND_INTERPOLATION_MAX_DISTANCE; radius++) {
			// find all candidate tiles at the current radius
			let candidateTiles: Tile[] = [];
			for (let x = tile.x - radius; x < tile.x + radius; x++) {
				for (let y = tile.y - radius; y < tile.y + radius; y++) {
					let otherTile: Tile = this.getTileWrapped(x, y);
					if (otherTile != tile && (otherTile.wind[0] != 0 || otherTile.wind[1] != 0)) candidateTiles.push(otherTile);
				}
			}

			// return the windiest candidate tile
			if (candidateTiles.length > 0) {
				let windiestTile = candidateTiles[0];
				let maxWindiness = windiestTile.getWindiness();
				for (let i = 1; i < candidateTiles.length; i++) {
					let otherTile: Tile = candidateTiles[i];
					let windiness = otherTile.getWindiness()
					if (windiness > maxWindiness) {
						windiestTile = otherTile;
						maxWindiness = windiness;
					}
				}

				return windiestTile;
			}
		}

		return null;
	}

	simulate(): void {
		let simulateStart: number = performance.now();

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
				if (y < WORLD_POLE_HEIGHT || y >= WORLD_HEIGHT - WORLD_POLE_HEIGHT) continue;

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

				let totalWind: number = Math.abs(tile.wind[0]) + Math.abs(tile.wind[1]);
				let spreadAmount: number = POLLUTION_SPREAD_RATE * tile.pollution * totalWind;

				if (tile.wind[0] > 0) {
					let otherTile: Tile = this.getTileWrapped(x + 1, y);
					otherTile.pollutionDiff += spreadAmount * tile.wind[0] / totalWind; // spread east
				} else if (tile.wind[0] < 0) {
					let otherTile: Tile = this.getTileWrapped(x - 1, y);
					otherTile.pollutionDiff -= spreadAmount * tile.wind[0] / totalWind // spread west
				}

				if (tile.wind[1] > 0) {
					let otherTile: Tile = this.getTileWrapped(x, y + 1);
					otherTile.pollutionDiff += spreadAmount * tile.wind[1] / totalWind // spread north
				} else if (tile.wind[1] < 0) {
					let otherTile: Tile = this.getTileWrapped(x, y - 1);
					otherTile.pollutionDiff -= spreadAmount * tile.wind[1] / totalWind // spread south
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

		let simulateEnd: number = performance.now();
		if (this.debuggingEnabled) {
			console.log("simulate execution time " + (simulateEnd - simulateStart) + " milliseconds");
		}
	}
}
