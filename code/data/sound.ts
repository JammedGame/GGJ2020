export { GameSound }

import { Howl } from 'howler';

export const audioMenuBackground = new Howl({
	src: ['./resources/MenuBackground.mp3'],
	loop: true
});
export const audioInGameBackgtound = new Howl({
	src: ['./resources/InGameBackgtound.mp3'],
	loop: true,
	volume: 0.3
});
export const audioButton = new Howl({
	src: ['./resources/Button.wav'],
});  


class GameSound
{
    private static instance: GameSound;
	private _isMutedSfx:boolean = false;
    private _isMutedMusic:boolean = false;
    
    private constructor() {
    }

    get isMutedSfx(): boolean {
        return this._isMutedSfx;
    }

    get isMutedMusic(): boolean {
        return this._isMutedMusic;
    }

    set isMutedSfx(value: boolean) {
        this._isMutedSfx = value;
    }

    set isMutedMusic(value: boolean) {
        this._isMutedMusic = value;
    }

    static getInstance(): GameSound {
        if (!GameSound.instance) {
            GameSound.instance = new GameSound();
            audioMenuBackground.play();
        }
    
        return GameSound.instance;
      }

    public toggleSfx() {
        this._isMutedSfx = !this._isMutedSfx;
    }

    public toggleMusic(){
        if(this._isMutedMusic == false) {
            audioMenuBackground.stop();
            console.log("toggleMusic");
        } else {
            audioMenuBackground.play();
        }
        this._isMutedMusic = !this._isMutedMusic;
    }

}