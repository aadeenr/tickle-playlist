import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';

let _window: any = window;

@Component({
    selector: 'player-controls',
    templateUrl: './player-controls.component.html',
    styleUrls: [
        './player-controls.component.scss',
        './youtube-iframe.component.scss'
        ],
    providers: [ YoutubeIframeService ],
    encapsulation: ViewEncapsulation.None
})
 
 export class PlayerControlsComponent {
    @Output() playFirstInPlaylist = new EventEmitter();
    @Output() playlistDoEvent = new EventEmitter();

    public currentState: string = 'pause';
    
    constructor (
         private iframeService: YoutubeIframeService
    ) {
        _window.addEventListener('message', (event) => {
            if (Number.isInteger(event.data)) {
                if (event.data === 1) {
                    this.currentState = 'play';                    
                } else {
                    this.currentState = 'pause';
                }
            }
            if (event.data === "videoerror") {
                this.playerDo('play');
                return;
            } else if (event.data === "search") {
                this.iframeService.loadAPI();
                _window.ytPlayer.destroy();
                
            }
        }, false);
    }

    playlistDo(event: string) {
        this.playlistDoEvent.emit(event);
    }

    playerDo(event: string): void {
        this.currentState = event;
        let id = this.iframeService.getCurrentVideo();

        if(!this.iframeService.getCurrentVideo()) {
			this.playFirstInPlaylist.emit();
            
			return;
		}
        event === 'pause' ? this.iframeService.pauseVideo() : this.iframeService.playVideo();
    }
 }
 