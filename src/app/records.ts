import { Tile } from './tile';
import { Board } from './board';
import { App } from './app';

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
    
    position2point(p:number): Point {
        let n = Math.floor(this.board.getBoardSize()/2);
        
        let x = Math.ceil(p/n)-1;
        let _tmp = (p+n-1)%n;
        let y;

        if (x%2==0) {
            y = _tmp*2+1;
        } else {
            y = _tmp*2;
        }

        if (isNaN(x) || isNaN(y)) {
            throw new Error("Cannot convert ["+p+"] into a point (x, y)");
        }
        return {x:x, y:y};
    }


    repeatedBoard(board: Board):number {
        let sb = this.board2str(board);
        let cnt = this._last50.reduce((c, s)=>{
            return s==sb?c+1:c;
        }, 0)

        return cnt;
    }

    addRecord(A:Point, B:Point, jump:boolean) {
        // TODO: bug when there is a consicutive jump
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

    getHistory() {
        let records = [];
        
        for(let i=0; i<this._playHistory.length/2; i++) {
            let r1 = this._playHistory[i*2];
            let r2 = "";
            if (i*2+1 < this._playHistory.length) {
                r2 = this._playHistory[i*2+1];
            }
            
            records.push((i+1)+". "+r1+" "+r2)
        }

        return records;
    }

    exportRecords() {
        
        let records = this.getHistory();
        let lastrecord = records[records.length-1];

        let BW = lastrecord.split(" ").length==3?false:true;
        if (BW) {
            records.push("BW")
        } else {
            records.push("WW")
        }

        return records;
    }

    playBackATurn(env: App, record:string) {
        let pos = record.split("-")
                
        if(pos.length==1) {
            pos = record.split("x")
        }

        let pts = this.position2point(+pos[0]);
        let ptt = this.position2point(+pos[1]);
        
        let tokens = env.board.tokenLocation();
        let tiles = env.board.tiles;
        tokens[pts.x][pts.y].onClick(env.rules);

        tiles[ptt.x][ptt.y].onClick(env.rules);

    }
    
    playBack(env: App, records:string[]) {
        const timer = ms => new Promise(res => setTimeout(res, ms))

        let vm = this;
        async function load () {
            for (var i = 0; i < records.length; i++) {
                let r = records[i];
                let sp = r.split(" ");
                let p1 = sp[1];
                vm.playBackATurn(env, p1);
                
                await timer(2000); 
                if (sp.length >= 3) {
                    let p2 = sp[2];
                    vm.playBackATurn(env, p2);
                }

                await timer(2000); 
            }
        }

        load();
    }
}
