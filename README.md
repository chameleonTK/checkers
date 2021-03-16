# Thai Checkers

Ref: https://github.com/kschuetz/checkers
* Jumps are compulsory. As long as you have an opportunity to capture, you must take it.
* If a piece can continue to jump once it has jumped, it must do so in the same turn.
* If there is more than one alternative for capture, you may choose which one to take. It need not be the path that takes the most pieces.
* When a checker is kinged, the turn automatically ends, even if the king can continue to jump.
* If an exact board position is repeated a third time, the game automatically ends in a draw.
* If 50 moves have taken place (for both players) since the last capture or advancement of a regular checker, the game ends in a draw.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build --prod --base-href https://wp.curve.in.th/checkers/` to build. The build artifacts will be stored in the `dist/` directory. 

Then run `ngh --dir=dist/app` to deplot the project.

see [[How to deploy Angular Apps to GitHub Pages (gh-pages)](https://medium.com/tech-insights/how-to-deploy-angular-apps-to-github-pages-gh-pages-896c4e10f9b4)]