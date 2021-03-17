import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Tile } from "../tile";
import { Token } from "../token";
import { Rules } from '../rules';

@Component({
  selector: 'board',
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css']
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
