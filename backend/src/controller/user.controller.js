import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res){
    try {
        const currentUserId=req.user.id;
        const currentUser= req.user

        const recommendedUsers= await User.find({
            $and:[
                { _id:{$ne:currentUserId}},
                {$id:{$nin:currentUser.friends}},
                {isOnaboarded:true}
            ],
        })
    res.status(200).json(recommendedUsers)
    } catch (error) {
        console.log("Error in getRecommendedUsers controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getMyFriends(req,res){

    try {
        const user = await User.findById(req.user._id).select("friends").populate("friends","fullName profilePic nativeLanguage,learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }

}

export async function sendFriendRequest(req,res){
    try {
        
    } catch (error) {
        
    }
}