const PostModel = require('../models/PostModel');
const CommentModel = require('../models/CommentModel');
const ReplyModel = require('../models/ReplyModel');




exports.BlogPosts = async(req, res) => {
    try {
        let posts = await PostModel.find({});

        res.render('user_index', {
            title: 'Posts',
            posts,
            MainView: 'user/blogs'
        })
    } catch (error) {

    }
}

exports.BlogDetail = async(req, res) => {
    try {
        let _id = req.params.id;
        let post = await PostModel.findOne({ _id });
        // console.log(post);
        res.render('user_index', {
            post: post,
            title: 'Blog Detail',
            MainView: 'user/blog_detail'
        })
    } catch (error) {

    }
}


exports.AddComment = async(req, res) => {
    try {
        let user = req.session.user;
        if (user) {
            // Create and save the comment
            const comment = new CommentModel({
                comment: req.body.comment,
                user: user._id,
                post: req.body.post_id
            });
            await comment.save();

            // Fetch all comments for the post along with user data
            const users_comments = await CommentModel.find({ post: req.body.post_id })
                .populate('user') // Populates the user field with user details
                .exec();
            // console.log(users_comments);
            res.status(200).send({
                success: true,
                message: 'Comment Added Successfully!',
                comments: users_comments
            });
        } else {
            res.status(401).send({ success: false, message: 'User not logged in. Redirecting to login.' });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error adding comment.' });
    }
};


exports.Comments = async(req, res) => {
    try {
        const postId = req.body.post_id;
        const user = req.session.user ? req.session.user._id : null;

        // Fetch comments for the post and populate user details and replies for each comment
        const comments = await CommentModel.find({ post: postId })
            .populate('user', 'username image') // Populate user details for each comment
            .populate({
                path: 'replies',
                populate: {
                    path: 'user',
                    select: 'username image'
                }
            })
            .exec();

        // Send the response with comments, replies, and current user ID
        res.status(200).send({
            success: true,
            comments: comments,
            currentUserId: user
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching comments.'
        });
    }
};



exports.SubmitReplay = async(req, res) => {
    try {
        const { reply, commentId, userId } = req.body;
        console.log(req.body);
        if (userId != '') {
            const newReply = new ReplyModel({
                reply,
                user: userId,
                comment: commentId
            });

            // Save the reply
            await newReply.save();

            // Find the comment and add the reply to its replies array
            await CommentModel.findByIdAndUpdate(commentId, { $push: { replies: newReply._id } });

            // Fetch the updated comment with populated replies
            const updatedComment = await CommentModel.findById(commentId)
                .populate('user', 'username image')
                .populate({
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'username image'
                    }
                });
            // console.log(updatedComment);
            // Send the updated comment with all replies in the response
            res.status(200).json({
                message: 'Reply Submitted Successfully',
                comment: updatedComment // Send the updated comment with replies
            });
        } else {
            res.status(401).send({ success: false, message: 'User not logged in. Redirecting to login.' });
        }
        // Create a new reply

    } catch (err) {
        console.error('Failed to submit reply:', err.message);
        res.status(500).json({
            message: 'Failed to submit reply',
            error: err.message
        });
    }
};