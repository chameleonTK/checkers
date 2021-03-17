import { Player } from "./player";
import { Rules } from './rules';
import { Tile } from './tile';

export class Token {
    x: number;
    y: number
    king: boolean;
    _selected: boolean;

    readonly owner: Player;
    readonly left:string;
    readonly top:string;

    constructor(x: number, y:number, owner: Player) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.king = false;
        this._selected = false;

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

    getShadowStyle():string {
        if (this._selected) {
            return "0px 0px 20px 0px "+this.getColor();
        } else {
            return "";
        }
    }
    
    unselected() {
        this._selected = false;
    }

    selected() {
        this._selected = true;
    }

    onClick(rules: Rules){
        if (!this.owner.active) {
            return false;
        }

        if (this._selected) {
            rules.resetMove();
        } else {
            rules.resetMove();
            this.selected();
            let tiles:Tile[] = rules.moveable(this);
            tiles.forEach((t)=>{
                t.highlight();
            })
        }
        
    }
}
