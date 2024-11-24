const admin = require('firebase-admin');

async function sendPushNotification(deviceToken, messageBody, data, title) {
    const message = {
        notification: {
            title: title,
            body: messageBody
        },
        token: deviceToken
    };

    // Add the data field only if it is not null or undefined
    if (data) {
        message.data = data;
    }

    try {
        await admin.messaging().send(message);
        console.log('Push notification sent successfully');
    } catch (error) {
        console.log('Error sending push notification:', error.message);
    }
}

module.exports = sendPushNotification;
