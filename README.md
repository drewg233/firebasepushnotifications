Adding Firebase to React-Native
===============================

### Create react native project
`react-native init APPNAME`

### Add firebase
`npm install --save react-native-firebase`
`react-native link react-native-firebase`

### Follow instructions on firebase console
https://rnfirebase.io/docs/v4.2.x/installation/initial-setup

## iOS Setup

### Add Cocoapods
`cd ios && pod init` then remove the unwanted targets from the Podfile. (TV targets)

### Add the following pods
`pod 'Firebase/Core', '~> 4.13.0'` <br />
`pod 'Firebase/Messaging'`

### Run Pod Install
`pod install`

### Turn on push notification capabilities
Open ios/APPNAME.xcworkspace in Xcode then go to your project. Rename the Bundle ID and choose your team for both your test target and normal target. Now select your target. Choose `Capabilities` and turn on `Push Notifications` and `Background Modes` with `Remote notifications` checked.

### Get your GoogleService-Info.plist
Go to your project within console.firebase.google.com. And add iOS App. Here you will enter your bundleid from your app and it will give you a GoogleService-Info.plist. Download this. Then drag and drop it into your project above your Info.plist with `Copy Items If Needed` Checked, `Create Groups`, `YOURTAGET` checked. Make sure the file name is GoogleService-Info.plist and not GoogleService-Info (1).plist.

### Add your APNS Auth Key
Still within console.firebase.google.com we need to add our auth key. You can do this under `Settings > Cloud Messaging`. You will need to go to developer.apple.com and create a "Key" with "Apple Push Notifications service (APNs)" checked. Upload your newly created key to the firebase console.

### iOS Code
There are a few things you need to add to the iOS code to get push notifications to work.

In AppDelegate.m before `@implementation AppDelegate` <br />
`#import <Firebase.h>` <br />
`#import "RNFirebaseNotifications.h"`

add the following to the first part of `didFinishLaunchingWithOptions` <br />
`[FIRApp configure];`

lastly add the following before `@end`
```
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
```

## Add React Native Code
I created a file that handles notifications called `NofiticationHelper.js`. Copy this file to your project. And add the following lines to your app. <br /><br />
At the top import: <br />
`import { registerNotifications, checkNotificationPermissions } from "./NotificationHandler";`

Within your class: <br />

```
   componentWillMount() {
   	checkNotificationPermissions();
	registerNotifications();
  }
```



