import {Component} from '@angular/core';

import {ModalController, NavController, Platform} from 'ionic-angular';
import {Data} from "../../providers/data";
import {Reddit} from "../../providers/reddit";
import {Keyboard} from "@ionic-native/keyboard";
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {SettingsPage} from "../settings/settings";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  subredditValue: string;
  subredditControl: FormControl;

  constructor(public navCtrl: NavController,
              public dataService: Data,
              public redditService: Reddit,
              public modalCtrl: ModalController,
              public platform: Platform,
              public keyboard: Keyboard,
              public iab: InAppBrowser) {
    this.subredditControl = new FormControl();
  }

  ionViewDidLoad(): void {
    this.subredditControl.valueChanges.debounceTime(1500).distinctUntilChanged().subscribe(subreddit => {
      if (subreddit != '' && subreddit) {
        this.redditService.subreddit = subreddit;
        this.changeSubreddit();
        this.keyboard.close();
      }
    });
    this.platform.ready().then(_ => {
      this.loadSettings();
    })
  }

  loadSettings(): void {
    console.log('TODO: implement loadSettings()');
    this.redditService.fetchData();
  }


  changeSubreddit() {
    this.redditService.resetPosts();
  }

  playVideo(e, post): void {
    // create a reference to the video
    let video = e.target;
    if (!post.alreadyLoaded) {
      post.showLoader = true;
    }

    // toggle the video playing
    if (video.paused) {
      // show the loader gif
      video.play();

      // once the video starts playing, remove the loader gif
      video.addEventListener('playing', e => {
        post.showLoader = false;
        post.alreadLoaded = true;
      });

    } else {
      video.pause();
    }
  }

  showComments(post): void {
    let browser = this.iab.create('http://reddit.com' + post.data.permalink, '_system');
  }

  loadMore(): void {
    this.redditService.nextPage();
  }

  openSettings(): void {
    let settingsModal = this.modalCtrl.create(SettingsPage, {
      perPage: this.redditService.perPage,
      sort: this.redditService.sort,
      subreddit: this.redditService.subreddit
    });

    settingsModal.onDidDismiss(settings => {
      if (settings) {
        this.redditService.perPage = settings.perPage;
        this.redditService.sort = settings.sort;
        this.redditService.subreddit = settings.subreddit;

        // this.dataService.save(settings);
        this.changeSubreddit();
      }
    });

    settingsModal.present();
  }
}
