giflist
===

## setup
```bash
x ionic start giflist blank -v --skip-npm
cd giflist
cp -r ../quicklists/node_modules .

ionic g page Settings
ionic g provider Data
ionic g provider Reddit

ionic plugin add cordova-sqlite-storage --save

ionic plugin add cordova-plugin-inappbrowser
npm install @ionic-native/in-app-browser --save

npm install @ionic-native/keyboard --save

```

## app.module.ts
cli会自动加入对StatusBar, SplashScreen的依赖, 我们需要手动添加以下新依赖:
```js
declarations: SettingsPage
imports: IonicStorageModule.forRoot()
entryComponents: SettingsPage
providers: Data, Reddit, InAppBrowser, Keyboard
```

## Content-Security-Policy
```html
<meta http-equiv="Content-Security-Policy"
      content="font-src 'self' data:; img-src * data:; default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inl    ine' *">

```

## WKWebView plugin
ionic plugin add https://github.com/driftyco/cordova-plugin-wkwebview-engine.git --save

Cordova默认会使用UIWebView, 需要在config.xml中加入以下配置:
```xml
  <feature name="CDVWKWebViewEngine">
    <param name="ios-package" value="CDVWKWebViewEngine"/>
  </feature>
  <preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine"/>
```

## Fancy searchbox(Observable)
see home.ts

```html
<ion-title>
  <ion-searchbar color="primary" placeholder="enter subreddit name..." [(ngModel)]="subredditValue" [formControl]="subredditControl"></ion-searchbar>
</ion-title>
```

```js
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
    console.log('TODO: implement changeSubreddit()');
  }
}

```
