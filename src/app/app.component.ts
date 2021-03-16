import { Component } from '@angular/core';
import { Player } from "./player";
import { Board } from "./board";
import { Token } from "./token";

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

  private turn: number;
  constructor() { 
    let player1 = new Player("P1", "#444444");
    let player2 = new Player("P2", "#e26b6b");
    this.players = [player1, player2];  
    this.board = new Board();
    this.turn = 0;

    this.tokens = [];
    const _tokenpos = [
      [
        [0, 1], [0, 3], [0, 5], [0, 7],
        [1, 0], [1, 2], [1, 4], [1, 6],
      ],
      [
        [6, 1], [6, 3], [6, 5], [6, 7],
        [7, 0], [7, 2], [7, 4], [7, 6],
      ]
    ];

    _tokenpos.forEach((tpos, pid) => {
      let player = this.players[pid]
      console.log(player)
      tpos.forEach((p) => {
        let token = new Token(p[0], p[1], player)
        this.tokens.push(token);
      })
    })

    player2.active = true;
    
  }

  getTurnIndex() {
    return (this.turn%2);
  }

  getActivePlayer = function() {
      return this.players[this.turnIndex()];
  }

  getOpponent = function() {
      return this.players[(this.turnIndex()+1)%2];
  }
}
