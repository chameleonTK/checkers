import {Tile} from "./tile";

export class Board {
    tiles: Tile[][];
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
}
