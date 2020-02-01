export {    DEFAULT_FOV,
            RESOLUTION,
            CLIPPING,
            MAPS,
            GLOBE_SCALE,
            GLOBE_PRECISION,
            PLAYER_SCALE,
            WORLD_WIDTH,
            WORLD_HEIGHT,
            POLLUTION_SPREAD_RATE,
            OZONE_DAMAGE_RATE,
            EARTH_SCORCH_RATE,
            EARTH_HEAL_RATE,
            OZONE_SCALE
}
const DEFAULT_FOV = 75;
const RESOLUTION =
{
    X: 1366,
    Y: 768
};
const CLIPPING =
{
    NEAR: 0.1,
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
const GLOBE_PRECISION = 256;
const PLAYER_SCALE = 0.05;

const WORLD_WIDTH = 72;
const WORLD_HEIGHT = 36;

const OZONE_SCALE: number = 1.1;
const POLLUTION_SPREAD_RATE: number = 0.1;
const OZONE_DAMAGE_RATE: number = 0.02;
const EARTH_SCORCH_RATE: number = 0.01;
const EARTH_HEAL_RATE: number = 0.005;
