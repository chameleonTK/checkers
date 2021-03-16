import { Token } from "./token";

export class Player {
    readonly name: string;
    readonly color: string;

    active:boolean;
    tokens: Token[];

    constructor(name:string, color:string) {
        this.name = name;
        this.color = color;
        this.tokens = [];

        this.active = false;
    }

    getNKnight():number {
        return this.tokens.reduce((acc, curr) => {
            return curr.king?acc:acc+1;
        }, 0);
    }

    getNKing():number {
        return this.tokens.reduce((acc, curr) => {
            return curr.king?acc+1:acc;
        }, 0);
    }

    addToken(token: Token):void {
        this.tokens.push(token);
    }
}
