import {Tile} from "./tile";
import {Player} from "./player";
import {Token} from "./token";

export class Board {
    static BOARDSIZE:number = 8;
    
    tiles: Tile[][];
    tokens: Token[];

    constructor() {
        this.tiles = [];
        for (let i = 0; i < 8; i++) {
            let tilesInARow: Tile[] = [];
            for (let j = 0; j < 8; j++) {
                let tileInACol:Tile;

                if ((i+j)%2==0) {
                    tileInACol = new Tile(i, j, false);
                } else {
                    tileInACol = new Tile(i, j, true);
                }
                
                tilesInARow.push(tileInACol);
            }

            this.tiles.push(tilesInARow);
        }
    }

    getBoardSize():number {
        return Board.BOARDSIZE;
    }

    onBoard(x:number, y:number):boolean {
        let boardsize = this.getBoardSize();
        if (x <0 || x>=boardsize) {
            return false;
        } 

        if (y <0 || y>=boardsize) {
            return false;
        }

        return true;
    }

    placeTokens(_tokenpos:number[][][], players: Player[]):Token[] {
        let tokens:Token[] = [];
        _tokenpos.forEach((tpos, pid) => {
            let player = players[pid]
            tpos.forEach((p) => {
              let token = new Token(p[0], p[1], player)
              tokens.push(token);
            })
        })

        this.tokens = tokens;
        return tokens;
    }

    getTile(x:number, y:number):Tile {
        if (!this.onBoard(x, y)) {
            return null;
        }

        return this.tiles[x][y];
    }
}
