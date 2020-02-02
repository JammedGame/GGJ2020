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
	private _coverDiv: HTMLDivElement;
	private _story1Div: HTMLDivElement;
	private _story2Div: HTMLDivElement;
	private _story3Div: HTMLDivElement;
	private _theMenu: HTMLDivElement;
	private _tutorialDiv: HTMLDivElement;
	private _creditsDiv: HTMLDivElement;
    public constructor(camera: Camera)
    {
        super(camera);
    }
    protected init(camera: Camera)
    {
		// override
		this._menuDiv = <HTMLDivElement> document.getElementById(MENU_DIV);
		this._coverDiv = this._menuDiv.querySelector('#cover-div');
		this._story1Div = this._menuDiv.querySelector('#tutorial-1-div');
		this._story2Div = this._menuDiv.querySelector('#tutorial-2-div');
		this._story3Div = this._menuDiv.querySelector('#tutorial-3-div');
		this._theMenu = this._menuDiv.querySelector('#the-menu');
		this._tutorialDiv = this._menuDiv.querySelector('#tutorial-div');
		this._creditsDiv = this._menuDiv.querySelector('#credits-div');
		this._coverDiv.style.display = "block";
		this._story1Div.style.display = "none";
		this._story2Div.style.display = "none";
		this._story3Div.style.display = "none";
		this._theMenu.style.display = "none";
		this._tutorialDiv.style.display = "none";
		this._creditsDiv.style.display = "none";
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
			case 'cover-div':
				this._coverDiv.style.display = "none";
				this._story1Div.style.display = "block";
				break;
			case 'tutorial-1-div':
				this._story1Div.style.display = "none";
				this._story2Div.style.display = "block";
				break;
			case 'tutorial-2-div':
				this._story2Div.style.display = "none";
				this._story3Div.style.display = "block";
				break;
			case 'tutorial-3-div':
				this._story3Div.style.display = "none";
				this._theMenu.style.display = "block";
				break;			
			case 'menu-tutorial':
				this._theMenu.style.display = "none";
				this._tutorialDiv.style.display = "block";
				break;
			case 'tutorial-div':
				this._tutorialDiv.style.display = "none";
				this._theMenu.style.display = "block";
				break;
			case 'menu-credits':
				this._theMenu.style.display = "none";
				this._creditsDiv.style.display = "block";
				break;
			case 'credits-div':
				this._creditsDiv.style.display = "none";
				this._theMenu.style.display = "block";
				break;
		}
	}
}