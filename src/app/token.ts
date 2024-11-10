import { PlayableAgent } from "./Player";
import { Tile } from "./Tile";

export class Token {
    x: number;
    y: number;
    owner: PlayableAgent;
    king: boolean = false;
    selected: boolean = false;
    enabled: boolean = true;

    tile: Tile = null;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    setOwner(owner: PlayableAgent) {
        this.owner = owner;
    }

    promote() {
        this.king = true;
    }

    demote() {
        this.king = false;
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

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    setTile(tile: Tile) {
        this.tile = tile;
    }

    move(tile: Tile) {
        this.x = tile.x;
        this.y = tile.y;

        this.tile.setToken(null);
        tile.setToken(this);
        

        this.setTile(tile);
    }
}