import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, Status } from "./user.interface";




const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    displayName: { type: String, required: true, trim: true },
    fullName : {type : String ,trim : true},
    email: { type: String, required: true, unique: true },
    password: { type: String, trim: true },
    image: { type: String, default: "" },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    age: { type: Number, default: null },
    bio: { type: String, default: "", trim: true },

    availableForDate: { type: Boolean, default: false },
    availableForDance: { type: Boolean, default: false },
    availableForFriend: { type: Boolean, default: false },

    newMatchesNotification: { type: Boolean, default: true },
    messageAlertsNotification: { type: Boolean, default: true },
    eventRemindersNotification: { type: Boolean, default: true },

    isVerified: { type: Boolean, default: false },

    lat: { type: Number, default: null },
    long: { type: Number, default: null },

    userLocation : {type : String , default : null},
    

    status: { type: String, default: Status.ACTIVE },

    interests: [{
        type: Schema.Types.ObjectId,
        ref: "Interest",
        default: []
    }
    ],

    fcmToken : {type : String , default : null},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [long, lat]
            default: [0, 0]
        }
    },
    auths: [authProviderSchema]
}, {
    timestamps: true,
    versionKey: false
})






userSchema.index({ location: '2dsphere' });
export const User = model<IUser>("User", userSchema)


