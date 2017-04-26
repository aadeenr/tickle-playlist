import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

export class SidebarComponent {
	@Input() playlist;
	@Input() repeat;
	@Input() shuffle;
    @Input() toggle;

    constructor(
        private iframeService: YoutubeIframeService,
        private playlistStoreService: PlaylistStoreService
    ) {
        this.iframeService.videoChangeEvent.subscribe(event => {
            console.log(event, '::videoChangeEvent in SideBar');
            return event ? this.playNext() : false
        });
    }

	resetPlaylist(): void {
		this.playlistStoreService.resetPlaylist();
	}

    play(id: string): void {
		this.iframeService.getVideoId(id);
	}

	currentPlaying(id: string): boolean {
		return this.iframeService.getCurrentVideo() === id;
	}

	removeFromPlaylist(media: any): void {
		this.playlist.splice(this.playlist.indexOf(media), 1);
		this.playlistStoreService.removeFromPlaylist(media);
	}

	playNext(): void {
		let nowPlaying = this.iframeService.getCurrentVideo();
		let inPlaylist = undefined;

		if (this.repeat) {
			this.iframeService.getVideoId(nowPlaying);
			return;
		}

		this.playlist.forEach((media, index) => {
			if (media.id === nowPlaying) {
				inPlaylist = index;
			}
		});

		if (inPlaylist !== undefined) {
			
			let topPos = document.getElementById(this.playlist[inPlaylist].id).offsetTop;
			let playlistEl = document.getElementById('playlist');
			// if (this.shuffle) {
			// 	let shuffled = this.playlist[this.getShuffled(inPlaylist)].id;
			// 	this.iframeService.getVideoId(shuffled);
			// 	playlistEl.scrollTop = document.getElementById(shuffled).offsetTop - 100;
			// } else {
			// 	if (this.playlist.length - 1 === inPlaylist) {
			// 		this.iframeService.getVideoId(this.playlist[0].id);
			// 		playlistEl.scrollTop = 0;
			// 	} else {
			// 		this.iframeService.getVideoId(this.playlist[inPlaylist + 1].id)
			// 		playlistEl.scrollTop = topPos - 100;
			// 	}
			// }
		}
	}

	getShuffled(index: number): number {
		let i = Math.floor(Math.random() * this.playlist.length);
		return i !== index ? i : this.getShuffled(index);
	}
}
