import { Checker } from './Checker';

describe('Checker', () => {
  it('should create an instance', () => {
    expect(new Checker()).toBeTruthy();
  });

  it('should have only 2 players', () => {
    const checker = new Checker(); 
    expect(checker.players.length==2).toBeTruthy();
  });

  it('should have only one player as the first player while another is not', () => {
    const checker = new Checker(); 
    expect(checker.players[0].firstPlayer != checker.players[1].firstPlayer).toBeTruthy();
  });
});
