import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the Settings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  perPage: number;
  sort: string;
  subreddit: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.perPage = navParams.get('perPage');
    this.sort = navParams.get('sort');
    this.subreddit = navParams.get('subreddit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save(): void {
    let settings = {
      perPage: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    };
    this.view.dismiss(settings);
  }

  close(): void {
    this.view.dismiss();
  }

}
