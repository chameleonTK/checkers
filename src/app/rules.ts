import { Player } from "./player";
import { Tile } from './tile';
import { Token } from './token';
import { Records } from "./records"
import { Point } from "./records";
import { Board } from './board';
import { App } from './app';

export class Rules {
    name:string; 
    env:App;
    records:Records;

    private _endgameCallback: (t1:string, t2:string) => void;
    private turn: number;
    private _nocaptureTurn: number = 0;
    constructor(env: App, board: Board) {
        this.name = "checker";
        this.env = env;
        this.turn = 0;

        this.records = new Records(board);
    }

    setEndgameCallback(fnt) {
        this._endgameCallback = fnt;
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

    gameEnd():boolean {
        if (this.env.players[0].tokens.length==0) {
            console.log("Player 1 has no tokens")
            return true;
        }

        if (this.env.players[1].tokens.length==0) {
            console.log("Player 2 has no tokens")
            return true;
        }

        // if one doesn't has a position where he cannot move
        if (!this._canPlayerPlay(this.env.players[0])) {
            console.log("Player 1 cannot play in his turn")
            return true;
        }

        if (!this._canPlayerPlay(this.env.players[1])) {
            console.log("Player 2 cannot play in his turn")
            return true;
        }

        // If an exact board position is repeated a third time, the game automatically ends in a draw.
        let nRepeated = this.records.repeatedBoard(this.env.board);
        if (nRepeated >=3) {
            console.log("An exact board position is repeated a third time")
            return true;
        }

        // if no pieces have been removed from the board within 50 moves, the game is a draw
        if (this._nocaptureTurn>=50) {
            console.log("No pieces have been removed from the board within 50 moves")
            return true;
        }

        return false;
    }

    private _canPlayerPlay(player: Player):boolean {
        let tokens = player.tokens;
        for(let i=0; i<tokens.length; i++) {
            if (this._hasMove(tokens[i])) {
                return true;
            }
        }

        return false
    }

    callEndgameCallback():void {
        if (this.env.players[0].tokens.length==0) {
            this._endgameCallback("\""+this.env.players[1].name+"\"", "ขอแสดงยินดีกับผู้ชนะ")
        } else if (this.env.players[1].tokens.length==0) {
            this._endgameCallback("\""+this.env.players[0].name+"\"", "ขอแสดงยินดีกับผู้ชนะ")
        } else {
            this._endgameCallback("\"เสมอกัน\"", "ผลการแข่งขัน")
        }

        this.env.players[0].active = false;
        this.env.players[1].active = false;
        this.env.tokens.forEach((t)=>{
            t._moveable = false;
        })
    }

    getTurn(): number {
        return this.turn;
    }

    takeTurn(player:Player) {
        
        if (this.gameEnd()) {
            this.callEndgameCallback()
            return;
        }
        this.turn += 1
        this._nocaptureTurn += 1;

        let opponent = this.env.players[0]==player?this.env.players[1]:this.env.players[0]
        opponent.active = false;
        player.active = true;

        this.setMovableTokens(player)
        player.play();
    }

    swapTurn() {
        let player = this.env.players[0].active?this.env.players[1]:this.env.players[0]
        this.takeTurn(player);
    }

    noSwapTurn() {
        if (this.gameEnd()) {
            this.callEndgameCallback()
        }

        let player = this.env.players[0].active?this.env.players[0]:this.env.players[1]
        player.play();
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

    private _jumpmove(x:number, y:number, tokenloc, board:Board):Tile {
        let o = board.getTile(x, y)
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


    moveableTile(token:Token, board?:Board) {
        if (board===undefined) {
            board = this.env.board;
        }

        if (token.king) {
            return this.moveableTileAsKing(board, token);
        }

        let player = token.owner;
        if (player.topplayer) {
            return this.moveableTileToBottom(board, token);
        } else {
            return this.moveableTileToTop(board, token);
        }
    }

    moveableTileAsKing(board:Board, token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = board.tokenLocation();
        let dir = [[1,1], [1, -1], [-1, 1], [-1,-1]];
        let alltiles = []
        dir.forEach((d)=>{
            let tiles:Tile[] = [];

            let nx = x+d[0];
            let ny = y+d[1];
            // let hasJump = false;
            while (board.onBoard(nx, ny)) {
                let t = board.getTile(nx, ny);

                let o:Token = tokenloc[t.x][t.y];
                if (!o) {
                    tiles.push(t)
                } else if (o.owner!=token.owner) {
                    if (board.onBoard(nx+d[0], ny+d[1]) && !tokenloc[nx+d[0]][ny+d[1]]) {
                        tiles = [
                            board.getTile(nx+d[0], ny+d[1])
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

    moveableTileToTop(board:Board, token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = board.tokenLocation();
        return [
            board.getTile(x-1, y-1),
            board.getTile(x-1, y+1)
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
                    return this._jumpmove(x-2, y-2, tokenloc, board);
                } else {
                    return this._jumpmove(x-2, y+2, tokenloc, board);
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    moveableTileToBottom(board:Board, token: Token): Tile[] {
        let x = token.x;
        let y = token.y;

        let tokenloc = board.tokenLocation();
        return [
            board.getTile(x+1, y-1),
            board.getTile(x+1, y+1)
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
                    return this._jumpmove(x+2, y-2, tokenloc, board);
                } else {
                    return this._jumpmove(x+2, y+2, tokenloc, board);
                }
            }
        }).filter((t)=> {
            return !!(t);
        })
    }

    distance(A: Point, B: Point):number[] {
        return [A.x-B.x, A.y-B.y];
    }

    neitherJumpOrMove(token:Token, tiles:Tile[]):Tile[] {
        let jumpTiles = tiles.filter((t)=>{
            let dist = this.distance(token, t);
            let v = this._capturedToken(this.env.tokens, token, t, dist);
            return !!v;
        });

        if (jumpTiles.length > 0) {
            return jumpTiles;
        }

        return tiles;
    }

    // dist: distance between token and tile before token is moved
    private _capturedToken(allTokens:Token[], tokenA:Token, tileB:Tile, dist:number[]):Token {
        let n = Math.abs(dist[0]);

        if (n < 2) {
            return null;
        }

        let offset = [(1)*dist[0]/n, (1)*dist[1]/n]
        
        let x = tileB.x + offset[0];
        let y = tileB.y + offset[1];

        let v:Token = allTokens.find((t)=>{
            return (t.x==x && t.y==y);
        })

        if (!v) {
            return null;
        }

        if (v.owner == tokenA.owner) {
            return null;
        }

        return v;
    }

    
    move(tile: Tile) {
        let token:Token = this.env.board.tokens.find((t)=>{
            return t._selected;
        })

        return this.moveFunctional(tile, token);
    }
    
    // TODO: make it functional
    moveFunctional(tile: Tile, token:Token) {
        let board = this.env.board;
        let allTokens = this.env.tokens;
        let records = this.records;

        if (!token) {
            throw new Error("Illigal move[0]: something wrong with this move");
            return;
        }

        let _tmptoken = {...token};
        let d = this.distance(token, tile);

        let movesuccess = token.move(tile.x, tile.y);
        if (!movesuccess) {
            throw new Error("Illigal move[2]: This token is not movable in this turn")
            return ;
        }

        let hasPromoteKing = false;
        if (this._onLastRow(token, board)) {
            if (!token.king) {
                hasPromoteKing = true
                token.promote();
            }
        }

        
        if (Math.abs(d[0]) > 1) {
            let v = this._capturedToken(allTokens, token, tile, d);
            // All jumps from knight should have at least one victim token
            if ((token.king && hasPromoteKing) || (!token.king)) {
                if (!v) {
                    throw new Error("Illigal move[1]: something wrong with this move");
                    return;
                }
            }
            
            // if there is a captured token, remove it from the board
            if (!!v) {
                this._nocaptureTurn = 0;
                records.addRecord(_tmptoken, tile, true);
                Token.removeToken(v, this.env);
            } else {
                records.addRecord(_tmptoken, tile, false);
            }

            // When a knight is kinged, the turn automatically ends, even if the king can continue to jump.
            if (hasPromoteKing) {
                this.swapTurn();
            } else {
                if (!v) {
                    // if this turn is not a jump
                    this.swapTurn();
                } else if (!this._hasJumpMove(token)) {
                    // if this turn is a jump
                    // but there is no consecutive jumps
                    this.swapTurn();
                } else {
                    // if this turn is a jump
                    // and there is consecutive jumps
                    
                    // Only moved token can be move consecutively
                    token.owner.tokens.forEach((t)=> {
                        t._moveable = false;
                    })
                    token._moveable = true;
    
                    this.noSwapTurn();
                }
            }
        } else {
            records.addRecord(_tmptoken, tile, false);
            this.swapTurn();
        }
        
        this.resetMove()
    }

    private _onLastRow(token:Token, board: Board):boolean {
        if (token.owner.topplayer) {
            if (token.x==board.getBoardSize()-1) {
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
        
            let v = this._capturedToken(this.env.tokens, token, curr, d);
            return (!!v) || acc;
            // return (Math.abs(d[0])>1) || acc;
        }, false)

         
        return flag;
    }

    private _hasMove(token:Token):boolean {
        let nexttiles = this.moveableTile(token)
        if (nexttiles.length==0) {
            return false;
        }

        return true;
    }
    
}
