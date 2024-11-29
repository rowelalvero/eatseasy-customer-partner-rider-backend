import * as firebase  from 'firebase-admin';
    const  serviceAccount = require("../../serviceAccountKey.json")

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: 'https://xxxxxx.firebaseio.com'
    });

async function sendPushNotification(deviceToken, messageBody) {
    const message = {
        notification: {
            title: 'Your Notification Title',
            body: messageBody
        },
        token: deviceToken
    };

    try {
        const response = await firebase.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}


module.exports = {fireBaseConnection, sendPushNotification};