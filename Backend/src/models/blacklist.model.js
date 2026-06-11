import mongoose from "mongoose";
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Toekn is required to be added to blacklist'],
    },
},
    { timestamps: true, })
const tokenBlacklistModel = mongoose.model('blacklistTokens', blacklistTokenSchema);
export default tokenBlacklistModel;