import { TicklePlaylistPage } from './app.po';

describe('tickle-playlist App', () => {
  let page: TicklePlaylistPage;

  beforeEach(() => {
    page = new TicklePlaylistPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
