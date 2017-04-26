import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }                from './app.component';
import { MainComponent }                from './main/main-container.component';
import { YoutubeSearchComponent }      from './main/search/youtube-search.component';
import { YoutubeMediaListComponent }   from './main/media-list/youtube-media-list.component';
import { PlayerControlsComponent }     from './main/controls/player-controls.component';
import { SidebarComponent }            from './main/side-bar/side-bar.component';

import { YoutubeApiService }    from './shared/services/youtube-api.service';
import { YoutubeIframeService } from './shared/services/youtube-iframe.service';
import { PlaylistStoreService } from './shared/services/playlist-store.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    YoutubeSearchComponent,
    PlayerControlsComponent,
    YoutubeMediaListComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    YoutubeApiService,
    YoutubeIframeService,
    PlaylistStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
