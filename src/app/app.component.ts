import { Component } from '@angular/core';
import { Player } from "./player";
import { Board } from "./board";
import { Token } from "./token";
import { Rules } from './rules';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  players: Player[];
  board: Board;
  tokens: Token[];

  rules: Rules;
  constructor() { 
    let player1 = new Player("P1", "#444444", true);
    let player2 = new Player("P2", "#e26b6b", false);
    this.players = [player1, player2];  
    this.board = new Board();
    
    this.tokens = [];
    this.rules = new Rules(this);
    const _tokenpos = [
      this.rules.getStartTokenPositions(player1),
      this.rules.getStartTokenPositions(player2),
    ];

    this.tokens = this.board.placeTokens(_tokenpos, this.players);
    this.rules.takeTurn(player2);
  }

  
}
