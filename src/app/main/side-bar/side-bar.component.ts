import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';

const _window: any = window;

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

export class SidebarComponent {
	@Output() resetPlaylistEvent = new EventEmitter();
	// @Output() uploadPlaylistEvent = new EventEmitter();

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

	resetPlaylist(): void {
		this.resetPlaylistEvent.emit();
	}

    play(id: string): void {		
		this.iframeService.getVideoId(id);		
	}

	currentlyPlaying(id: string): boolean {
		return this.iframeService.getCurrentVideo() === id;
	}

	removeFromPlaylist(media: any): void {
		this.playlist.splice(this.playlist.indexOf(media), 1);
		this.playlistStoreService.removeFromPlaylist(media);
	}

	playNext(where: string): void {
		let nowPlaying = this.iframeService.getCurrentVideo();
		let inPlaylist = undefined;

		if (this.repeat) {
			this.iframeService.getVideoId(nowPlaying);
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
			let topPos = document.getElementById(this.playlist[inPlaylist].id).offsetTop;
			let playlist = document.getElementById('playlist');
			
			if (this.shuffle) {
				let shuffled = this.playlist[this.getShuffled(inPlaylist)].id;
				this.iframeService.getVideoId(shuffled);
				playlist.scrollTop = document.getElementById(shuffled).offsetTop - 100;
			} else {
				if(where === 'playNext') {
					if (this.playlist.length - 1 === inPlaylist) {
						this.iframeService.getVideoId(this.playlist[0].id);
						playlist.scrollTop = 0;
						
					} else {
						this.iframeService.getVideoId(this.playlist[inPlaylist + 1].id)
						playlist.scrollTop = topPos - 100;
						
					}
				} else {
					if (inPlaylist === 0) {
						this.iframeService.getVideoId(this.playlist[this.playlist.length - 1].id);
						playlist.scrollTop = 0;
						
					} else {
						this.iframeService.getVideoId(this.playlist[inPlaylist - 1].id)
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
		console.log('download: ', JSON.stringify(this.playlistStoreService.getStoredPlaylists()));
		let JSONdata = JSON.stringify(this.playlistStoreService.getStoredPlaylists());
		let data = "text/json;charset=utf-8," + encodeURIComponent(JSONdata);
		let a = _window.document.createElement('a');
		a.href = 'data:' + data;
		a.download = 'playlist.json';
		a.click();
	}

	uploadPlaylist() {
		console.log('upload: ', _window.document.getElementById('upload-input'));
		_window.document.getElementById('upload-input').click();
	}

	changePlaylist(data: any) {
		console.log(data.target.files[0], '::reader loaded');

		let file = data.dataTransfer ? data.dataTransfer.files[0] : data.target.files[0];
		if(file.name.split('.').pop() !== 'json') {
			console.log('File not supported.');
			return;
		}
		let reader = new FileReader();
		let me = this;
		reader.readAsText(file);
		reader.onload = function(ev) {
			let list;
			try {
				list = JSON.parse(ev.target['result']);
				console.log(list, '::list');
				
			} catch (exc) {
				list = null;
			}
			if(!list) {
				console.log('Playlist not valid.');
				return;
			}
			if(list.length < 1) { 
				console.log('Nothing to import.');
				return;
			}
			// me.uploadPlaylistEvent.emit(list);
			
			console.log(typeof(list.playlists),'Playlist imported.');
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
