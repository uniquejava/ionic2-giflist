import {Component} from '@angular/core';

import {ModalController, NavController, Platform} from 'ionic-angular';
import {Data} from "../../providers/data";
import {Reddit} from "../../providers/reddit";
import {Keyboard} from "@ionic-native/keyboard";
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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
              public keyboard: Keyboard) {
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
  }


  changeSubreddit() {

  }
}
