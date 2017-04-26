import { Component, ViewEncapsulation, AfterContentInit, Output, EventEmitter } from '@angular/core';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service'

@Component({
    selector: 'player-controls',
    templateUrl: './player-controls.component.html',
    styleUrls: [
        './player-controls.component.css',
        './youtube-iframe.component.scss'
        ],
    providers: [ YoutubeIframeService ],
    encapsulation: ViewEncapsulation.None
})
 
 export class PlayerControlsComponent implements AfterContentInit {
    @Output() playFirstInPlaylist = new EventEmitter();

    public iframeStateEvent: string = 'pause';
    
    constructor (
         private iframeService: YoutubeIframeService
    ) {
        this.iframeService.playerStateEvent.subscribe(state => this.iframeStateEvent = state);
    }

    ngAfterContentInit() {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.iframeService.createIframe();
    }

    playerDo(event: string): void {
        this.iframeStateEvent = event;
        if(!this.iframeService.getCurrentVideo()) {
			this.playFirstInPlaylist.emit();
			return;
		}
        event === 'pause' ? this.iframeService.pauseVideo() : this.iframeService.playVideo();
    }
 }
 