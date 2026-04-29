import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errorHerlpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { StatusConnect } from '../ConnectionRequest/connection.interface';
import { ConnectionReq } from '../ConnectionRequest/connection.model';
import { envVars } from './../../config/env';
import { userSearchableFields } from './user.constants';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

import { ObjectId } from 'mongodb';
import { Block } from '../Block/block.model';



// create user service
const usercreate = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload

    const isUserExits = await User.findOne({ email: email as string })

    if (isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "user Already Exits")
    }

    const hashpassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))


    const authsProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }



    // await sendEmail(email as string)


    const user = await User.create({
        email: email as string,
        auths: [authsProvider],
        password: hashpassword,
        ...rest
    })


    return user

}

// update user
const updateUser = async (userId: string, payload: Partial<IUser>): Promise<IUser | null> => {

    // Spread payload
    const { ...updatedFields } = payload;



    // Convert to ObjectId
    const idd = new Types.ObjectId(userId);


    // Find user first
    const findUser = await User.findOne({ _id: idd });

    // ck user
    if (!findUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }


    // ck interest
    if ((findUser?.interests?.length ?? 0) > 6) {
        throw new AppError(httpStatus.BAD_REQUEST, "Maximum interest 6");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...fieldsWithoutPassword } = updatedFields;

    const updatedUser = await User.findOneAndUpdate(
        { _id: idd },
        { $set: fieldsWithoutPassword },
        { returnDocument: "after", runValidators: true }
    );


    return updatedUser;
};


// get all users with out admin
const getAllUsers = async (userId: string, query: Record<string, string>) => {

    // get blocked users
    const blockedUsers = await Block.find({
        blockerUserId: userId
    }).select("blockedUserId");

    const blockedIds = blockedUsers.map(
        (b) => b.blockedUserId
    );

    const querybuilder = new QueryBuilder(
        User.find({
            _id: {
                $ne: userId,
                $nin: blockedIds   
            }
        }),
        query
    );

    const userdata = querybuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate([{ path: "interests" }]);

    const [data, meta] = await Promise.all([
        userdata.build(),
        querybuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

// get me 
const getMe = async (userId: string) => {


    const user = await User.findById(userId).select('-password').populate({
        path: "interests"
    });

    const connected = await ConnectionReq.find({
        status: StatusConnect.ACCEPTED,
        $or: [
            { sendReq: userId },
            { recivedReq: userId }
        ]
    }).countDocuments();

    const requestSend = await ConnectionReq.find({
        status: StatusConnect.PENDING,
        sendReq: userId
    }).countDocuments();


    return {
        data: user,
        connected,
        requestSend
    }

}


// get singleUser
const singleUser = async (userId: string, myId: string) => {

    const user = await User.findById(userId).select('-password').populate({ path: 'interests' })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }



    const myObjectId = new ObjectId(myId); // convert string to ObjectId



    const isFriend =
        await ConnectionReq.findOne({
            $or: [
                { sendReq: myObjectId, recivedReq: user?._id },
                { sendReq: user?._id, recivedReq: myObjectId }
            ]
        })




    const result = { isFriend: isFriend?.status == StatusConnect.ACCEPTED ? true : false, ...user.toObject() }

    return result

}





export const userService = {
    usercreate,
    updateUser,
    getAllUsers,
    getMe,
    singleUser
}