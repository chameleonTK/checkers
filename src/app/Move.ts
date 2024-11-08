import {Token} from "./Token";
import {Tile} from "./Tile";

export class Move {
    token: Token;
    tile: Tile;
    isJump: Boolean = false;

    constructor(token: Token, tile: Tile, isJump: Boolean) {
        this.token = token;
        this.tile = tile;
        this.isJump = isJump;
    }
}