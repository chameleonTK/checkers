import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Tile } from "../Tile";
import { Token } from "../Token";
import { Checker } from "../Checker";
// import { Rules } from '../rules';
// import { faChessQueen } from '@fortawesome/free-solid-svg-icons';

// import {
//   trigger,
//   state,
//   style,
//   animate,
//   transition,
// } from '@angular/animations';

@Component({
    selector: 'board',
    templateUrl: './board-component.component.html',
    styleUrls: ['./board-component.component.css'],
    animations: [
      // trigger('movingtoken', [
      //     state('*', style({ 
      //       top: '{{top}}',
      //       left: '{{left}}'
      //     }), {params: {top: 0, left:0}}),
      //     transition('*=>*', animate('1s ease')),
      // ])

      // [@movingtoken]="{value: state, params: {top:token.top, left:token.left}}"
    ]
})
export class BoardComponentComponent implements OnInit {
    @Input() tiles: Tile[][];
    @Input() tokens: Token[];
    @Input() game: Checker;

  //   // faKing = faChessQueen;
    constructor() { 
    }

    ngOnInit(): void {
    }

    // Function for Tiles

    getRowTileClassName(i:number):string {
        return 'tile-row-'+i;
    }

    getClassTile(tile: Tile):string {
        return [
            "tile-col-"+tile.y, 
            (tile.playable ?'tile-white':'tile-black'),
            (tile.selected ?'highlight':''),
        ].join(" ")
    }

    getStyleTile(tile: Tile): Object {
        const left = ((tile.y)*10)+"vmin";
        const top = ((tile.x)*10)+"vmin";
        return {
            'top': top,
            'left': left
        }
    }

    onClickTile(tile: Tile) {
        this.game.selectTile(tile);
    }


    // Function for Tokens
    getClassToken(token: Token):string {

        return [
            (token.owner.active?'active':''),
            (token.isKing()?'token-king':''),
        ].join(" ")
    }

    getStyleToken(token: Token): Object {
        const left = ((token.y)*10)+"vmin";
        const top = ((token.x)*10)+"vmin";
        return {
            'top': top,
            'left': left
        }
    }

    onClickToken(token: Token) {
        this.game.selectToken(token);
    }

    getInnerStyleToken(token: Token): Object {

        const color = token.owner.color;
        const transparentColor = color+"80";
        const shadow = "0px 0px 20px 0px "+color;

        return {
            'box-shadow': token.selected ? shadow:'',
            'background-color': token.isKing() ? transparentColor:color,
            'border-color': color,
        }
    }

}
