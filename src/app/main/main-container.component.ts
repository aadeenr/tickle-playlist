import { Component, Output, EventEmitter } from '@angular/core';

import { PlaylistStoreService } from '../shared/services/playlist-store.service';
import { YoutubeIframeService } from '../shared/services/youtube-iframe.service';

@Component({
  selector: 'main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})

export class MainComponent {
  public playlist = [];
  public mediaList = [];
  public playlistChange = [0, ''];

  constructor(
    private playlistStoreService: PlaylistStoreService,
    private iframeService: YoutubeIframeService
  ) {
    this.playlist = this.playlistStoreService.getStoredPlaylists().playlists;
  }

  playFirstInPlaylist(): void {
		if (this.playlist[0]) {      
			let playlistEl = document.getElementById('playlist');
			playlistEl.scrollTop = 0;
			this.iframeService.getVideoId(this.playlist[0].id);
		}
	}

  searchVideos(videos: Array<any>): void {
		this.mediaList = videos;
	}

  playlistDo(event: any) {
    let toIncrement = Number(this.playlistChange[0]) + 1;
    this.playlistChange = [toIncrement, event];
}

  resetPlaylist(): void {
		this.playlist = [];
		this.playlistStoreService.resetPlaylist();
	}

  checkMediaInPlaylist(media: any): void {    
    if (!this.playlist.some(item => item.id === media.id)) {
			this.playlist.push(media);
			this.playlistStoreService.addToPlaylist(media);
		}    
  }
}
