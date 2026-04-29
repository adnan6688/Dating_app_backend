import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { interestSearchAble } from "./interest.constant";
import { IInterest } from "./interest.interface";
import { Interest } from "./interest.model";
import httpStatus from 'http-status-codes'



// create
const interestCreate = async (payload: Partial<IInterest>) => {

    const exitsInterest = await Interest.findOne({ name: payload.name as string })

    if (exitsInterest) {
        throw new AppError(httpStatus.BAD_REQUEST, "This interest already created")
    }

    const interest = await Interest.create({ name: payload?.name as string })
    return interest


}



// get all interest
const interests = async (query: Record<string, string>) => {


    const queryBuilder = new QueryBuilder(Interest.find(), query)

    const interestData = queryBuilder
        .search(interestSearchAble)
        .paginate()


    const [data, meta] = await Promise.all([
        interestData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}


// update 
const updateinterests = async (userId: string, payload: Partial<IInterest>) => {

    const interestData = await Interest.findById(userId)

    if (!interestData) {
        throw new AppError(httpStatus.NOT_FOUND, "This interest not found")
    }
    const updateinterest = await Interest.findOneAndUpdate(
        { _id: userId },
        { $set: payload },
        { returnDocument: "after", runValidators: true }
    )

    return updateinterest
}

export const interestService = {
    interestCreate,
    interests, 
    updateinterests
}