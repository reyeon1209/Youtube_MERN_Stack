const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require("moment");

const videoSchema = mongoose.Schema({   // Video Collection
    wirter: {
        type: Schema.Types.ObjectId,    // Id만 넣으면
        ref: 'User' // User 모델로 가서 모든 정보 긁어옴
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number    // 0: privacy, 1: public
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0  // 0부터 시작
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true })    // 생성 date, 업데이트 date 표시

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }