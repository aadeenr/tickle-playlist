import { Injectable } from '@angular/core';

@Injectable()
export class PlaylistStoreService  {
    private ticklePlaylist: string = 'tickle_playlist';
    private playlistsModel: Object = {
        'playlists': []
    };

    private init(): void {
        localStorage.setItem(this.ticklePlaylist, JSON.stringify(this.playlistsModel));
    }

    private parse() {
        return JSON.parse(localStorage.getItem(this.ticklePlaylist));
    }

    public getStoredPlaylists() {
        let storedPlaylist = this.parse();
        if(!storedPlaylist) {
            this.init();
            storedPlaylist = this.parse();
        }

        return storedPlaylist;
    }

    public addToPlaylist(media: any): void {
        let store = this.parse();
        store.playlists.push(media);
        localStorage.setItem(this.ticklePlaylist, JSON.stringify(store));
    }

    public removeFromPlaylist(media: any) {
        let store = this.parse();
        store.playlists = store.playlists.filter(item => item.id !== media.id);
        localStorage.setItem(this.ticklePlaylist, JSON.stringify(store));
    }

    public resetPlaylist() {
        this.init();
    }

    public importPlaylist(playlist: any): void {
        let store = this.parse();
        store.playlists = playlist;
        localStorage.setItem(this.ticklePlaylist, JSON.stringify(store));
    }
}
