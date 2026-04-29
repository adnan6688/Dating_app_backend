import { QueryBuilder } from "../../utils/QueryBuilder"
import { Notification } from "./notification.model"











const allNotification = async ( myid: string, query: Record<string, string>) => {



    const querybuilder = new QueryBuilder(Notification.find({ receiverId: myid }), query)
    
    const noti_Data = querybuilder
        .filter()
        .sort()
        .fields()
        .paginate()
        .populate([{ path: "receiverId", select: 'displayName _id image' }, { path: 'senderId', select: 'displayName _id image' }])


    // jdi multiple populate korte hoi  tah hole populate([ {path : "interests"}, {path : "interests"} ])

    const [data, meta] = await Promise.all([
        noti_Data.build(),
        querybuilder.getMeta()
    ])


    return {
        data,
        meta
    }
}


export const NotificationSerivce = {
    allNotification
}