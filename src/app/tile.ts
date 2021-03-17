export class Tile {
    
    x: number;
    y: number
    readonly playable: boolean;
    readonly left:string;
    readonly top:string;

    private _highlight:boolean = false;
    constructor(x: number, y:number, playable: boolean) {
        this.x = x;
        this.y = y;
        this.playable = playable;

        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";
    }
    
    static rowClassName(i:number):string {
        return 'tile-row-'+i;
    }

    getClass():string {
        
        return [
            "tile-col-"+this.y, 
            (this.playable?'tile-white':'tile-black'),
            (this._highlight?'highlight':''),
        ].join(" ")
    }

    // highlight
    highlight() {
        this._highlight = true;
    }

    unhighlight() {
        this._highlight = false;
    }

    static flat(tiles: Tile[][]) {
        return tiles.reduce((acc, val) => acc.concat(val), []);
    }
}
