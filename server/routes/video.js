const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/"); // uploads폴더에 파일 저장
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);   // 저장 파일명
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {   // mp4 아닌 파일 filter
            return callback(res.status(400).end('only mp4 is allowed!'), false);
        }
        callback(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    });
});

router.post('/thumbnails', (req, res) => {
    // 비디오 정보(러닝타임 등) 가져오기
    var filePath = "";
    var fileDuration = "";

    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)    // req.body.url : client 비디오 저장 경로
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    }).on('end', function() {   // end : 썸네일 생성 후 할 일
        console.log('Screenshots taken');

        return res.json({
            success: true,
            url: filePath,
            fileDuration: fileDuration
        });
    }).on('error', function(err) {
        console.error(err);

        return res.json({ success: false, err });
    }).screenshots({
        count: 3,   // 3개의 썸네일
        folder: 'uploads/thumbnails',   // 썸네일 저장 폴더
        size: '320x240',    // 썸네일 사이즈
        filename: 'thumbnails-%b.png'   // %b : 원래 파일 이름
    });
});

router.post('/uploadVideos', (req, res) => {
    // 비디오 정보들을 DB에 저장
    const video = new Video(req.body);  // req.body : client에서 보낸 모든 정보들
    video.save((err, doc) => {  // save: mongoDB method
        if (err) return res.json({ success: false, err });

        res.status(200).json({ success: true });
    })
});

router.get('/getVideos', (req, res) => {
    // 비디오 정보들을 DB에서 가져와서 client에 보냄
    Video.find()    // Video collection안의 모든 Video들을 가져옴
        .populate('writer') // populate : 하나의 다큐먼트가 다른 다큐먼트의 ObjectId를 쓰는 경우, ObjectId를 실제 객체로 치환하는 작업을 해줌
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);

            res.status(200).json({ success: true, videos });
        });
});

router.post("/getVideoDetails", (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate('writer')
        .exec((err, videoDetails) => {
            if (err) return res.status(400).send(err);

            res.status(200).json({ success: true, videoDetails });
        });
});

router.post('/getSubscriptionVideos', (req, res) => {
    // 자신의 ID로 구독자 찾기
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = [];
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })
            
            // 찾은 구독자들이 업로드한 비디오 가져오기
            Video.find({ writer: { $in: subscribedUser }})  // 여러명의 Use가 들어있어도 각각의 id로 find 가능
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);

                    res.status(200).json({ success: true, videos });
                });
        });
});

module.exports = router;
