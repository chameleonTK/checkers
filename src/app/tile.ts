export class Tile {
    x: number;
    y: number
    readonly playable: boolean;
    readonly className: string;
    readonly left:string;
    readonly top:string;
    constructor(x: number, y:number, playable: boolean) {
        this.x = x;
        this.y = y;
        this.playable = playable;

        this.className = "tile-col-"+y+" "+ (playable?'tile-white':'tile-black');
        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";
    }
    
    static rowClassName(i:number):string {
        return 'tile-row-'+i;
    }

}
