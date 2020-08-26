const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

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


module.exports = router;
