import { AppComponent } from "./app.component";
import { Player } from "./player";
import { Tile } from './tile';
import { Token } from './token';
import { Board } from './board';

export class Rules {
    name:string; 
    env:AppComponent;
    
    private turn: number;
    constructor(env: AppComponent) {
        this.name = "checker";
        this.env = env;
        this.turn = 0;

    }

    getStartTokenPositions(player: Player) {
        if (player.topplayer) {
            return [
                [0, 1], [0, 3], [0, 5], [0, 7],
                [1, 0], [1, 2], [1, 4], [1, 6],
            ]
        } else {
            return [
                [6, 1], [6, 3], [6, 5], [6, 7],
                [7, 0], [7, 2], [7, 4], [7, 6],
            ]
        }
    }

    takeTurn(player:Player) {
        player.active = true;
    }

    resetMove():void {
        Tile.flat(this.env.board.tiles)
        .forEach((t)=> {
            t.unhighlight()
        })

        this.env.tokens.forEach((t)=> {
            t.unselected();
        })
    }

    moveable(token:Token) {
        if (!token.owner.active) {
            return [];
        }

        if (token.king) {
            return this.moveableAsKing(token);
        }

        let player = token.owner;
        if (player.topplayer) {
            return this.moveableToBottom(token);
        } else {
            return this.moveableToTop(token);
        }
    }

    moveableAsKing(token: Token): Tile[] {
        throw new Error("Method not implemented.");
    }

    tokenLocation(): Token[][] {
        let m:Token[][] = [];
        let boardsize = this.env.board.getBoardSize();
        for(let i=0; i<boardsize; i++) {
            let tokens:Token[] = [];
            for(let j=0; j<boardsize; j++) {
                tokens.push(null);
            }
            m.push(tokens);
        }

        this.env.board.tokens.forEach((t)=>{
            m[t.x][t.y] = t;
        })

        return m;
    }

    moveableToTop(token: Token): Tile[]{
        let x = token.x;
        let y = token.y;

        let _t = [
            this.env.board.getTile(x-1, y-1),
            this.env.board.getTile(x-1, y+1)
        ].filter((t)=> {
            return !!(t);
        })

        return _t;
    }

    // (0,0) (0, 1) (0, 2) (0, 3)
    // (1,0) (1, 1) (1, 2) (1, 3)
    // (2,0) (2, 1) (2, 2) (2, 3)
    // (3,0) (3, 1) (3, 2) (3, 3)
    moveableToBottom(token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = this.tokenLocation();
        let _t = [
            this.env.board.getTile(x+1, y-1),
            this.env.board.getTile(x+1, y+1)
        ].map((t)=>{
            if (!t) {
                return null;
            }

            let o:Token = tokenloc[t.x][t.y];
            if (!o) {
                return t;
            } else if (o.owner==token.owner) {
                return null;
            } else {
                if (t.y==y-1) {
                    return this.env.board.getTile(x+2, y-2)
                } else {
                    return this.env.board.getTile(x+2, y+2)
                }
            }
        }).filter((t)=> {
            return !!(t);
        })

        return _t;
    }

    // getTurnIndex() {
    //     return (this.turn%2);
    // }

    // getActivePlayer = function() {
    //     return this.players[this.turnIndex()];
    // }

    // getOpponent = function() {
    //     return this.players[(this.turnIndex()+1)%2];
    // }
}
