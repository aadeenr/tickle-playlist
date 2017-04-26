import { Injectable, EventEmitter, Output, Input } from '@angular/core';

let _window: any = window;

@Injectable()
export class YoutubeIframeService  {
    @Output() playerStateEvent: EventEmitter<any> = new EventEmitter(true);
    @Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
    
      public ytPlayer: any;
      public videoId: string = "nSDgHBxUbVQ";

      createIframe() {
          let interval = setInterval(() => {
              if((typeof _window.YT !== "undefined") && _window.YT && _window.YT.Player) {
                let ytPlayer = new _window.YT.Player('ytplayer', {
                    height: '270',
                    width: '480',
                    videoId: this.videoId,
                    events: {
                        onStateChange: (event) => {
                            this.onPlayerStateChange(event);
                        }
                    }                    
                });
                clearInterval(interval);
              this.ytPlayer = ytPlayer;
              }
          }, 100)               
        }
      
      onPlayerStateChange(event: any) {
          const state = event.data;
          switch(state) {
              case 0: 
                this.videoChangeEvent.emit(true);
                this.playerStateEvent.emit('pause');
                break;
              case 1: 
                this.playerStateEvent.emit('play');
                break;
              case 2: 
                this.playerStateEvent.emit('pause');
                break;
          }
      }

      getVideoId(videoId: string) {
          this.videoId = videoId;
          console.log(this.videoId, '::new videoID');
          
          if(!this.ytPlayer) {
              console.log('ytPlayer is ', this.ytPlayer);
              
              this.createIframe();

              return;
          }
          this.ytPlayer.loadVideoById(videoId);
      }

      playVideo(): void {
          this.ytPlayer.playVideo();
      }

      pauseVideo(): void {
          this.ytPlayer.pauseVideo();
      }

      getCurrentVideo(): string {
          return this.videoId;
      }
}
