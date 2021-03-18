import { Tile } from './tile';
import { Board } from './board';

export interface Point {
    x: number;
    y: number;
}

export class Records {
    private _playHistory:string[] = [];
    private _last50:string[] = [];
    board: Board;
    // board position
    // -  1  -  2  -  3  -  4
    // 5  -  6  -  7  -  8  -
    // -  9  -  10 -  11 -  12
    // 13 -  14 -  15 -  16 -
    // -  17 -  18 -  19 -  20
    // 21 -  22 -  23 -  24 -
    // -  25 -  26 -  27 -  28
    // 29 -  30 -  31 -  32 -
        
    constructor(board: Board) {
        this.board = board;
    }

    reset() {
        this._playHistory = [];
        this._last50 = [];
    }

    point2position(p:Point): number {
        let n = this.board.getBoardSize();
        let idx = p.x*n + p.y;

        if (p.x%2==0) {
            if (idx%2==0) {
                return null
            }
        } else {
            if (idx%2==1) {
                return null
            }
        }

        return Math.floor(idx/2) + 1;
    }

    repeatedBoard(board: Board):number {
        let sb = this.board2str(board);
        let cnt = this._last50.reduce((c, s)=>{
            return s==sb?c+1:c;
        }, 0)

        return cnt;
    }

    addRecord(A:Point, B:Point, jump:boolean) {
        let a = this.point2position(A)
        let b = this.point2position(B)
        if (jump) {
            this._playHistory.push(a+"x"+b);
        } else {
            this._playHistory.push(a+"-"+b);
        }

        let s = this.board2str(this.board);
        this._last50.push(s);
        // keep only the last 10 records
        this._last50 = this._last50.slice(Math.max(this._last50.length - 50, 0))
    }

    board2str(board: Board):string {
        let s = "";
        let tokens = board.tokenLocation();
        Tile.flat(board.tiles).forEach((t)=>{
            let token = tokens[t.x][t.y];
            if (!!token) {
                s += token.owner.topplayer?"B":"W";
            } else {
                s += "."
            }
        })

        return s;
    }

    exportRecords() {
        let records = [];
        let BW = false;
        for(let i=0; i<this._playHistory.length/2; i++) {
            let r1 = this._playHistory[i*2];
            let r2 = "";
            if (i*2+1 < this._playHistory.length/2) {
                let r2 = this._playHistory[i*2+1];
            } else {
                BW = true;
            }
            
            records.push((i+1)+". "+r1+" "+r2)
        }

        if (BW) {
            records.push("BW")
        } else {
            records.push("WW")
        }

        return records;
    }
    // 1. 9-14 23-18 2. 14x23 27x18 3. 5-9 26-23 4. 12-16 30-26 5. 16-19 24x15 6. 10x19 23x16 7. 11x20 22-17 8. 7-11 18-15 9. 11x18 28-24 10. 20x27 32x5 11. 8-11 26-23 12. 4-8 25-22 13. 11-15 17-13 14. 8-11 21-17 15. 11-16 23-18 16. 15-19 17-14 17. 19-24 14-10 18. 6x15 18x11 19. 24-28 22-17 20. 28-32 17-14 21. 32-28 31-27 22. 16-19 27-24 23. 19-23 24-20 24. 23-26 29-25 25. 26-30 25-21 26. 30-26 14-9 27. 26-23 20-16 28. 23-18 16-12 29. 18-14 11-8 30. 28-24 8-4 31. 24-19 4-8 32. 19-16 9-6 33. 1x10 5-1 34. 10-15 1-6 35. 2x9 13x6 36. 16-11 8-4 37. 15-18 6-1 38. 18-22 1-6 39. 22-26 6-1 40. 26-30 1-6 41. 30-26 6-1 42. 26-22 1-6 43. 22-18 6-1 44. 14-9 1-5 45. 9-6 21-17 46. 18-22 BW
}
