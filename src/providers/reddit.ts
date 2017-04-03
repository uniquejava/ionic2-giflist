import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Reddit provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Reddit {

  // the settings the user has supplied
  settings: any;

  // whether new GIFs are currently being fetched
  loading: boolean = false;

  // the entries for all the GIFs currently loaded
  posts: any = [];

  // the current subreddit
  subreddit: string = 'gifs';

  // the current page (i.e. how many times the user has clicked "Load More")
  page: number = 1;

  // the amount of GIFs to display per page
  perPage: number = 15;

  // A reference to the last post retrieved from Reddit (so we know where to start for the next page)
  after: string;

  // This will be used to store a reference to the length of the posts array
  stopIndex: number;

  // the sort order for GIFs
  sort: string = 'hot';

  // The app will keep trying to load more posts from reddit until it has enough for a full page of GIFs, moreCount is
  // used to tell when it should stop trying to load more (i.e. if not enough GIFs are found after hitting the API 20 times
  moreCount: number = 0;

  constructor(public http: Http) {
    console.log('Hello Reddit Provider');
  }

  fetchData(): void {

  }

}
