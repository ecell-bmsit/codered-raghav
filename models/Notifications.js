import User from './User';
// const BASE_URL = 'http://192.168.1.3:5000'
const BASE_URL = 'https://admin.chem-square.com'
// const BASE_URL = 'http://192.168.1.9:5000'
// 
// const BASE_URL = 'https://deloai.com'
// const BASE_URL = 'http://192.168.123.42:5000'
// const BASE_URL = 'http://10.110.5.42:5000'
// const BASE_URL = 'http://192.168.1.3:5000'
// const BASE_URL = 'http://10.100.31.253:5000'


class NotificationModel {
    constructor(id, userId, content, createdAt, isRead,title) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.title=title;
    }

    static async getAllNotificationsByUserId(userId) {
        try {
            const response = await fetch(`${BASE_URL}/notifications/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            
            if (data.success) {
                return data.notifications.map(notification => new NotificationModel(
                    notification.id, 
                    notification.user, 
                    notification.content, 
                    notification.created_at, 
                    notification.is_read,
                    notification.title
                ));
            }
            else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}

export default NotificationModel;
