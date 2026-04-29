import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Block } from '../Block/block.model';
import { Like } from '../Like/like.model';
import { reportType } from '../report/report.interface';
import Report from '../report/report.model';
import { postInterface } from "./post.interface";
import { Post } from "./post.model";









const postCreate = async (payload: Partial<postInterface>) => {


    const data = await Post.create(payload)

    return data
}


// get all post for user
const getPosts = async (query: Record<string, string>, currentUserId: string) => {


    // get reported posts by this user
    const reportedPosts = await Report.find({
        reporter: currentUserId,
        type: reportType.POST
    }).lean();


    // repoted postid array
    const reportedPostIds = reportedPosts
        .filter(r => r.postId)
        .map(r => r.postId!.toString());


    // block user 
    const blockedUsers = await Block.find({
        blockerUserId: currentUserId
    }).lean();
   

    // blocked id gula jare jare ami block korsi
    const blockedUserIds = blockedUsers
        .map(b => b.blockedUserId?.toString())
        .filter(Boolean);



    // exclude reported posts and ami jare jare block korsi oder post bade
    const queryBuilder = new QueryBuilder(
        Post.find({
            isDelete: false,
            _id: { $nin: reportedPostIds },
            userId: { $nin: blockedUserIds } 
        }),
        query
    );




    const postData = queryBuilder
        .filter()
        .search(['caption', 'description'])
        .sort()
        .fields()
        .paginate()
        .populate([{ path: "userId", select: 'image displayName' }]);

    const [data, meta] = await Promise.all([
        postData.build(),
        queryBuilder.getMeta()
    ]);

    // likes
    const postIds = data.map(post => post._id);

    const liked = await Like.find({
        postId: { $in: postIds },
        userId: currentUserId
    }).lean();

    const likedSet = new Set(liked.map(l => l.postId.toString()));

    const postsWithLikedFlag = data.map(post => ({
        ...post.toObject(),
        likedByMe: likedSet.has(post._id.toString()),
    }));



    return {
        data: postsWithLikedFlag,
        meta
    };
};


// get my post
const getMyPost = async (user: JwtPayload, query: Record<string, string>) => {

    const querybuilder = new QueryBuilder(Post.find({ userId: user?.id, isDelete: false }), query)

    const postdata = querybuilder.filter().sort().fields().paginate().populate([{ path: "userId", select: 'image displayName' }])
    const [data, meta] = await Promise.all([
        postdata.build(),
        querybuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}


// update post
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePost = async (postId: string, payload: Partial<postInterface>, userId: string) => {


    const isExitsPost = await Post.findById(postId)

    if (!isExitsPost) {
        throw new AppError(httpStatus.NOT_FOUND, "This post not found!")
    }

    if (payload?.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "userId can not update")
    }

    // const userIdPost = isExitsPost?.userId as Types.ObjectId


    // if (userIdPost.toString() !== userId) {
    //     throw new AppError(403, "You are not allowed to delete this post");
    // }


    const update = await Post.findOneAndUpdate(
        { _id: postId },
        { $set: payload },
        { returnDocument: "after", runValidators: true }
    )


    return update

}









export const postService = {
    postCreate,
    getPosts,
    updatePost,
    getMyPost
}