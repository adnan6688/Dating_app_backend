import httpStatus from 'http-status-codes'
import AppError from "../../errorHerlpers/AppError"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { User } from "../User/user.model"
import { Block } from "./block.model"






const blockingUser = async (blockedUser: string, myId: string) => {


    const ckUserIsexits = await User.findById(blockedUser)

    if (!ckUserIsexits) {
        throw new AppError(httpStatus.NOT_FOUND, "This is user not found!")
    }

    const ckIsBlock = await Block.findOne({ blockedUserId: blockedUser, blockerUserId: myId })
    if (ckIsBlock) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user already blocked!")
    }



    const block = await Block.create({ blockedUserId: blockedUser, blockerUserId: myId })
    return block
}


const myBlockList = async (myId: string, query: Record<string, string>) => {



    const querybuilder = new QueryBuilder(Block.find({ blockerUserId: myId }), query)

    const postdata = querybuilder.filter().sort().fields().paginate().populate([{ path: "blockerUserId", select: 'image displayName' }, { path: 'blockedUserId', select: 'image displayName' }])
    const [data, meta] = await Promise.all([
        postdata.build(),
        querybuilder.getMeta()
    ])

    return {
        data,
        meta
    }


}


const unblockUser = async (myid: string, unblockUser: string) => {


    if (myid === unblockUser) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You cannot unblock yourself!"
        );
    }
    const ckUseIsExits = await User.findById(unblockUser)
    if (!ckUseIsExits) {
        throw new AppError(httpStatus.NOT_FOUND, "This user not found!")
    }

    //check if already blocked
    const isBlocked = await Block.findOne({
        blockerUserId: myid,
        blockedUserId: unblockUser
    });

    if (!isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not in your block list!");
    }


    const result = await Block.deleteOne({ blockerUserId: myid, blockedUserId: unblockUser })

    return result
}




export const blockService = {
    blockingUser,
    myBlockList,
    unblockUser
}