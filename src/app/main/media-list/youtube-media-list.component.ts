import { Component, Output, Input, EventEmitter } from '@angular/core';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';

@Component({
	selector: 'youtube-media-list',
	templateUrl: 'youtube-media-list.component.html',
	styleUrls: ['youtube-media-list.component.scss'],
  	providers: [ YoutubeIframeService ]
})

export class YoutubeMediaListComponent {
	@Input() mediaList;
	@Output() playlistEvent: EventEmitter<any> = new EventEmitter();

	constructor(
		private iframeService: YoutubeIframeService
    ){}

	play(media: any): void {
		this.iframeService.getVideoId(media.id);
		this.addToPlaylist(media);
	}

	addToPlaylist(media: any): void {
		this.playlistEvent.emit(media);
	}
}
