import { Token } from "./token";

export class Player {
    readonly name: string;
    readonly color: string;
    readonly topplayer: boolean;

    active:boolean;
    tokens: Token[];

    constructor(name:string, color:string, topplayer:boolean) {
        this.name = name;
        this.color = color;
        this.tokens = [];

        this.active = false;
        this.topplayer = topplayer;
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
