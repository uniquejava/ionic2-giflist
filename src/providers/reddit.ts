import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
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
  perPage: number = 3;

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
    // build the url that will be used to access the API based on the users' current preference
    let url = 'https://www.reddit.com/r/' + this.subreddit + '/' + this.sort + '/.json?limit=' + this.perPage;

    // if we aren't on the first page, we need to add the after parameter so that we only get new results
    // this parameter basically says "give me the posts that come AFTER this post"
    if (this.after) {
      url += '&after=' + this.after;
    }

    // we are now currently fetching data, so set the loading variable to true
    this.loading = true;

    // make a http request to the URL and subscribe to the response
    this.http.get(url).map(res => res.json()).subscribe(data => {
      let stopIndex = this.posts.length;
      this.posts = this.posts.concat(data.data.children);

      // loop through all NEW posts that have been added. We are looping through
      // in reverse since we are removing some items.
      for (let i = this.posts.length - 1; i >= stopIndex; i--) {
        let post = this.posts[i];
        // add a new property that will later be used to toggle a loading animations for individual posts
        post.showLoader = false;
        post.alreadyLoaded = false;

        // Add a NSFW thumbnail to NSFW posts.
        if (post.data.thumbnail == 'nsfw') {
          this.posts[i].data.thumbnail = 'images/nsfw.png';
        }

        /**
         * Remove all posts that are not in the .gifv or .webm format and convert the ones that are to .mp4 files.
         */
        if (post.data.url.indexOf('.gifv') > -1 || post.data.url.indexOf('.webm') > -1) {
          this.posts[i].data.url = post.data.url.replace('.gifv', '.mp4');
          this.posts[i].data.url = post.data.url.replace('.webm', '.mp4');

          // if a preview image is available, assign it to the post as 'snapshot'
          if (typeof post.data.preview != "undefined") {
            this.posts[i].data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');
            // if the snapshot is undefined, change it to be blank so it doesnt use a broken image
            if (this.posts[i].data.snapshot == undefined) {
              this.posts[i].data.snapshot = '';
            }
          } else {
            this.posts[i].data.snapshot = '';
          }
        } else {
          this.posts.splice(i, 1);
        }
      }

      // keep fetching more GIFs if we didn't retrieve enough to fill a page
      // but give up after 20 tries if we still don't have enough
      if (data.data.children.length === 0 || this.moreCount > 20) {
        this.moreCount = 0;
        this.loading = false;
      } else {
        this.after = data.data.children[data.data.children.length - 1].data.name;
        if (this.posts.length < this.perPage * this.page) {
          this.fetchData();
          this.moreCount++;
        } else {
          this.loading = false;
          this.moreCount = 0;
        }
      }

    }, error => {
      // fail silently, in this case the loading spinner will just continue to display
      console.log("subreddit doesn't exist!");
    });

  }

  nextPage(): void {
    this.page++;
    this.fetchData();
  }

  resetPosts(): void {
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }

}
