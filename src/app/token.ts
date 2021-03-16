import { Player } from "./player";

export class Token {
    x: number;
    y: number
    king: boolean;
    selected: boolean;

    readonly owner: Player;
    readonly left:string;
    readonly top:string;

    constructor(x: number, y:number, owner: Player) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.king = false;
        this.selected = false;

        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";

        this.owner.addToken(this);
    }

    getColor():string {
        return this.owner.color;
    }

    getClass():string {
        if (this.owner.active) {
            return "active"
        } else {
            return ""
        }
    }
}
