export { Settings }

class Settings
{
    public static zoom = false;
	public static pause = false;
	public static inMenu = true;
	public static debugGlobe = false;
	public static resetGame: Function = null;
	public static debugTilemap: Function = null;
	public static menuClick: Function = null;
    public static controls = {
        move_up: 'w',
        move_down: 's',
        move_left: 'a',
        move_right: 'd',
        zoom: 'e',
        pause: ' ',
		debug_globe: 'o',
        debug_tilemap: 't',
        reset_game: 'r',
    }
}