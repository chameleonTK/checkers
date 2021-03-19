import { Player } from "./player";
import { Rules } from './rules';
import { Tile } from './tile';

import { App } from './app';

export class Token {
    x: number;
    y: number
    king: boolean;
    left:string;
    top:string;
    _selected: boolean;
    _moveable: boolean;

    readonly owner: Player;
    

    constructor(x: number, y:number, owner: Player) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.king = false;
        this._selected = false;
        this._moveable = false;
        

        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";
    }

    static removeToken(token: Token, env:App) {
        // TODO: refactor; it should be stored in one place
        token.owner.removeToken(token);
        env.board.removeToken(token)
    }

    getColor(hasTransparent?:boolean):string {
        if (hasTransparent) {
            if (this.king) {
                return this.owner.color+"80";
            } else {
                return this.owner.color;
            }
        }

        return this.owner.color;
        
    }

    getClass():string {
        return [
            (this.owner.active?'active':''),
            (this.king?'token-king':''),
        ].join(" ")
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

    promote() {
        this.king = true;
    }

    onClick(rules: Rules){
        if (!this.owner.active) {
            return;
        }

        if (!this._moveable) {
            return;
        }

        if (this._selected) {
            rules.resetMove();
        } else {
            rules.resetMove();
            this.select();

            let tiles:Tile[] = rules.moveableTile(this);

            tiles = rules.neitherJumpOrMove(this, tiles);
            tiles.forEach((t)=>{
                t.highlight();
            })
        }
        
    }

    move(x: number, y: number): boolean {
        if (!this._moveable) {
            return false;
        }

        this.x = x;
        this.y = y;
        this.left = ((y)*10)+"vmin";
        this.top = ((x)*10)+"vmin";
        return true
    }
}
