import {Token} from "./Token";
import {Tile} from "./Tile";
import {Move} from "./Move";
import {Checker} from "./Checker";
import {Player} from "./Player";

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

export class PlayerRandomBot extends Player {
    constructor(index, name, color, firstPlayer) {
        super(index, name, color, firstPlayer);
    }

    play(game: Checker, delay: number = 100): void {
        console.log(`${this.name} is playing...`);
        if (game.currentGameState.end) {
            return;
        }

        setTimeout(() => {
            const moves = this.tokens.reduce((acc, token) => {
                return acc.concat(this.getNextMoves(token, game.board));
            }, []);
    
            const shuffledMoves = shuffle(moves);
            const jumpMoves = shuffledMoves.filter((m) => m.isJump);
            let nextMove = null;
            if (jumpMoves.length > 0) {
                nextMove = jumpMoves[0];
            } else {
                nextMove = shuffledMoves[0];
            }
    
    
            game.selectToken(nextMove.token);
            game.selectTile(nextMove.tile);
        }, delay);
    }

    

}
