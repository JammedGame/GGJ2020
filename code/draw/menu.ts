export { Menu }

import { Scene } from "./scene";
import { Camera } from "./camera";
import { CANVAS_PARENT, MENU_DIV } from "../data/constants";
import { Settings } from "../settings";
import { Howl, Howler } from 'howler';

const audioMenuBackground = new Howl({
	src: ['./resources/MenuBackground.mp3'],
	loop: true
});
const audioInGameBackgtound = new Howl({
	src: ['./resources/InGameBackgtound.mp3'],
	loop: true,
	volume: 0.3
});
const audioButton = new Howl({
	src: ['./resources/Button.wav'],
});  

class Menu extends Scene
{
	private _menuDiv: HTMLDivElement;
	private _tutorial1Div: HTMLDivElement;
	private _tutorial2Div: HTMLDivElement;
	private _tutorial3Div: HTMLDivElement;
	private _creditsDiv: HTMLDivElement;
    public constructor(camera: Camera)
    {
        super(camera);
    }
    protected init(camera: Camera)
    {
		// override
		this._menuDiv = <HTMLDivElement> document.getElementById(MENU_DIV);
		this._tutorial1Div = this._menuDiv.querySelector('#tutorial-1-div');
		this._tutorial2Div = this._menuDiv.querySelector('#tutorial-2-div');
		this._tutorial3Div = this._menuDiv.querySelector('#tutorial-3-div');
		this._creditsDiv = this._menuDiv.querySelector('#credits-div');
		Settings.menuClick = this.onClick.bind(this);
		audioMenuBackground.play();
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
		this._tutorial1Div.style.display = "none";
		this._tutorial2Div.style.display = "none";
		this._tutorial3Div.style.display = "none";
		this._creditsDiv.style.display = "none";
	}
	private onClick(target: any): void {
		console.log(target);
		switch (target.id) {
			case 'menu-start-game':
				Settings.inMenu = false;
				this.toggleShown(false);
				audioMenuBackground.stop();
				audioButton.play();
				audioInGameBackgtound.play();
				break;				
			case 'menu-tutorial':
				this._tutorial1Div.style.display = "block";
				break;
			case 'tutorial-1-div':
				this._tutorial1Div.style.display = "none";
				this._tutorial2Div.style.display = "block";
				break;
			case 'tutorial-2-div':
				this._tutorial2Div.style.display = "none";
				this._tutorial3Div.style.display = "block";
				break;
			case 'tutorial-3-div':
				this._tutorial3Div.style.display = "none";
				break;
			case 'menu-credits':
				this._creditsDiv.style.display = "block";
				break;
			case 'credits-div':
				this._creditsDiv.style.display = "none";
				break;
		}
	}
}