import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Player } from "../player";
import { Rules } from '../rules';

@Component({
  selector: 'stat',
  templateUrl: './board-stat-component.component.html',
  styleUrls: ['./board-stat-component.component.css']
})
export class BoardStatComponentComponent implements OnInit {
  @Input() player1: Player;
  @Input() player2: Player;
  @Input() rules: Rules;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.player1, this.player2)

  //   Player.prototype.activate = function() {
  //     this.active = true;
  //     this.stat.css("background-color", this.color);
  //     this.stat.css("color", "#fff");
  // }
  
  // Player.prototype.deactivate = function() {
  //     this.active = false;
  //     this.stat.css("background-color", "");
  //     this.stat.css("border-color", this.color);
  //     this.stat.css("color", this.color);
  // }
  }

  getBackgroundColor(player: Player):string {
    if (player.active) {
      return player.color
    } else {
      return "#fff";
    }
  }

  getTextColor(player: Player):string {
    if (player.active) {
      return "#fff";
    } else {
      return player.color;
    }
  }
}
