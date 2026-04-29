import { Notification } from "../modules/Notifications/notification.model";

export const createNotification = async ({ receiverId, senderId, type, title, body, eventId , postId }: any) => {

    const notificationData: any = { receiverId, senderId, type, title, body,postId };

    // conditionally add
    if (eventId) {
        notificationData.eventId = eventId;
    }

    const notification = await Notification.create(notificationData);

    // dynamic populate
    const populateOptions: any[] = [ ];

    if(senderId){
         populateOptions.push({
            path: "senderId",
            select: "displayName _id image",
        })
    }

    if (receiverId) {
        populateOptions.push({
            path: "receiverId",
            select: "displayName _id image",
        })
    }

    // only populate event if exists
    if (eventId) {
        populateOptions.push({
            path: "eventId",
            select: "title _id image",
        });
    }

    if(postId){
        populateOptions.push({
            path : 'postId',
            select : 'caption _id imageOrVideo'
        })
    }


    const populatedNotification = await notification.populate(populateOptions);



    return populatedNotification;
};