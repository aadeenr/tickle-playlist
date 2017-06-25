import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';

import { YoutubeApiService }    from '../../shared/services/youtube-api.service';
import { YoutubeIframeService }    from '../../shared/services/youtube-iframe.service';

@Component({
    selector: 'youtube-search',
    templateUrl: './youtube-search.component.html',
    styleUrls: ['./youtube-search.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class YoutubeSearchComponent implements OnInit {
    @Output() mediaList = new EventEmitter();
    searchInput: string = '';
	previousSearch: string;

	constructor(
        private apiService: YoutubeApiService,
        private iframeService: YoutubeIframeService
    ){
        this.apiService.searchVideos(this.searchInput).then(response => {
            this.mediaList.emit(response);
        });
	}
	
	searchVideos() {
		if (!this.searchInput.length || (this.previousSearch && this.previousSearch === this.searchInput)) return;

		this.mediaList.emit([]);
		this.previousSearch = this.searchInput;
		this.apiService.searchVideos(this.searchInput).then(data => this.mediaList.emit(data))
	}

    getSearch(searchInput: string) {
        this.searchInput = searchInput;
		this.searchVideos();
    }

    ngOnInit() {
        this.getSearch(this.searchInput);
    }
}