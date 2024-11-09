import { Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Checker } from "./Checker";
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

  // players: Player[];
  game: Checker;
  // tokens: Token[];

  // rules: Rules;
  constructor(public dialog: MatDialog) { 
    this.game = new Checker();
    
    this.game.setEndgameCallback((gameState)=> {
      this.openDialog("Game Over", gameState.cause);
    })
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
