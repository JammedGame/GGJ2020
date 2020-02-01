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
            pause: () => Settings.pause = !Settings.pause,
            debug_globe: () => Settings.debugGlobe = !Settings.debugGlobe,
        }
        document.addEventListener('keydown', event => this.keyDown(event.key));
        document.addEventListener('keyup', event => this.keyUp(event.key));
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