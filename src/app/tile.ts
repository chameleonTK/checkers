import { Token } from "./Token";

export class Tile {
    x: number;
    y: number
    playable: boolean;
    selected: boolean = false;
    token: Token = null;

    constructor(x: number, y:number, playable: boolean) {
        this.x = x;
        this.y = y;
        this.playable = playable;
    }

    select() {
        this.selected = true;
    }

    unselect() {
        this.selected = false;
    }

    setToken(token: Token) {
        this.token = token;
    }

    isEmpty(): Boolean {
        return this.token == null;
    }
}