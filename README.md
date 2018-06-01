Adding Firebase to React-Native
===============================

### Create react native project
`react-native init APPNAME`

### Add firebase
`npm install --save react-native-firebase`
`react-native link react-native-firebase`

### Follow instructions on firebase console
https://rnfirebase.io/docs/v4.2.x/installation/initial-setup

# iOS Setup

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

# Android Setup

- Edit `android/build.gradle`:
```diff
  dependencies {
    classpath 'com.android.tools.build:gradle:2.0.0'
+   classpath 'com.google.gms:google-services:3.1.1'
```

- Add another maven source `android/build.gradle`:
```diff
	maven {
	    // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
	    url "$rootDir/../node_modules/react-native/android"
	}

+	maven {
+	    url 'https://maven.google.com'
+	}
```



- Edit `android/app/build.gradle`. Add at the bottom of the file:
```diff
apply plugin: "com.android.application"
  ...
+ apply plugin: 'com.google.gms.google-services'
```

- Edit `android/app/build.gradle`. **Notice the change from compile to implementation**
```diff
dependencies {
	implementation(project(':react-native-firebase')) {
	    transitive = false
	}

+	// Firebase dependencies
+	implementation "com.google.firebase:firebase-core:15.0.2"
+	implementation "com.google.firebase:firebase-messaging:15.0.2"
```
- Add services to `android/app/src/main/AndroidManifest.xml`

```diff
	<application
	...

+   <service android:name="io.invertase.firebase.messaging.RNFirebaseBackgroundMessagingService" />
+   <service android:name="io.invertase.firebase.messaging.RNFirebaseMessagingService">
+   	<intent-filter>
+   		<action android:name="com.google.firebase.MESSAGING_EVENT" />
+   	</intent-filter>
+   </service>
+   <service android:name="io.invertase.firebase.messaging.RNFirebaseInstanceIdService">
+   	<intent-filter>
+   		<action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
+   	</intent-filter>
+   </service>

	...
	</application>
```

- Add to `android/app/src/main/java/com/APPNAME/MainApplication.java`

```diff
	import io.invertase.firebase.RNFirebasePackage;
+	import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
+	import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;


	...

	new RNFirebasePackage(),
+	new RNFirebaseMessagingPackage(),
+	new RNFirebaseNotificationsPackage()
```

- Make sure you have similiar format for `android/build.gradle`

```
buildscript {
    repositories {
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.2'
        classpath 'com.google.gms:google-services:3.2.1'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }

        maven {
            url 'https://maven.google.com'
        }
    }
}
```
- Lastly I needed to update my gradle @ `android/gradle/wrapper/gradle-wrapper.properties`
```
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
```

- I also had to create a folder `android/app/src/main/assets/`
- Then I could bundle the app with `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
- And run `react-native run-android`

*Before you run your project make sure you added your `google-services.json` you download from console.firebase.google.com when you add a new Android project. This will get added to the `android/app/` folder.*

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



