import { WORLD_WIDTH } from "../data/constants";

export { Tile }

class Tile {
	x: number; // 0..width
	y: number; // 0..height
	pollution: number; // 0..INF
	pollutionDiff: number;
	ozone: number; // 0..1
	ozoneRepairGlow: number; // 0..1
	ozonaTakeDiffuseDamage: boolean;
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

	reset() : void {
		this.pollution = 0;
		this.pollutionDiff = 0;
		this.ozone = 1;
		this.ozoneRepairGlow = 0;
		this.ozonaTakeDiffuseDamage = false;
		this.trail = false;
		this.scorch = 0;
		this.visited = false;
	}
}