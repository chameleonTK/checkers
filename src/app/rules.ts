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
                [2, 1], [4,1], [6, 1], [6, 3], [6, 5], [6, 7],
                [7, 0], [7, 2], [7, 4], [7, 6],
            ]
        }
    }

    takeTurn(player:Player) {
        let opponent = this.env.players[0]==player?this.env.players[1]:this.env.players[0]
        opponent.active = false;
        player.active = true;
    }

    swapTurn() {
        let player = this.env.players[0].active?this.env.players[1]:this.env.players[0]
        this.takeTurn(player);
    }

    resetMove():void {
        Tile.flat(this.env.board.tiles)
        .forEach((t)=> {
            t.unhighlight()
        })

        this.env.tokens.forEach((t)=> {
            t.unselect();
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

    private _skipmove(x, y, tokenloc):Tile {
        let o = this.env.board.getTile(x, y)
        if (!o) {
            return null;
        }

        let oo:Token = tokenloc[x][y];
        if (!oo) {
            return o
        } else {
            return null;
        }
    }
    moveableToTop(token: Token): Tile[]{
        let x = token.x;
        let y = token.y;

        let tokenloc = this.tokenLocation();
        return [
            this.env.board.getTile(x-1, y-1),
            this.env.board.getTile(x-1, y+1)
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
                // if (t.y==y-1) {
                //     return this.env.board.getTile(x-2, y-2)
                // } else {
                //     return this.env.board.getTile(x-2, y+2)
                // }
                if (t.y==y-1) {
                    return this._skipmove(x-2, y-2, tokenloc)
                } else {
                    return this._skipmove(x-2, y+2, tokenloc)
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    // (0,0) (0, 1) (0, 2) (0, 3)
    // (1,0) (1, 1) (1, 2) (1, 3)
    // (2,0) (2, 1) (2, 2) (2, 3)
    // (3,0) (3, 1) (3, 2) (3, 3)
    moveableToBottom(token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = this.tokenLocation();
        return [
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
                    return this._skipmove(x+2, y-2, tokenloc)
                } else {
                    return this._skipmove(x+2, y+2, tokenloc)
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    private _distance(A, B):number[] {
        return [A.x-B.x, A.y-B.y];
    }

    private _moveVictim(tile:Tile, dist:number[]):Token {
        let n = Math.abs(dist[0]);
        let offset = [(1)*dist[0]/n, (1)*dist[1]/n]
        
        let x = tile.x + offset[0];
        let y = tile.y + offset[1];

        let t:Token = this.env.tokens.find((t)=>{
            return (t.x==x && t.y==y);
        })

        if (!t) {
            throw new Error("Illigal move[1]: something wrong with this move");
            return null;
        }
        return t;
    }

    
    move(tile: Tile) {
        let token:Token = this.env.board.tokens.find((t)=>{
            return t._selected;
        })

        if (!token) {
            throw new Error("Illigal move[0]: something wrong with this move");
            return;
        }

        let d = this._distance(token, tile);

        // TODO: you must make a jump if there is a possible way to jump
        // TODO: turn into a king
        
        token.move(tile.x, tile.y);

        if (Math.abs(d[0]) > 1) {
            let v = this._moveVictim(tile, d);
            Token.removeToken(v, this.env);
            if (!this._consecutiveMove(token)) {
                this.swapTurn();
            } else {
                // TODO: force it to be only one that can move
            }
        } else {
            this.swapTurn();
        }
        
        this.resetMove()
    }

    private _consecutiveMove(token:Token):boolean {
        let nexttiles = this.moveable(token)
        if (nexttiles.length==0) {
            return false;
        }

        // check whether one of these moves is to consume the opponent token
        let hasSkipMove = nexttiles.reduce((acc, curr)=> {
            let d = this._distance(token, curr);

            return (Math.abs(d[0])>1) || acc;
        }, false)

        
        return hasSkipMove;
    }
    
}
