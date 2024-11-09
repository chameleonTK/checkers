import {Tile} from "./Tile";
import {Token} from "./Token";

export class Board {
    width: number;
    height: number;
    
    tiles: Tile[][];
    tokens: Token[] = [];

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tokens = [];
        
        this.tiles = [];
        for (let i = 0; i < width; i++) {
            let tilesInARow: Tile[] = []; 
            for (let j = 0; j < height; j++) {
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

    onBoard(x:number, y:number):boolean {
        if (x < 0 || x>= this.width) {
            return false;
        } 

        if (y < 0 || y >= this.height) {
            return false;
        }

        return true;
    }

    getTile(x:number, y:number): Tile {
        if (!this.onBoard(x, y)) {
            return null;
        }

        return this.tiles[x][y];
    }

    

    changePerspective(x, y) {
        return [this.width - x - 1, this.height - y - 1];
    }

    addToken(token: Token) {
        if (this.onBoard(token.x, token.y)) {
            this.tiles[token.x][token.y].setToken(token);
            token.setTile(this.tiles[token.x][token.y]);
        }

        this.tokens.push(token);
    }

    removeToken(token: Token) {
        if (this.onBoard(token.x, token.y)) {
            this.tiles[token.x][token.y].setToken(null);
            token.setTile(null);
        }

        this.tokens = this.tokens.filter((t) => t != token);
    }

    unselect() {
        this.tiles.forEach((row) => {
            row.forEach((tile) => {
                tile.unselect();
                tile.setMove(null);
            });
        });

        this.tokens.forEach((t) => {
            t.unselect();
            t.enable();
        });
    }

    
}
