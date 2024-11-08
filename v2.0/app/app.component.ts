import { Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Player } from "./player";
import { Board } from "./board";
import { Token } from "./token";
import { Rules } from './rules';


import { PlayerAi } from './player-ai';
import { App } from './app';

export interface DialogData {
    title: string,
    subtitle: string
}

@Component({
  selector: 'endgame-dialog',
  templateUrl: 'endgame-dialog.html',
})
export class EndgameDiaglog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements App{
  title = 'app';

  players: Player[];
  board: Board;
  tokens: Token[];

  rules: Rules;
  constructor(public dialog: MatDialog) { 
    this.board = new Board();
    this.rules = new Rules(this, this.board);

    let player1 = new PlayerAi("P1", "#444444", true, this.rules);
    // let player1 = new Player("P1", "#444444", true);
    let player2 = new Player("P2", "#e26b6b", false);
    this.players = [player1, player2];  
    
    
    this.tokens = [];
    
    const _tokenpos = [
      this.rules.getStartTokenPositions(player1),
      this.rules.getStartTokenPositions(player2),
    ];

    this.tokens = this.board.placeTokens(_tokenpos, this.players);
    this.rules.takeTurn(player1);

    
    this.rules.setEndgameCallback((t1, t2)=> {
      this.openDialog(t1, t2);
    })

    // this.rules.records.playBack(this, [
    //   // "1. 8-12 27-23",
    //   // "2. 12-16 28-24",
    //   // "3. 7-10 24-20",
    //   // "4. 16-19",
    // ])
  }


  openDialog(title, subtitle) {
    this.dialog.open(EndgameDiaglog, {
      data: {
        title: title,
        subtitle: subtitle
      }
    });
  }
  
}
