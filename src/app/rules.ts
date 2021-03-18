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
        this.turn += 1
        let opponent = this.env.players[0]==player?this.env.players[1]:this.env.players[0]
        opponent.active = false;
        player.active = true;

        this.setMovableTokens(player)
    }

    swapTurn() {
        let player = this.env.players[0].active?this.env.players[1]:this.env.players[0]
        this.takeTurn(player);
    }

    noSwapTurn() {
        // Do nothing
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

    setMovableTokens(player:Player) {
        this.env.tokens.forEach((t)=>{
            t._moveable = false;
        })

        // jump is composary: you must make a jump if there is a possible way to jump
        let jumpableTokens = player.tokens.filter((t)=> {
            return this._hasJumpMove(t)
        })

        if (jumpableTokens.length == 0) {
            player.tokens.forEach((t)=>{
                t._moveable = true;
            })
        } else {
            jumpableTokens.forEach((t)=>{
                t._moveable = true;
            })
        }
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

    private _jumpmove(x, y, tokenloc):Tile {
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


    moveableTile(token:Token) {
        if (!token.owner.active) {
            return [];
        }

        if (token.king) {
            return this.moveableTileAsKing(token);
        }

        let player = token.owner;
        if (player.topplayer) {
            return this.moveableTileToBottom(token);
        } else {
            return this.moveableTileToTop(token);
        }
    }

    moveableTileAsKing(token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = this.tokenLocation();
        let dir = [[1,1], [1, -1], [-1, 1], [-1,-1]];
        let alltiles = []
        dir.forEach((d)=>{
            let tiles:Tile[] = [];

            let nx = x+d[0];
            let ny = y+d[1];
            // let hasJump = false;
            while (this.env.board.onBoard(nx, ny)) {
                let t = this.env.board.getTile(nx, ny);

                let o:Token = tokenloc[t.x][t.y];
                if (!o) {
                    tiles.push(t)
                } else if (o.owner!=token.owner) {
                    if (this.env.board.onBoard(nx+d[0], ny+d[1])) {
                        tiles = [
                            this.env.board.getTile(nx+d[0], ny+d[1])
                        ];
                    }
                    break;  
                } else {
                    break;
                }

                nx = nx+d[0];
                ny = ny+d[1];
            }

            alltiles = alltiles.concat(tiles);
        })

        return alltiles;
    }

    moveableTileToTop(token: Token): Tile[]{
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
                if (t.y==y-1) {
                    return this._jumpmove(x-2, y-2, tokenloc)
                } else {
                    return this._jumpmove(x-2, y+2, tokenloc)
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    moveableTileToBottom(token: Token): Tile[] {
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
                    return this._jumpmove(x+2, y-2, tokenloc)
                } else {
                    return this._jumpmove(x+2, y+2, tokenloc)
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    distance(A, B):number[] {
        return [A.x-B.x, A.y-B.y];
    }

    neitherJumpOrMove(token:Token, tiles:Tile[]):Tile[] {
        let jumpTiles = tiles.filter((t)=>{
            let dist = this.distance(token, t);
            let v = this._moveVictim(token, t, dist);
            return !!v;
        });

        if (jumpTiles.length > 0) {
            return jumpTiles;
        }

        return tiles;
    }

    // dist: distance between token and tile before token is moved
    private _moveVictim(token:Token, tile:Tile, dist:number[]):Token {
        let n = Math.abs(dist[0]);

        if (n < 2) {
            return null;
        }

        let offset = [(1)*dist[0]/n, (1)*dist[1]/n]
        
        let x = tile.x + offset[0];
        let y = tile.y + offset[1];

        let v:Token = this.env.tokens.find((t)=>{
            return (t.x==x && t.y==y);
        })

        if (!v) {
            return null;
        }

        if (v.owner == token.owner) {
            return null;
        }

        return v;
    }

    
    move(tile: Tile) {
        let token:Token = this.env.board.tokens.find((t)=>{
            return t._selected;
        })

        if (!token) {
            throw new Error("Illigal move[0]: something wrong with this move");
            return;
        }

        let d = this.distance(token, tile);

        // TODO: turn into a king
        let movesuccess = token.move(tile.x, tile.y);
        if (!movesuccess) {
            throw new Error("Illigal move[2]: This token is not movable in this turn")
            return ;
        }

        let hasPromoteKing = false;
        if (this._onLastRow(token)) {
            if (!token.king) {
                token.promote();
            }
        }

        
        if (Math.abs(d[0]) > 1) {
            let v = this._moveVictim(token, tile, d);

            // All jumps from knight should have at least one victim token
            if ((token.king && hasPromoteKing) || (!token.king)) {
                if (!v) {
                    throw new Error("Illigal move[1]: something wrong with this move");
                    return;
                }
            }
            
            // if there is a captured token, remove it from the board
            if (!!v) {
                Token.removeToken(v, this.env);
            }

            // When a knight is kinged, the turn automatically ends, even if the king can continue to jump.
            if (hasPromoteKing) {
                this.swapTurn();
            } else {

                // If there is no consecutive jumps
                if (!this._hasJumpMove(token)) {
                    this.swapTurn();
                } else {
                    // Only moved token can be move consecutively
                    token.owner.tokens.forEach((t)=> {
                        t._moveable = false;
                    })
                    token._moveable = true;
    
                    this.noSwapTurn();
                }
            }
        } else {
            this.swapTurn();
        }
        
        this.resetMove()
    }

    private _onLastRow(token:Token):boolean {
        if (token.owner.topplayer) {
            if (token.x==this.env.board.getBoardSize()-1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (token.x==0) {
                return true;
            } else {
                return false;
            }
        }
    }

    private _hasJumpMove(token:Token):boolean {
        let nexttiles = this.moveableTile(token)
        if (nexttiles.length==0) {
            return false;
        }

        // check whether one of these moves is to consume the opponent token
        let flag = nexttiles.reduce((acc, curr)=> {
            let d = this.distance(token, curr);

            let v = this._moveVictim(token, curr, d);
            return (!!v) || acc;
            // return (Math.abs(d[0])>1) || acc;
        }, false)

         
        return flag;
    }
    
}
