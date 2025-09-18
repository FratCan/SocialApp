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
        const myId=req.user._id;
        const{id:recipientId}=req.params;

        //kullanıcı kendine istek atamaz
        if(myId===recipientId){
            return res.status(400).json({message:"You cannot send a friend request to yourself."})
        }

        //arkadaşlık isteğini alan kullanıcı var mı
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"User not found."})
        }
        //zaten arkadaş mı bu kullanıcıyla
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user."})
        }
        //daha önce istek atılmış mı
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        });
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user."})
        }
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        })
        res.status(201).json({message:"Friend request sent successfully.",friendRequest})
    } catch (error) {
        console.error("Error in sendFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function acceptFriendRequest(req,res){
    try {
        const{id:requestId}=req.params;
        const friendRequest= await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found."})
        }
        //isteği kabul edecek olan kullanıcının yetkisi var mı
        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to accept this friend request."})
        }

        friendRequest.status="accepted";
        await friendRequest.save();

        //her iki kullanıcıyı da birbirinin arkadaş listesine ekle
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        res.status(200).json({message:"Friend request accepted.",friendRequest})
    } catch (error) {
        console.error("Error in acceptFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getFriendRequests(req,res){
    try {
        const inComingRequest=await FriendRequest.find({
            recipient:req.user._id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequest = await FriendRequest.find({
            sender:req.user._id,
            status:"accepted"
        }).populate("recipient","fullname profilePic");
        res.status(200).json({inComingRequest,acceptedRequest})
    } catch (error) {
        console.error("Error in getFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getOutgoingFriendRequests(req,res){
    try {
        const outgoingRequests = await FriendRequest.find({
            sender:req.user._id,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests)
    } catch (error) {
        console.error("Error in getoutgoingRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}