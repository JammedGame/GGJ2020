export { Settings }

class Settings
{
    public static pause = false;
	public static debugGlobe = false;
	public static debugTilemap = null;
    public static controls = {
        move_up: 'w',
        move_down: 's',
        move_left: 'a',
        move_right: 'd',
        pause: ' ',
		debug_globe: 'o',
		debug_tilemap: 't',
    }
}