import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponentComponent } from './board-component/board-component.component';
import { BoardStatComponentComponent } from './board-stat-component/board-stat-component.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponentComponent,
    BoardStatComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }