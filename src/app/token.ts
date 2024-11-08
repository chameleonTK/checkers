import { Player } from "./Player";

export class Token {
    x: number;
    y: number;
    owner: Player;
    king: boolean = true;
    selected: boolean = false;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    setOwner(owner: Player) {
        this.owner = owner;
    }

    isKnight() {
        return !this.king;
    }

    isKing() {
        return this.king;
    }

    select() {
        this.selected = true;
    }

    unselect() {
        this.selected = false;
    }
}