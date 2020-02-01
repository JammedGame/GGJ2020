import { WORLD_WIDTH, WORLD_HEIGHT } from '../data/constants';

export { convertCoordinatesGeographicToPlanar, convertCoordinatesPolarToPlanar }

function convertCoordinatesGeographicToPlanar(latitude: number, longitude: number): [number, number] {
	let x = (longitude + 180) / 360 * WORLD_WIDTH;
	let y = (latitude + 90) / 180 * WORLD_HEIGHT;
	return [x, y];
}

function convertCoordinatesPolarToPlanar(degreesFromNorthClockwise: number, magnitude: number): [number, number] {
	let radians = degreesFromNorthClockwise / 180 * Math.PI;
	let x = magnitude * Math.sin(radians);
	let y = magnitude * Math.cos(radians);
	return [x, y];
}