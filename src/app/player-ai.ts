import {Player} from "./player";
import { Rules } from './rules';
import { Board } from './board';
import { Token } from './token';
import { App } from './app';
import { Records, Point } from './records';

export class MockPlayer extends Player {
    constructor(topplayer:boolean) {
        super("", "", topplayer)
    }
}

export class MockApp implements App{
    players: Player[];
    board: Board;
    tokens: Token[];

    rules: Rules;

    constructor(board:Board, players: Player[], tokens:Token[][]) {
        this.board = board;
        this.rules = new Rules(this, this.board);
        this.players = players;
        
        
        
        this.tokens = this.board.placeTokens([
            tokens[0].map((t)=>{ return [t.x, t.y]}), 
            tokens[1].map((t)=>{ return [t.x, t.y]}), 
        ], [players[0], players[1]]);

        let tokenloc = this.board.tokenLocation();
        tokens[0].forEach((t) => {
            if (t.king) {
                tokenloc[t.x][t.y].promote()
            }
        })

        tokens[1].forEach((t) => {
            if (t.king) {
                tokenloc[t.x][t.y].promote()
            }
        })
    }
}

export interface Move {
    s: Point,
    t: Point
}

export class State{
    game: MockApp;
    player: MockPlayer; //who plays next move
    level: number;
    move: Move;
    nextstates: State[] = [];
    value: number = 0;
    constructor(level:number, move:Move, game:MockApp, player:MockPlayer) {
        this.level = level;
        this.move = move;
        this.game = game;
        this.player = player;
    }

    addNextState(state:State) {
        this.nextstates.push(state);
    }
}


function shuffleArray(array:any[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array
}

export class PlayerAi extends Player {
    private _rules: Rules;
    constructor(name:string, color:string, topplayer:boolean, rules:Rules) {
        super(name, color, topplayer);
        this._rules = rules;
    }

    mock(players: Player[], topplayer:boolean): [MockApp, MockPlayer, MockPlayer] {
        let mockboard = new Board()
        let mockp1 = new MockPlayer(true);
        let mockp2 = new MockPlayer(false);
        
        let token1, token2;
        if (players[0].topplayer) {
            token1 = players[0].tokens;
            token2 = players[1].tokens;
        } else {
            token1 = players[1].tokens;
            token2 = players[0].tokens;
        }

        let mockgame = new MockApp(mockboard, [mockp1, mockp2], [token1, token2]);

        let mockOpponent = mockp2;
        let mockMe = mockp1;
        if (!topplayer) {
            mockOpponent = mockp1;
            mockMe = mockp2;
        }

        return [mockgame, mockOpponent, mockMe];
    }

    printBoard(mockboard: Board) {
        let records = new Records(mockboard);
        let s = records.board2str(mockboard);
        for(let i=0; i<8;i++) {
            console.log((i)+" "+s.substring(i*8, i*8+8))
        }
    }

    play() {
        console.log("Thinking....")
        let evaluateQueue: State[] = []

        this.tokens.forEach((token)=>{
            let moves = this._rules.moveableTile(token);

            if (moves.length<1) {
                return;
            }

            moves.forEach((tile) => {
                let m = this.mock(this._rules.env.players, this.topplayer)
                let mockgame = m[0];
                let mockOpponent = m[1];
                let mockMe = m[2];

                try{
                    let tokenloc = mockgame.board.tokenLocation();
                    let mocks = tokenloc[token.x][token.y];
                    mocks.select()
                    
                    let mockt = mockgame.board.tiles[tile.x][tile.y];
                    
                    mockgame.rules.takeTurn(mockMe)
                    mockgame.rules.move(mockt);

                    let s = new State(0, {s:token, t:mockt}, mockgame, mockOpponent);
                    evaluateQueue.push(s)
                } catch(err) {
                    // TODO: It throws error because moveableTile() doesn't consider jumps is compusary
                    console.log("Err1", err);
                }
            })
            
        })

        let idx = 0;
        let idxcheck = -1
        let maxdepth = 2;
        
        let initStates:State[] = [...evaluateQueue]
        while(evaluateQueue.length >0) {
            idx += 1;

            let state = evaluateQueue.shift()

            state.player.tokens.forEach((token)=>{
                let moves = state.game.rules.moveableTile(token);

                if (moves.length<1) {
                    return;
                }

                moves.forEach((tile) => {
                    let m = this.mock(state.game.rules.env.players, state.player.topplayer)
                    let mockgame = m[0];
                    let mockOpponent = m[1];
                    let mockMe = m[2];

                    // assert(mockMe.topplayer==state.player.topplayer)
                    try{
                        // if (idx==idxcheck) {
                        //     console.log("============================")
                        //     this.printBoard(mockgame.board)
                        //     console.log(token.x, token.y)
                        //     console.log(tile.x, tile.y)
                        // }

                        let tokenloc = mockgame.board.tokenLocation();
                        let mocks = tokenloc[token.x][token.y];
                        mocks.select()
                        
                        let mockt = mockgame.board.tiles[tile.x][tile.y];
                        
                        mockgame.rules.takeTurn(mockMe)
                        mockgame.rules.move(mockt);

                        // if (idx==idxcheck) {
                        //     this.printBoard(mockgame.board)
                        // }

                        let s = new State(state.level+1, {s:token, t:mockt}, mockgame, mockOpponent);
                        if (state.level+1<maxdepth) {
                            state.addNextState(s);
                            evaluateQueue.push(s)
                        }
                    } catch(err) {
                        // TODO: It throws error because moveableTile() doesn't consider jumps is compusary
                        console.log("Err2", err);
                        // this.printBoard(mockgame.board)
                        // console.log(token.x, token.y)
                        // console.log(tile.x, tile.y)
                    }
                })
                
            })
        }

        let rootState = new State(-1, null, null, null);
        initStates.forEach((s)=>{
            rootState.addNextState(s)
        })
        this.selectBestMove(rootState, maxdepth);

        let states = shuffleArray(rootState.nextstates).sort((a, b) => {
            return (a.value>b.value)?-1:1;
        })

        let successmove = false;
        while(!successmove) {
            let bestState = states.shift();
            try {
                let token = bestState.move.s;
                let tile = bestState.move.t;

                let tokenloc = this._rules.env.board.tokenLocation();
                let s = tokenloc[token.x][token.y];
                s.select()
                
                let t = this._rules.env.board.tiles[tile.x][tile.y];
                
                this._rules.move(t);
                successmove = true
            } catch(err) {
                console.log("Err3", err);
            }
        }
        
        console.log("Moved")
    }

    evaluateBoard(state:State):number {
        let topplayer = state.game.players[0].topplayer?state.game.players[0]:state.game.players[1]
        let score = 0;
        topplayer.tokens.forEach((t)=>{
            if(t.king) {
                score += 100
            } else {
                score += 10
            }

            score += t.x;
        })

        let downplayer = state.game.players[0].topplayer?state.game.players[1]:state.game.players[0]
        downplayer.tokens.forEach((t)=>{
            if(t.king) {
                score -= 100
            } else {
                score -= 10
            }

            // TODO: dynamic board size
            score += (t.x-8);
        })
        return score;
    }

    selectBestMove(state:State, maxdepth: number):number {
        if (state.level==maxdepth-1) {
            let val = this.evaluateBoard(state);
            state.value = val;
            return val;
        }

        let scores = state.nextstates.map((s)=> {
            return this.selectBestMove(s, maxdepth);
        })

        let val = scores.reduce((acc, curr) => {
            if (state.level%2 == 0) {
                return Math.max(acc, curr);
            } else {
                return Math.min(acc, curr);
            }
        }, scores[0])

        state.value = val;
        return val;
    }
}
