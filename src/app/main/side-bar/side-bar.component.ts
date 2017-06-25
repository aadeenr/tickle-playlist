import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';

const _window: any = window;

@Component({
  	selector: 'side-bar',
  	templateUrl: './side-bar.component.html',
  	styleUrls: ['./side-bar.component.scss'],
    animations: [
        trigger('toggleAnimation', [
            state('visible', style({
                top: '46px',
            })),
            state('hidden', style({
                top: '-41px',
            })),
            transition('* => *', animate('300ms ease-in')),
        ]),
    ]
})

export class SidebarComponent {
	@Output() resetPlaylistEvent = new EventEmitter(); 
	@Output() removeMediaEvent = new EventEmitter();

	@Input() playlist;
	@Input() repeat: boolean;
	@Input() shuffle: boolean;
	@Input() 
	set playlistChange(event: any) {
		event ? this.playNext(event[1]) : false;
	}

    constructor(
        private iframeService: YoutubeIframeService,
        private playlistStoreService: PlaylistStoreService
    ) {
		_window.addEventListener('message', (event) => {
            if (Number.isInteger(event.data)) {
                if (event.data === 0) {
                    this.playNext('playNext');
                }
            }
        }, false);
    }
    state: string = 'hidden';

	toggle() {
		this.state = (this.state === 'visible' ? 'hidden' : 'visible');
	}

	resetPlaylist(): void {
		this.resetPlaylistEvent.emit();
	}

	removeMedia(media: any): void {
		this.playlist.splice(this.playlist.indexOf(media), 1);
		this.removeMediaEvent.emit(media);
	}

    play(id: string): void {
		this.iframeService.getVideoId(id);
		let playlist = document.getElementById('playlist-scroll');
		playlist.scrollTop = document.getElementById(id).offsetTop - 74;
	}

	currentlyPlaying(id: string): boolean {
		return this.iframeService.getCurrentVideo() === id;
	}

	playNext(where: string): void {
		let nowPlaying = this.iframeService.getCurrentVideo();
		let inPlaylist = undefined;

		if (this.repeat) {
			this.play(nowPlaying);
			return;
		}
		
		while (typeof(this.playlist) === 'undefined') {
			this.resetPlaylist();
		}

		this.playlist.forEach((media, index) => {			
			if (media.id === nowPlaying) {				
				inPlaylist = index;
			}
		});		

		if (inPlaylist !== undefined) {
			let playlist = document.getElementById('playlist-scroll');
			let nowPlaying = document.getElementById(this.playlist[inPlaylist].id);
			let topPos = nowPlaying.offsetTop;
			
			if (this.shuffle) {
				let shuffled = this.playlist[this.getShuffled(inPlaylist)].id;
				this.play(shuffled);
				playlist.scrollTop = document.getElementById(shuffled).offsetTop - 74;
				
			} else {
				if(where === 'playNext') {
					if (this.playlist.length - 1 === inPlaylist) {
						this.play(this.playlist[0].id);
						playlist.scrollTop = 0;
						console.log('first case');
						
					} else {
						this.play(this.playlist[inPlaylist + 1].id);
						playlist.scrollTop = topPos + 30;
						console.log('second case');
						
					}
				} else {
					if (inPlaylist === 0) {
						this.play(this.playlist[this.playlist.length - 1].id);
						playlist.scrollTop = playlist.scrollHeight;
						console.log('third case')
					} else {
						this.play(this.playlist[inPlaylist - 1].id);
						playlist.scrollTop = topPos - 148;
						console.log('fourth case')
					}
				}
			}
		}
	}

	getShuffled(index: number): number {
		let i = Math.floor(Math.random() * this.playlist.length);
		return i !== index ? i : this.getShuffled(index);
	}

	downloadPlaylist() {
		let JSONdata = JSON.stringify(this.playlistStoreService.getStoredPlaylists());
		let data = "text/json;charset=utf-8," + encodeURIComponent(JSONdata);
		let a = _window.document.createElement('a');
		a.href = 'data:' + data;
		a.download = 'playlist.json';
		a.click();
	}

	uploadPlaylist() {
		_window.document.getElementById('upload-input').click();
	}

	changePlaylist(data: any) {
		let file = data.dataTransfer ? data.dataTransfer.files[0] : data.target.files[0];
		if(file.name.split('.').pop() !== 'json') {
			return;
		}
		let reader = new FileReader();
		let me = this;
		reader.readAsText(file);
		reader.onload = function(ev) {
			let list;
			try {
				list = JSON.parse(ev.target['result']);				
			} catch (exc) {
				list = null;
			}
			if(!list) {
				return;
			}
			if(list.length < 1) {
				return;
			}
			
			if(typeof(list) === 'object') {
				me.playlist = list.playlists;
			} else {
				me.playlist = list;
			}
			me.playlistStoreService.importPlaylist(me.playlist);
			document.getElementById('upload-input')['value'] = '';
		}
	}
}
