import {Token} from "./Token";
import {Tile} from "./Tile";
import {Move} from "./Move";
import {Board} from "./Board";


export class Player {
    index: number;
    name: string;
    color: string;
    firstPlayer: boolean;
    tokens: Token[] = [];
    active: boolean;

    constructor(index, name, color, firstPlayer) {
        this.index = index;
        this.name = name;
        this.color = color;
        this.firstPlayer = firstPlayer;
        this.active = firstPlayer;
    }

    addToken(token: Token) {
        token.setOwner(this);
        this.tokens.push(token);
    }

    removeToken(token: Token) {
        token.setOwner(null);
        this.tokens = this.tokens.filter((t) => t != token);
    }

    getNKnight() {
        return this.tokens.filter((token) => token.isKnight()).length; 
    }

    getNKing() {
        return this.tokens.filter((token) => token.isKing()).length; 
    }

    setTurn(active: boolean) {
        this.active = active;
    }

    canMove(board: Board): boolean {
        for (let token of this.tokens) {
            if (this.getNextMoves(token, board).length > 0) {
                return true;
            }
        }

        return false;
    }

    canJump(board: Board): boolean {
        for (let token of this.tokens) {
            const nextMoves = this.getNextMoves(token, board);
            for (let move of nextMoves) {
                if (move.isJump) {
                    return true;
                }
            }
        }

        return false;
    }
    
    getNextMoves(token: Token, board: Board): Move[] {
        let x = token.x;
        let y = token.y;

        if (!this.firstPlayer) {
            const p = board.changePerspective(x, y);
            x = p[0];
            y = p[1];
            
        }

        let N = token.isKing() ? board.width : 1;

        let directions = [
            [+1, +1],
            [+1, -1]
        ];

        if (token.isKing()) {
            directions.push([-1, +1]);
            directions.push([-1, -1]);
        }
        

        let nextMoves: Move[] = [];
        directions.forEach((d)=>{
            for(let i = 0; i < N; i+=1) {
                let p = [x+i*d[0]+d[0], y+i*d[1]+d[1]];
                let tile = null;
                
    
                if (!this.firstPlayer) {
                    p = board.changePerspective(p[0], p[1]);
                    tile = board.getTile(p[0], p[1]);
                } else {
                    tile = board.getTile(p[0], p[1]);
                }
    
                if (!tile) {
                    break;
                }
    
                // A piece can either move or jump
                if (!tile.isEmpty()) {
                    // A piece can jump if the destination tile is occupied by an opposing piece
                    // A piece can not jump if the destination tile is occupied by a piece of the same player
                    if (tile.token.owner != this) {
                        let jumpTile = null;

                        //a piece jumps onto the two diagonal spaces in the direction of the the opposing piece. 
                        let jp = [x+i*d[0]+d[0]*2, y+i*d[1]+d[1]*2];
            
                        if (!this.firstPlayer) {
                            jp = board.changePerspective(jp[0], jp[1]);
                            jumpTile = board.getTile(jp[0], jp[1]);
                        } else {
                            jumpTile = board.getTile(jp[0], jp[1]);
                        }

                        
                        // the space on the other side of the captured piece must be empty for a player to jump onto it.
                        if (!!jumpTile && jumpTile.isEmpty()) {
                            nextMoves.push(new Move(token, jumpTile, true, tile.token));
                        }
                    }
                    break;
                }
    
                nextMoves.push(new Move(token, tile, false, null));
            }
        });
        

        return nextMoves;

        
    }
    
    play() {
        console.log(`${this.name} is playing...`);
        return;
    }



}
