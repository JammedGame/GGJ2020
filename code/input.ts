export { Input, MovementDirection }

import { Settings } from "./settings";
import { Log } from "./util/log";

enum MovementDirection
{
    none = 'none',
    up = 'up',
    down = 'down',
    left = 'left',
    right = 'right'
}

class Input
{
    private _actions: any;
    private _movement: any;
    public get direction(): MovementDirection { return this._movement.direction; }
    public constructor()
    {
        this._actions = {
            zoom: () => Settings.zoom = !Settings.zoom,
            pause: () => Settings.pause = !Settings.pause,
			debug_globe: () => Settings.debugGlobe = !Settings.debugGlobe,
			debug_tilemap: () => { if (typeof Settings.debugTilemap == 'function') Settings.debugTilemap(); },
			reset_game: () => { if (typeof Settings.resetGame == 'function') Settings.resetGame(); },
			menu_click: (target: EventTarget) => { if (typeof Settings.menuClick == 'function') Settings.menuClick(target); },
        }
        this._movement = { direction: MovementDirection.none };
        document.addEventListener('keydown', event => this.keyDown(event.key));
		document.addEventListener('keyup', event => this.keyUp(event.key));
		document.addEventListener('click', event => this.click(event.target));
    }
    private keyDown(key) : void
    {
        Log.message('Key ' + key + ' down', 'Input');
        for(let direction in MovementDirection) {
            if(key === Settings.controls['move_'+direction]) {
                this._movement[direction] = true;
                this._movement.direction = direction;
            }
        }
        for(let actionName in this._actions) {
            if(key === Settings.controls[actionName]) {
                this._actions[actionName]();
            }
        }
    }
    private keyUp(key) : void
    {
        for(let direction in MovementDirection) {
            if(key === Settings.controls['move_'+direction]) {
                this._movement[direction] = false;
                this.updateDirections();
            }
        }
	}
	private click(target: EventTarget): void {
		if (Settings.inMenu) {
			this._actions.menu_click(target);
		}
	}
    private updateDirections() : void
    {
        this._movement.direction = MovementDirection.none;
        for(let direction in MovementDirection) {
            if(this._movement[direction]) {
                this._movement.direction = direction;
            }
        }
    }
}