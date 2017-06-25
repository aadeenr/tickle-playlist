import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }             from '@angular/forms';
import { HttpModule }              from '@angular/http';

import { InfiniteScrollModule }  from 'ngx-infinite-scroll';

import { AppComponent }                from './app.component';
import { MobileComponent }              from './mobile/mobile.component';
import { IntroComponent }              from './intro/intro.component';
import { MainComponent }               from './main/main-container.component';
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
    MobileComponent,
    IntroComponent,
    MainComponent,
    YoutubeSearchComponent,
    PlayerControlsComponent,
    YoutubeMediaListComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
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
