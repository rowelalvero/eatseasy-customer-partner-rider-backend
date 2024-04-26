const admin = require('firebase-admin');


 async function sendPushNotificationToTopic(topic, messageBody, data, title) {
    const message = {
        notification: { title: title, body: messageBody },
        data: data,
    };

    try {
        await admin.messaging().sendToTopic(topic, message);
        console.log('Push notification sent to topic:', topic);
    } catch (error) {
        console.log('Error sending push notification:', error);
    }
}

exports = sendPushNotificationToTopic