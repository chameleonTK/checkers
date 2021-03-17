import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Tile } from "../tile";
import { Token } from "../token";
import { Rules } from '../rules';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
  @Input() rules: Rules;

  constructor() { 
  }

  ngOnInit(): void {
  }

  rowClassName(i:number): string {
    return Tile.rowClassName(i);
  }

}
