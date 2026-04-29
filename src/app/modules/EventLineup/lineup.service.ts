import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Event } from "../Events/event.model";
import { lineupSearchAble } from "./lineup.constant";
import { IEventLineup } from "./lineup.interface";
import { EventLineUp } from "./lineup.model";
import httpStatus from 'http-status-codes'


// create lineup
const lineupCreate = async (payload: any) => {

    const { eventId, lineups } = payload

    const ckEvent = await Event.findById(eventId)
    if (!ckEvent) {
        throw new AppError(httpStatus.NOT_FOUND, 'Event not found')
    }


    const data = await Promise.all(
        lineups.map(async (item: { name: string }) => {

            const ckLineup = await EventLineUp.findOne({ eventId, name: item.name });
            if (ckLineup) {
                throw new AppError(httpStatus.BAD_REQUEST, `Lineup "${item.name}" already created`);
            }

            // return object to insert
            return {
                name: item.name,
                eventId
            };
        })
    );



    await Event.updateOne(
        { _id: eventId },
        {
            $inc: { lineupMember: data?.length || 0 }
        }
    );

    // bulk insert
    const created = await EventLineUp.insertMany(data);


    return created
}


// get lineup
const getLineup = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(EventLineUp.find(), query)
        .filter()
        .search(lineupSearchAble)
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);


    return {
        data,
        meta
    }


}



// update line data
const updateLineup = async (userId: string, payload: Partial<IEventLineup>) => {

    const { ...updatedFields } = payload

    const lineup = await EventLineUp.findById(userId)
    if (!lineup) {
        throw new AppError(httpStatus.NOT_FOUND, "Lineup Not found!!")
    }

    const updatedData = await EventLineUp.findOneAndUpdate(
        { _id: userId },
        { $set: updatedFields },
        { returnDocument: "after", runValidators: true }
    )
    return updatedData

}


const deleteLineup = async (lineupId: string) => {

    const cklineup = await EventLineUp.findById(lineupId);

    if (!cklineup) {
        throw new AppError(httpStatus.NOT_FOUND, "Line up not found!");
    }

    // delete lineup
    await EventLineUp.deleteOne({ _id: lineupId });

    //  event থেকে count কমাও
    await Event.updateOne(
        { _id: cklineup.eventId }, 
        {
            $inc: { lineupMember: -1 }
        }
    );

    return true;
};



// count all event no start koita , startkoita 






export const lineupService = {
    lineupCreate,
    getLineup,
    updateLineup,
    deleteLineup
}