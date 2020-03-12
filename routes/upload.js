// 1. multer 미들웨어 등록
const express = require('express');
const router = express.Router();
const multer = require("multer");

let upload = multer({
    dest: "upload/"
});

router.get('/', function(req, res, next) {
    res.redirect('/board/read')
});
// 2. 파일 업로드 처리
router.post('/write', upload.single("photo"), function(req, res, next) {
    // 3. 파일 객체
    let file = req.file
    // 4. 파일 정보
    console.log(file);
    let result = {
        originalName : file.originalname,
        size : file.size,
    }
    console.log(result);
    res.json(result);
});

module.exports = router;


