import { Types } from "mongoose";
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Post } from "../Post/post.model";

import httpStatus from 'http-status-codes'
import { Icomment } from "./comments.interface";
import { Comment } from "./comment.model";


// Helper function: nested comment
const buildNestedComments = (comments: any[]) => {
    const map = new Map();

    // প্রথমে সব কমেন্টকে map-এ রাখি
    comments.forEach(comment => map.set(comment._id.toString(), { ...comment.toObject(), replies: [] }));

    const nested: any[] = [];

    comments.forEach(comment => {
        if (comment.parentId) {
            const parent = map.get(comment.parentId.toString());
            if (parent) {
                parent.replies.push(map.get(comment._id.toString()));
            }
        } else {
            nested.push(map.get(comment._id.toString()));
        }
    });

    return nested;
}



// create-post
const createComment = async (payload: Partial<Icomment>) => {
    const { postId, parentId } = payload;


    const isExitsPost = await Post.findById(postId);
    if (!isExitsPost) {
        throw new AppError(httpStatus.NOT_FOUND, "This post does not exist");
    }



    if (parentId) {

        const parentComment = await Comment.findOne({
            _id: parentId,
            postId: postId as Types.ObjectId
        });

        if (!parentComment) {
            throw new AppError(httpStatus.BAD_REQUEST, "Parent comment does not exist in this post");
        }
    }


    const commentData = await Comment.create(payload);

    await Post.findOneAndUpdate(
        { _id: postId as Types.ObjectId },
        { $inc: { comment: 1 } },
        { new: true }
    );

    return commentData;
}

// get-Comment
const getComments = async (id: string, query: Record<string, string>) => {

    const postId = id


    const queryBuilder = new QueryBuilder(Comment.find({ postId, isDelete: false }), query)

    const commentData = queryBuilder.filter().search(['comment']).sort().fields().paginate().populate([{
        path: 'userId'
    }])

    const [data, meta] = await Promise.all([
        commentData.build(),
        queryBuilder.getMeta()
    ])

    const nestedComments = buildNestedComments(data)


    return {
        data: nestedComments,
        meta
    }
}



// update comment status
// const updateComments = async (id: string) => {

//     const ckComment = await Comment.findById(id)
//     if (!ckComment) {
//         throw new AppError(httpStatus.NOT_FOUND, "Comment not found!")
//     }

//     const postId = await Post.findById(ckComment.parentId)
//     const childComment = await Comment.find({ parentId: ckComment?.parentId ? ckComment?.parentId : ckComment?._id }).countDocuments()


//     console.log("chiled comment", childComment)

//     const data = await Comment.findOneAndUpdate(
//         { _id: id },
//         { $set: { isDelete: true } },
//         {
//             returnDocument: "after", runValidators: true
//         }
//     )
//     return data

// }

const updateComments = async (id: string) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found!");
    }

    // find children only
    const children = await Comment.countDocuments({
        parentId: comment._id,
        isDelete: false,
    });

    // check if parent or child
    let deleteCount = 1 + children; // default (parent case)

    // if this is child → only 1 count
    if (comment.parentId) {
        deleteCount = 1;
    }

    // mark this comment as deleted
    await Comment.findByIdAndUpdate(comment._id, {
        $set: { isDelete: true },
    });

    // if parent → delete children
    if (!comment.parentId) {
        await Comment.updateMany(
            { parentId: comment._id },
            { $set: { isDelete: true } }
        );
    }

    // update post count (ONLY ONCE)
    await Post.findByIdAndUpdate(comment.postId, {
        $inc: { comment: -deleteCount },
    });



    return { message: "Comment deleted and count updated" };
};



const updateCommentsData = async (id: string, payload: Partial<Icomment>) => {


    const ckComment = await Comment.findById(id)
    const { ...updatedFields } = payload

    if (!ckComment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found!")
    }

    if (updatedFields?.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "you cann't edit isDelete in this api!")
    }

    const data = await Comment.findOneAndUpdate(
        { _id: id },
        { $set: updatedFields },
        {
            returnDocument: "after", runValidators: true
        }
    )
    return data
}


export const commentService = {
    createComment,
    getComments,
    updateComments,
    updateCommentsData
}