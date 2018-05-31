import firebase from 'react-native-firebase';

export function registerNotifications() {
	// Called when we first get the notification. Called only when in the app.
	firebase.notifications().onNotification(notification => {
		console.log("Initially got a notification")
		firebase.notifications().displayNotification(notification);
	})

	// Anytime the user clicks on the notification this will execute. Whether in app or the app not
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