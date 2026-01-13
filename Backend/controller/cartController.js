import User from "../model/UserModel.js";


export const addToCart =async (req, res) => {
    try {
        const {itemId,size} = req.body;
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).json({message:"User not found"});
        }

        //ensur cart exists
        let cartData = userData.cartData || {};
        if(cartData[itemId]){
           if(cartData[itemId][size]){
            cartData[itemId][size] += 1;
           }else{
            cartData[itemId][size] = 1;
           }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }

        await User.findByIdAndUpdate(req.userId,{cartData});
        return res.status(200).json({message:"Item added to cart successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"add to cart error"});
    }
}

export const updateCart =async(req, res) => {
    try {
        const {itemId,size,quantity} = req.body;
        const userData = await User.findById(req.userId);
        let cartData = userData.cartData;
        cartData[itemId][size] = quantity;
        await User.findByIdAndUpdate(req.userId,{cartData});
        return res.status(200).json({message:"Cart updated successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"update cart error"});
    }
}   

export const getUserCart =async (req, res) => {
    try {
        const userData = await User.findById(req.userId);
        let cartData = userData.cartData;
        return res.status(200).json({cartData});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"get user cart error"});
    }
}