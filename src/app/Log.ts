import {Move} from "./Move";
import {Tile} from "./Tile";
import {Token} from "./Token";
import {Board} from "./Board";
import {Checker} from "./Checker";

export class Log {
    // reords: Move[];
    moveLogs: string[] = [];
    boardStates: string[] = [];
    POSITION_INDEX: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    constructor() {}

    getRecords(): string[] {
        return this.moveLogs;
    }

    point2position(x:number, y:number): string {
        return `${this.POSITION_INDEX[x]}${y + 1}`;
    }

    
    position2point(s:string) {
        return [
            this.POSITION_INDEX.indexOf(s[0]),
            (+s.slice(1)) -1
        ];
    }

    board2str(board: Board): string {
        let s = "";
        for (let i = 0; i < board.width; i++) {
            for (let j = 0; j < board.height; j++) {
                let tile = board.getTile(i, j);
                if (!tile) {
                    continue
                }

                if (tile.isEmpty()) {
                    s += ". ";
                } else {
                    s += tile.token.isKnight() ? "N" : "K";
                    s += tile.token.owner.index;
                    s += " "
                }
            }
            s += "\n";
        }

        return s;
    }

    addRecord(move: Move, board: Board) {

        let src = this.point2position(move.srcTile.x, move.srcTile.y)
        let dest = this.point2position(move.destTile.x, move.destTile.y)
        let playerIdx = move.token.owner.index;

        let moveCode = ""
        if (move.isJump) {
            if (move.capturingToken.isKing()) {
                moveCode = `${playerIdx}.${src}x${dest}*`;
            } else {
                moveCode = `${playerIdx}.${src}x${dest}`;
            }
            
        } else {
            moveCode = `${playerIdx}.${src}-${dest}`
        }

        if (move.promotedKnight) {
            moveCode += "$";
        }

        this.moveLogs.push(moveCode);

        let s = this.board2str(board);
        this.boardStates.push(s);

        // keep only the last 50 records
        this.boardStates = this.boardStates.slice(Math.max(this.boardStates.length - 50, 0))
    }

    getRepeatedBoardWithLastestMove(): number {
        const lastBoard = this.boardStates[this.boardStates.length - 1];
        return this.boardStates.reduce((c, s) => {
            return s === lastBoard ? c + 1 : c;
        }, 0)
    }

    getNMovesWithLastestCapture(): number {
        let count = 0;
        for (let i = this.moveLogs.length - 1; (i >= 0 && i >= this.moveLogs.length - 50); i--) {
            if (this.moveLogs[i].includes("x")) {
                break
            }

            count += 1;
        }

        return count;
    }


    redo(game: Checker) {
        const board = game.board;
        const lastMove = this.moveLogs[this.moveLogs.length - 1];
        if (!lastMove) {
            console.log(`No last move`)
            return false;
        }

        const points = lastMove
                        .replace(".", "-")
                        .replace("x", "-")
                        .replace("*", "")
                        .replace("$", "")
                        .split("-");

        if (points.length !== 3) {
            console.log(`The move is malformed: ${lastMove}`)
            return false;
        }

        const playerIdx = +points[0];
        const player = game.players.find((p) => p.index==playerIdx);
        

        const srcPoint = this.position2point(points[1]);
        const destPoint = this.position2point(points[2]);
        
        const srcTile = board.getTile(srcPoint[0], srcPoint[1]);
        const destTile = board.getTile(destPoint[0], destPoint[1]);
        if (!srcTile || !destTile) {
            console.log(`Cannot find the tiles correspond to the move: ${lastMove}`)
            return false;
        }

        const selectedToken = destTile.token;
        if (!selectedToken) {
            console.log(`No token at (${destPoint[0]}, ${destPoint[1]})`)
            return false;
        }

        let jumpedTile = null;
        if (lastMove.includes("x")) {
            const dx = (destPoint[0] - srcPoint[0])/Math.abs(destPoint[0] - srcPoint[0]);
            const dy = (destPoint[1] - srcPoint[1])/Math.abs(destPoint[1] - srcPoint[1]);
            

            jumpedTile = board.getTile(destPoint[0]-dx, destPoint[1]-dy);
            if (!jumpedTile) {
                console.log("Cannot determined the jumped tile")
                return;
            }
        }

        selectedToken.move(srcTile);

        // Change active player
        game.players.forEach((p, idx)=>{
            p.active = false;
        });

        player.active = true;
        game.activePlayer = player;

        // Handle jump
        if (!!jumpedTile) {
            const newToken = new Token(jumpedTile.x, jumpedTile.y);
            const opponent = game.players.find((p) => p.index!=playerIdx);

            if (lastMove.includes("*")) {
                newToken.promote();
            }

            opponent.addToken(newToken);
            game.board.addToken(newToken);
        }

    
        // Handle consecutive jumps
        let hasConsecutiveJumps = false;
        if (this.moveLogs.length - 2 >= 0 ){
            const lastTwoMove = this.moveLogs[this.moveLogs.length - 2];

            // It is a consecutive jump if the previous move is also from the same player
            if (lastTwoMove.startsWith(`${playerIdx}.`)) {
                hasConsecutiveJumps = true;
                player.tokens.forEach((t)=>{
                    if (t!=selectedToken) {
                        t.disable();
                    } else {
                        t.enable();
                    }
                });
            }
        }

        if (!hasConsecutiveJumps) {
            player.tokens.forEach((t)=>{
                t.enable();
            });
        }

        // Handle Promoted Knight
        if (lastMove.includes("$")) {
            selectedToken.demote();
        }

        // Reset the board
        game.board.unselect();   
        
        this.moveLogs.pop();
        this.boardStates.pop();
    }
}