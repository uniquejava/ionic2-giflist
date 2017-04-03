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

