import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ICetegory } from "./cetegory.interface";
import { Cetegory } from "./cetegory.model";
import httpStatus from 'http-status-codes'




// create  cetegory
const createCetegory = async (payload: Partial<ICetegory>) => {

    const { name } = payload

    const isExitsCetegory = await Cetegory.findOne({ name: name as string })

    if (isExitsCetegory) {
        throw new AppError(httpStatus.BAD_REQUEST, "This cetegory is already exits")
    }

    const result = await Cetegory.create(payload)

    return result

}


// get cetegory
const getCetegory = async (query: Record<string, string>) => {


    const queryBuilder = new QueryBuilder(Cetegory.find({ isDelete: false }), query)

    const cetegoryData = queryBuilder.search(['name']).filter().paginate()


    const [data, meta] = await Promise.all([
        cetegoryData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }

}


// update cetegory
const updateCetegory = async (id: string, payload: Partial<ICetegory>) => {


    const findCetegory = await Cetegory.findById(id)
    if (!findCetegory) {
        throw new AppError(httpStatus.NOT_FOUND, "This cetegory not found!")
    }
    const { ...updateFields } = payload

    const updateCetegoryRsult = await Cetegory.findOneAndUpdate(
        { _id: id },
        { $set: updateFields },
        {
            returnDocument: "after", runValidators: true
        }
    )

    return updateCetegoryRsult

}


// get cetegory for admin 
const getCetegoryAdmin = async () => {

    const data = await Cetegory.find({ isDelete: false })
    return data || []
}



export const CetegoryService = {
    createCetegory,
    getCetegory,
    updateCetegory,
    getCetegoryAdmin
}