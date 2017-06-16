import { Injectable, EventEmitter, Output } from '@angular/core';

let _window: any = window;

@Injectable()
export class YoutubeIframeService  {
    @Output() playFirstInPlaylist = new EventEmitter();
    
    public currentPlayerState: any;

    constructor() {
        if(_window.YT) {
            this.onYoutubeIframeAPIReady();
        }
    }

    loadAPI() {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.onYoutubeIframeAPIReady;
    }

    onYoutubeIframeAPIReady() {
        _window.ytPlayer = new _window.YT.Player('ytplayer', {
            width: "480", 
            height: "270", 
            events: {
                'onStateChange': this.onPlayerStateChange,
                'onError': this.onPlayerError
            }
        });                
    }

    onPlayerError(event) {
        _window.postMessage('videoerror', '*');
        return;
    }

    onPlayerStateChange(event) {
        const state = event.data;
        _window.postMessage(state, '*');
    }

    getVideoId(videoId: string) {
        _window.videoId = videoId;
        
        if(!_window.ytPlayer['loadVideoById']) {
            console.log("loadVideoById() is undefined");            
        }
        _window.ytPlayer.loadVideoById(videoId);
    }

    playVideo(): void {          
        _window.ytPlayer.playVideo();
   }

    pauseVideo(): void {
        _window.ytPlayer.pauseVideo();
    }

    getCurrentVideo(): string {
        return _window.videoId;
    }
}
