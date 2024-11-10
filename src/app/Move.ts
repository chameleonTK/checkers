import {Token} from "./Token";
import {Tile} from "./Tile";

export class Move {
    token: Token;
    tile: Tile;
    isJump: Boolean = false;
    promotedKnight: Boolean = false;
    capturingToken: Token = null;

    srcTile: Tile;
    destTile: Tile;

    constructor(token: Token, tile: Tile, isJump: Boolean, capturingToken: Token) {
        this.token = token;
        this.tile = tile;
        this.isJump = isJump;
        this.capturingToken = capturingToken;

        this.srcTile = token.tile;
        this.destTile = tile;
    }

    setPromotedKnight(p) {
        this.promotedKnight = p
    }
}