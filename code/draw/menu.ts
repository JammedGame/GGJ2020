export { Menu }

import { Scene } from "./scene";
import { Camera } from "./camera";
import { CANVAS_PARENT, MENU_DIV } from "../data/constants";
import { Settings } from "../settings";

class Menu extends Scene
{
	private _menuDiv: HTMLDivElement;
    public constructor(camera: Camera)
    {
        super(camera);
    }
    protected init(camera: Camera)
    {
		// override
		this._menuDiv = <HTMLDivElement> document.getElementById(MENU_DIV);
		Settings.menuClick = this.onClick.bind(this);
    }

    public update()
    {
        // override
	}
	public hideRenderer(): boolean {
		// override
		return true;
	}
	public toggleShown(shown: boolean): void
	{
		// override
		this._menuDiv.style.display = shown ? 'block' : 'none';
	}
	private onClick(target: any): void {
		console.log(target);
		console.log(typeof target);
		switch (target.id) {
			case 'menu-start-game':
				Settings.inMenu = false;
				this.toggleShown(false);
				break;
		}
	}
}