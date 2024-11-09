import {Move} from "./Move";
import {Tile} from "./Tile";
import {Board} from "./Board";

export class Log {
    // reords: Move[];
    moveLogs: string[] = [];
    boardStates: string[] = [];

    constructor() {}

    getRecords(): string[] {
        return this.moveLogs;
    }

    point2position(tile: Tile): string {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return `${char[tile.x]}${tile.y + 1}`;
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
                    s += "[]";
                } else {
                    s += tile.token.isKnight() ? "N" : "K";
                    s += tile.token.owner.index;
                }
            }
            s += "\n";
        }

        return s;
    }

    addRecord(move: Move, board: Board) {
        console.log(move);

        // // TODO: bug when there is a consicutive jump
        let src = this.point2position(move.srcTile)
        let dest = this.point2position(move.destTile)
        if (move.isJump) {
            this.moveLogs.push(`${src}x${dest}`);
        } else {
            this.moveLogs.push(`${src}-${dest}`);
        }

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
            if (this.moveLogs[i].includes('x')) {
                break
            }

            count += 1;
        }

        return count;
    }


    redo() {
        const lastMove = this.moveLogs[this.moveLogs.length - 1];
        if (!lastMove) {
            return;
        }
        
        console.log(lastMove);
    }
}