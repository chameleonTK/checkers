import {Tile} from "./tile";
import {Player} from "./player";
import {Token} from "./token";

export class Board {
    static BOARDSIZE:number = 8;
    
    tiles: Tile[][];
    tokens: Token[];

    constructor() {
        this.tiles = [];
        this.tokens = [];
        for (let i = 0; i < 8; i++) {
            let tilesInARow: Tile[] = [];
            for (let j = 0; j < 8; j++) {
                let tileInACol:Tile;

                if ((i+j)%2==1) {
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

        // Test example
        // let token = new Token(0, 1, players[1])
        // token.promote()
        // tokens.push(token);

        // token = new Token(0, 3, players[1])
        // token.promote()
        // tokens.push(token);

        // token = new Token(5, 4, players[0])
        // token.promote()
        // tokens.push(token);
        // token = new Token(5, 6, players[0])
        // token.promote()
        // tokens.push(token);
        
        _tokenpos.forEach((tpos, pid) => {
            let player = players[pid]
            tpos.forEach((p) => {
              let token = new Token(p[0], p[1], player)
              
              token.owner.addToken(token);
              tokens.push(token);
            })
        })

        this.tokens = tokens;
        return tokens;
    }

    removeToken(token:Token) {
        let idx = this.tokens.indexOf(token)
        this.tokens.splice(idx, 1);
    }

    getTile(x:number, y:number):Tile {
        if (!this.onBoard(x, y)) {
            return null;
        }

        return this.tiles[x][y];
    }

    tokenLocation(): Token[][] {
        let m:Token[][] = [];
        let boardsize = this.getBoardSize();
        for(let i=0; i<boardsize; i++) {
            let tokens:Token[] = [];
            for(let j=0; j<boardsize; j++) {
                tokens.push(null);
            }
            m.push(tokens);
        }

        this.tokens.forEach((t)=>{
            m[t.x][t.y] = t;
        })

        return m;
    }
}
