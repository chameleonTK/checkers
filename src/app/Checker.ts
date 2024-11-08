import {Board} from "./Board";
import {Player} from "./Player";
import {Token} from "./Token";
import {Tile} from "./Tile";
import {Move} from "./Move";

export class Checker {
    boardSize: number = 8;
    board: Board;
    players: Player[];
    activePlayer: Player;

    selectedToken: Token = null;


    turnIndex: number = 0;
    records: any[] = [];


    constructor() {
        this.board = new Board(this.boardSize, this.boardSize);
        this.players = [
            new Player("Player 1", "#444444", true),
            new Player("Player 2", "#e26b6b", false)
        ];

        this.activePlayer = this.players[0];

        
        // [0, 1].forEach((rowIdx) => {
        //     this.board.tiles[rowIdx].forEach((tile, colIdx) => {
        //         if (tile.playable) {
        //             // Player 1
        //             const x = tile.x;
        //             const y = tile.y;
        //             const token1 = new Token(x, y);
        //             this.players[0].addToken(token1);
        //             this.board.addToken(token1)

        //             // Player 2
        //             const p = this.board.changePerspective(x, y);
        //             const px = p[0];
        //             const py = p[1];
        //             const token2 = new Token(px, py);
        //             this.players[1].addToken(token2);
        //             this.board.addToken(token2)
        //         }
        //         console.log(tile);
        //     });
        // });

        let t = null;
        t = new Token(2, 2);
        this.players[0].addToken(t);
        this.board.addToken(t)

        t = new Token(3, 3);
        this.players[1].addToken(t);
        this.board.addToken(t)

        // t = new Token(5, 5);
        // this.players[1].addToken(t);
        // this.board.addToken(t)
        t = new Token(4, 4);
        this.players[1].addToken(t);
        this.board.addToken(t)
    }

    getTurnIndex() {
        return this.turnIndex;
    }


    selectTile(tile) {
        if (tile.selected) {
            tile.unselect();
        } else {
              tile.select();
        } 
    }

    selectToken(token) {
        // if (!token.owner.active) {
        //     return;
        // }

        this.board.unselect();

        this.selectedToken = token;
        this.selectedToken.select();

        let moveTiles:Move[] = token.owner.getNextMoves(token, this.board);

        // tiles = rules.neitherJumpOrMove(this, tiles);
        moveTiles.forEach((t)=>{
            t.tile.select();
        })

        console.log("CLICKED TOKEN", token);
    }

    
    

    
}
