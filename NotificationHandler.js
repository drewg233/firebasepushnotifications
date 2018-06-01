import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

export function registerNotifications() {
	if (Platform.OS == "android") {
		checkIfNotificationOpened()
	}

	// Creating the channel for android.
	const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');
	firebase.notifications().android.createChannel(channel);

	// Called when we first get the notification. Called only when in the app.
	firebase.notifications().onNotification(notification => {
		console.log("Initially got a notification")
		if (Platform.OS == "android") {
			displayNotificationFromCustomData(notification);
		} else {
			firebase.notifications().displayNotification(notification);
		}
	})

	// iOS: Anytime the user clicks on the notification this will execute. Whether in app or the app not.
	// Android: Anytime the user clicks on the notification when they are in the app.
	firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
		console.log("User clicked on the notification")
		const notif: Notification = notificationOpen.notification;

		setTimeout(()=>{
			alert(`User tapped notification\n${notif.notificationId}`)
		}, 500)
	});

	firebase.messaging().getToken().then(token => {
		console.log("TOKEN (getFCMToken)", token);
	});

	// Example on how to suscribe to topics
	// firebase.messaging().subscribeToTopic('/appname/hello');
}

export async function checkNotificationPermissions() {
	if (!await firebase.messaging().hasPermission()) {
		try {
		await firebase.messaging().requestPermission();
	} catch(e) {
			alert("Failed to grant permission")
		}
	}
}

// Android Methods *******

// Displaying a local version of the notification with the channel id set
function displayNotificationFromCustomData(message: RemoteMessage) {
	if(message.data && message.data.title){
		let notification = new firebase.notifications.Notification()
		notification = notification
		.setTitle(message.data.title)
		.setBody(message.data.body)
		.setData(message.data)
		.setSound("bell.mp3")
		notification.android.setPriority(firebase.notifications.Android.Priority.High)
		notification.android.setChannelId("test-channel")
		firebase.notifications().displayNotification(notification);
	}
}

// We call this when the app boots. To see if the the user opened from an Android device
// onNotificationOpened works well for iOS
function checkIfNotificationOpened() {
	firebase.notifications().getInitialNotification()
	.then((notificationOpen: NotificationOpen) => {
		if (notificationOpen) {
			// Get information about the notification that was opened
			const notif: Notification = notificationOpen.notification;
			setTimeout(()=>{
				alert(`User tapped notification\n${notif.notificationId}`)
			}, 500)
		}
	});
}