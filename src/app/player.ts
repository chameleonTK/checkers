import {Token} from "./Token";
import {Tile} from "./Tile";
import {Move} from "./Move";
import {Board} from "./Board";


export class Player {
    name: string;
    color: string;
    firstPlayer: boolean;
    tokens: Token[] = [];
    active: boolean;

    constructor(name, color, firstPlayer) {
        this.name = name;
        this.color = color;
        this.firstPlayer = firstPlayer;
        this.active = firstPlayer;
    }

    addToken(token: Token) {
        token.setOwner(this);
        this.tokens.push(token);
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
    
                if (!tile.isEmpty()) {
                    // Check if it can jump
                    if (tile.token.owner != this) {
                        let jumpTile = null;

                        let jp = [x+i*d[0]+d[0]*2, y+i*d[1]+d[1]*2];
            
                        if (!this.firstPlayer) {
                            jp = board.changePerspective(jp[0], jp[1]);
                            jumpTile = board.getTile(jp[0], jp[1]);
                        } else {
                            jumpTile = board.getTile(jp[0], jp[1]);
                        }

                        if (!!jumpTile && jumpTile.isEmpty()) {
                            nextMoves.push(new Move(token, jumpTile, true));
                        }
                    }
                    break;
                }
    
                nextMoves.push(new Move(token, tile, false));
            }
        });
        

        return nextMoves;

        
    }
    
    getNextJumps(token): Tile[] {
        return [];
    }

}
