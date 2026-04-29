import { Types } from "mongoose";



export  interface ICetegory {

    _id ? : Types.ObjectId;
    name : string;
    isDelete? : boolean

}