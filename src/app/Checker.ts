import {Board} from "./Board";
import {Player} from "./Player";
import {Token} from "./Token";
import {Move} from "./Move";
import {Log} from "./Log";

interface GameState {
    end: boolean;
    winner: Player;
    loser: Player;
    cause: string;
}

export class Checker {
    boardSize: number = 8;
    board: Board;
    players: Player[];
    activePlayer: Player;

    selectedToken: Token = null;


    turnIndex: number = 0;
    logger: Log;

    endgameCallback: Function = null;


    constructor() {
        this.board = new Board(this.boardSize, this.boardSize);
        this.players = [
            new Player(1, "Player 1", "#444444", true),
            new Player(2, "Player 2", "#e26b6b", false)
        ];

        this.activePlayer = this.players[0];
        this.logger = new Log();
        
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

        // t = new Token(5, 5);
        // this.players[0].addToken(t);
        // this.board.addToken(t)

        // t = new Token(2, 2);
        // this.players[1].addToken(t);
        // this.board.addToken(t)

        t = new Token(0, 0);
        this.players[1].addToken(t);
        this.board.addToken(t)
        t = new Token(1, 1);
        this.players[1].addToken(t);
        this.board.addToken(t)
        t = new Token(3, 3);
        this.players[1].addToken(t);
        this.board.addToken(t)
    }

    setEndgameCallback(callback) {
        this.endgameCallback = callback;
    }

    getTurnIndex() {
        return this.turnIndex;
    }


    selectTile(tile) {
        if (!this.selectedToken) {
            return;
        }

        if (!tile.selected) {
            return;
        }

        this.selectedToken.move(tile);

        // Check if the knight is at the last row to be promoted
        let promotedKnight = false;
        let x = tile.x;
        if (!this.selectedToken.owner.firstPlayer) {
            const p = this.board.changePerspective(tile.x, tile.y);
            x = p[0];
        }

        if (x==this.boardSize-1) {
            if (!this.selectedToken.isKing()) {
                this.selectedToken.promote();
                promotedKnight = true;
            }
        }

        if (tile.move.isJump) {
            const capturingToken = tile.move.capturingToken;

            // All jumps from knight should have at least one capturing token
            if (!capturingToken) {
                throw new Error("Illigal move[1]: something wrong with this move");
                return;
            }

            capturingToken.owner.removeToken(capturingToken);
            this.board.removeToken(capturingToken)
        }

        this.logger.addRecord(tile.move, this.board);

        // When a knight is kinged, the turn automatically ends, even if the king can continue to jump.
        if (promotedKnight) {
            this.swapPlayer();
            this.selectedToken = null;
            this.board.unselect();   
        } else if (!tile.move.isJump) {
            this.swapPlayer();
            this.selectedToken = null;
            this.board.unselect();   
        } else {
            // if this turn is a jump and check if there is a consecutive jump
            let moveTiles:Move[] = this.selectedToken.owner.getNextMoves(this.selectedToken, this.board);
            const jumpMoves = moveTiles.filter((m)=>m.isJump);

            if (jumpMoves.length == 0) {
                this.swapPlayer();
                this.selectedToken = null;
                this.board.unselect();   
            } else {
                this.noSwapPlayer();
                this.board.unselect();

                this.selectedToken.select();   
                jumpMoves.forEach((m)=>{
                    m.tile.select();
                    m.tile.setMove(m);
                })

                // Only the recently-moved token can be move consecutively
                this.selectedToken.owner.tokens.forEach((t)=>{
                    t.disable();
                });

                
            }
            
            
            
        }
        

        
    }

    selectToken(token) {
        if (!token.owner.active) {
            return;
        }

        if (!token.enabled) {
            return;
        }

        this.board.unselect();

        this.selectedToken = token;
        this.selectedToken.select();

        let moveTiles:Move[] = token.owner.getNextMoves(token, this.board);

        moveTiles.forEach((m)=>{
            m.tile.select();
            m.tile.setMove(m);
        })
    }

    swapPlayer() {

        let playerIdx = null;
        this.players.forEach((p, idx)=>{
            if (p.active) {
                playerIdx = idx;
            }

            p.active = false;
        });

        // Rotate player index
        const nextPlayerIdx = (playerIdx+1 >= this.players.length) ? 0 : playerIdx+1;
        this.players[nextPlayerIdx].active = true;
        

        this.turnIndex += 1;
        const gameState = this.checkGameState()
        if (gameState.end) {
            if (!!this.endgameCallback) {
                this.board.tokens.forEach((t)=>{
                    t.disable();
                });
                
                this.endgameCallback(gameState)
            }
        }
    }

    noSwapPlayer() {
        this.turnIndex += 1;

        const gameState = this.checkGameState()
        if (gameState.end) {
            if (!!this.endgameCallback) {
                this.endgameCallback(gameState)
            }
        }
    }

      
    checkGameState(): GameState{

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];

            // if one doesn't has any tokens left
            if (player.tokens.length == 0) {
                return {
                    end: true,
                    winner: this.players[(i+1)%2],
                    loser: this.players[i],
                    cause: `Player ${i+1} has no tokens`
                }
            }

            // if one doesn't has a position where he cannot move
            if (!player.canMove(this.board)) {
                return {
                    end: true,
                    winner: this.players[(i+1)%2],
                    loser: this.players[i],
                    cause: `Player ${i+1} cannot play in his turn`
                }
            }
        }

        // If an exact board position is repeated a third time, the game automatically ends in a draw.
        let nRepeated = this.logger.getRepeatedBoardWithLastestMove();
        if (nRepeated >=3) {
            return {
                end: true,
                winner: null,
                loser: null,
                cause: `Draw: The board position has been repeated ${nRepeated} times`
            }
        }

        // If no pieces have been removed from the board within 50 moves, the game is a draw
        let nMove = this.logger.getNMovesWithLastestCapture();
        if (nMove >= 10) {
            return {
                end: true,
                winner: null,
                loser: null,
                cause: `Draw: No pieces have been captured from the board within 50 moves`
            }
        }


        return {
            end: false,
            winner: null,
            loser: null,
            cause: "",
        }
    }

    
    

    
}
