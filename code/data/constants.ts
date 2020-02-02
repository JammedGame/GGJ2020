export {    DEFAULT_FOV,
            RESOLUTION,
            CLIPPING,
            MAPS,
            GLOBE_SCALE,
            GLOBE_PRECISION,
            PLAYER_SCALE,
            WORLD_WIDTH,
            WORLD_HEIGHT,
            WIND_INTERPOLATION_GRADIENT,
            WIND_INTERPOLATION_MAX_DISTANCE,
            POLLUTION_SPREAD_RATE,
            OZONE_DAMAGE_RATE,
            EARTH_SCORCH_RATE,
            EARTH_HEAL_RATE,
            OZONE_SCALE,
            PLAYER_Z_POSITION
}
const DEFAULT_FOV = 45;
const RESOLUTION =
{
    X: 1366,
    Y: 768
};
const CLIPPING =
{
    NEAR: 0.01,
    FAR: 1000
}
const MAPS =
{
    COLOR: '../../resources/earth.jpg',
    NORMAL: '../../resources/normal.jpg',
    BUMP: '../../resources/bump.jpg',
    SPECULAR: '../../resources/specular.jpg'
}
const GLOBE_SCALE = 1.0;
const GLOBE_PRECISION = 72;
const PLAYER_SCALE = 0.05;
const OZONE_SCALE: number = 1.05;
const PLAYER_Z_POSITION: number = 1.12;

const WORLD_WIDTH: number = 72;
const WORLD_HEIGHT: number = 36;

const WIND_INTERPOLATION_GRADIENT: number = 0.5;
const WIND_INTERPOLATION_MAX_DISTANCE: number = 5;
const POLLUTION_SPREAD_RATE: number = 0.1;
const OZONE_DAMAGE_RATE: number = 0.002;
const EARTH_SCORCH_RATE: number = 0.01;
const EARTH_HEAL_RATE: number = 0.005;
