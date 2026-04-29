import { model, Schema } from "mongoose";
import { EStatus, EventServiceInterface, EventTags, IEvent } from "./event.interface";


export const EventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        maxlength: [50, "Title cannot exceed 50 characters"],
        minlength: [8, "Title must be at least 8 characters"]
    },

    fee: {
        type: Number,
        required: [true, "Event fee is required"],
        // min: [0, "Fee must be a positive number"]  // positive only
    },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // event creator only admin

    category: { type: Schema.Types.ObjectId, ref: "Cetegory", required: true },

    lat: { type: Number, required: [true, "Latitude is required"] },
    long: { type: Number, required: [true, "Longitude is required"] },
    lineupMember: { type: Number, default: 0 },
    // GeoJSON location for geospatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [long, lat]
            required: true
        }
    },

    start_date_time: { type: Date, required: [true, "Start date is required"] },
    end_date_time: { type: Date, required: [true, "End date is required"] },

    // startTime: { type: Date, required: [true, "Start time is required"] }, 
    // endTime: { type: Date, required: [true, "End time is required"] }, 
    venue: { type: String, required: [true, "venue must be added!"] },

    openDoor: { type: Date, required: [true, "Open door time is required"] },


    status: { type: String, enum: [...Object.values(EStatus)], default: EStatus.NOSTART },

    image: { type: String, default: "" },

    tags: {
        type: [String],             // it's an array of strings
        enum: Object.values(EventTags), // only allow these enum values
        required: true,             // must have at least one tag
        validate: [(val: string[]) => val.length > 0, 'At least one tag is required']
    },
    descripton: {
        type: String,
        default: "",
        maxlength: [1000, "Description cannot exceed 500 characters"]
    },

    attendanceTotal: { type: Number, default: 0 },
    isDelete: { type: Boolean, default: false },

    addRess: { type: String, default: "" }

}, {
    timestamps: true, // createdAt & updatedAt auto add
    versionKey: false
});

// 2dsphere index lagao location er upor
EventSchema.index({ location: '2dsphere' });


// Model
export const Event = model<IEvent>("Event", EventSchema);


// service fee modal 
const ServiceSchema = new Schema<EventServiceInterface>({
    fee: {
        type: Number,
        required: [true, "Fee is required"],
        min: [0, "Minimum value will be 0"],
    },
});


export const Service = model<EventServiceInterface>('Service',ServiceSchema)