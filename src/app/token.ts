import { Player } from "./player";
import { Rules } from './rules';
import { Tile } from './tile';

import { AppComponent } from "./app.component";

export class Token {
    x: number;
    y: number
    king: boolean;
    left:string;
    top:string;
    _selected: boolean;
    
    readonly owner: Player;
    

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

    static removeToken(token: Token, env:AppComponent) {
        token.owner.removeToken(token);
        env.board.removeToken(token)
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
    
    unselect() {
        this._selected = false;
    }

    select() {
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
            this.select();
            let tiles:Tile[] = rules.moveable(this);
            tiles.forEach((t)=>{
                t.highlight();
            })
        }
        
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";
    }
}
