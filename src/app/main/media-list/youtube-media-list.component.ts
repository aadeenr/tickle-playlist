import { Component, Output, Input, EventEmitter } from '@angular/core';

import { YoutubeIframeService } from '../../shared/services/youtube-iframe.service';
import { YoutubeApiService } from '../../shared/services/youtube-api.service';

@Component({
	selector: 'youtube-media-list',
	templateUrl: 'youtube-media-list.component.html',
	styleUrls: ['youtube-media-list.component.scss'],
  	providers: [ YoutubeIframeService ]
})

export class YoutubeMediaListComponent {
	@Input() mediaList;
	@Output() checkMediaEvent: EventEmitter<any> = new EventEmitter();

	constructor(
		private iframeService: YoutubeIframeService,
		private apiService: YoutubeApiService
    ){}

	play(media: any): void {
		this.iframeService.getVideoId(media.id);
		this.addToPlaylist(media);
	}

	addToPlaylist(media: any): void {
		this.checkMediaEvent.emit(media);
	}

	onScroll () {
		this.apiService.searchMore().then(data => {
			data.forEach(element => {
				let id = element.id;
				let x = this.mediaList.filter(same => same.id == id)[0];

				if (!x) {
					this.mediaList.push(element);
				}
			});
		});
	}
}
