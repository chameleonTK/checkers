import { Token } from "./Token";
import { Move } from "./Move";

export class Tile {
    x: number;
    y: number
    playable: boolean;
    selected: boolean = false;
    token: Token = null;
    
    move: Move = null;

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

    setMove(move: Move) {
        this.move = move;
    }

    isEmpty(): Boolean {
        return this.token == null;
    }
}