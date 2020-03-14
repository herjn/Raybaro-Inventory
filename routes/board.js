var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const multer = require("multer");
const path = require("path");


var connection = mysql.createConnection({
    host: 'localhost', // DB가 위치한 IP주소
    port: 3306,          // DB와 연결할 포트번호
    user: 'root',        // 계정이름
    password: '',    // 계정 비밀번호
    database: 'RAYBARO'    // 데이터베이스 이름g
});

/* GET List Page. */
router.get('/list',function (req,res,next){
    res.redirect('/board/page/1')// /board로 접속요청이 들어왔을 때 1페이지로 자동으로 이동하도록 리다이렉트 해줍니다.
})

router.get('/list/:page',function(req, res, next) {
    var page = req.params.page;
    var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,DATE_FORMAT(repairdate,"%Y년%m월%d일") as repairdate,DATE_FORMAT(requestdate,"%Y년%m월%d일")as requestdate from report',function(err,rows){
        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
        console.log('rows :' +  rows);
        // console.log(ffff);
        res.render('list', { title:'Board List',rows: rows }); // view 디렉토리에 있는 list 파일로 이동합니다.
    });
});

router.get('/read/:idx',function (req,res,next) {
    /* GET 방식의 연결이므로 read 페이지 조회에 필요한 idx 값이 url 주소에 포함되어 전송됩니다.
    * url에서 gbidx 값을 가져오기 위해 request 객체의 params 객체를 통해 idx값을 가지고 옵니다.*/
    var idx = req.params.idx;
    console.log("idx : "+idx);
    var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate,image from report where idx=?',[idx],function(err,rows){
        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
     // 이 idx값을 참조하여 DB에서 해당하는 정보를 가지고 옵니다.
        console.log('rows :' +  rows);
        // console.log(ffff);
        res.render('read', { title:'Board List',rows: rows });
    });
    /*
    * Node는 JSP에서 JDBC의 sql문 PreparedStatement 처리에서와 같이 sql문을 작성할 때
    * ? 를 활용한 편리한 쿼리문 작성을 지원합니다.
    * Node에서 참조해야할 인자값이 있을 때 ? 로 처리하고
    * []를 통해 리스트 객체를 만든 후 ? 의 순서대로 입력해주시면 자동으로 쿼리문에 삽입됩니다.
    * 아래에는 ?에 idx값이 자동으로 매핑되어 쿼리문을 실행합니다.
    * */
    /**/
});

//
// router.get('/page',function (req,res,next) {
//     res.redirect('/board/page/1');
// })

router.get('/page/:page',function(req,res,next)
{
    var page = req.params.page;
    var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate from report',function(err,rows){
        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
        console.log('rows :' +  rows);
        // console.log(ffff);
        res.render('page', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true});
        console.log(rows.length-1);
    });
});


router.get('/write',function (req,res,next) {
    res.render('write',{title:'RAYBARO'})
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        cb(null, Date.now() + extension);
    }
});

var upload = multer({
    dest: "upload",
    storage: storage
});


router.post('/write', upload.single("photo"), function(req, res) {
    /*
    *POST 방식의 요청을 URL에 데이터가 포함되지 않고 BODY에 포함되어 전송됩니다.
    * 때문에 request 객체를 통해 body에 접근 후 데이터를 가지고 옵니다.
     *  */
    var body = req.body;

    var writer = req.body.writer;
    var title = req.body.title;
    var administer = req.body.administer;

    var sn1=req.body.sn1;
    var sn2=req.body.sn2;
    var sn3 =req.body.sn3;
    var tag = req.body.tag;
    var adcompany1 = req.body.adcompany1;
    var customer = req.body.customer;
    var requestdate=req.body.requestdate;
    var repairdate=req.body.repairdate;

    var file = req.file;
    var imagepath;
    if(file == undefined) imagepath = "upload/original.png";
    else imagepath = file.path
    connection.beginTransaction(function(err) {
        if(err) console.log(err);
        connection.query('insert into report(title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate,image) values(?,?,?,?,?,?,?,?,?,?,?,?)'
            ,[title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate,imagepath]
            ,function (err) {
                if(err) {
                    /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                    console.log(err);
                    connection.rollback(function () {
                        console.error('rollback error1');
                    })
                }
                connection.query('SELECT LAST_INSERT_ID() as idx',function (err,rows) {
                    if(err) {
                        /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                        console.log(err);
                        connection.rollback(function () {
                            console.error('rollback error1');
                        })
                    }
                    else
                    {
                        connection.commit(function (err) {
                            if(err) console.log(err);
                            console.log("row : " + rows);
                            var idx = rows[0].idx;
                            res.redirect('/board/read/'+idx);
                        })
                    }
                })
            })
    })
});

router.get('/update/:idx',function(req,res,next) {
    var idx = req.params.idx;
    var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate from report where idx=? ',[idx] ,function(err,rows){
        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
        console.log('rows :' +  rows);
        // console.log(ffff);
        res.render('update', { title:'Board List',rows: rows });
    });

});

router.post('/update/:idx', upload.single("photo"), function(req, res) {
    var idx = req.params.idx;
    var body = req.body;
    var writer = req.body.writer;
    var title = req.body.title;
    var administer = req.body.administer;
    var sn1 = req.body.sn1;
    var sn2 = req.body.sn2;
    var sn3 = req.body.sn3;
    var tag = req.body.tag;
    var adcompany1 = req.body.adcompany1;
    var customer = req.body.customer;
    var requestdate=req.body.requestdate;
    var repairdate=req.body.repairdate;

    var file = req.file;

    var imagepath;
    if(file == undefined) imagepath = "upload/original.png";
    else imagepath = file.path

    console.log(imagepath)

    console.log(administer,sn1,sn2,sn3,tag,adcompany1,customer);
    var query = connection.query('update report set title=?,writer=?,administer=?,sn1=?,sn2=?,sn3=?,tag=?,adcompany1=?,customer=?,image=?,requestdate=?,repairdate=? where idx=?', [title,writer,administer,sn1,sn2,sn3,tag,adcompany1,customer,imagepath,requestdate,repairdate,idx], function (err, rows) {
        res.redirect('/board/read/' + idx);
    });
});


router.get('/delete/:idx',function(req, res,next){
    var idx = req.params.idx;
    console.log(idx +'!!');
    var query = connection.query('delete from report where idx=?',[idx],function(err,rows){
        res.redirect('/board/list'); // view 디렉토리에 있는 list 파일로 이동합니다.
    });
});



router.post('/search', function(req, res) {
    var body = req.body;
    var search = body.search;
    var search_query = body.search_query;
    console.log(search)
res.redirect('/board/search/' + search_query + '/' + search + '/1');
});

router.get('/search/:search_query/:search/:page', function(req, res) {
    var search_query = req.params.search_query;
    var search = req.params.search;
    var page = req.params.page;
    console.log(search);
    if(search_query == 1){
        var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate from report where title=?', [search], function(err,rows){
            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
            console.log('rows :' +  rows);
            // console.log(ffff);
            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"제품명"});
            console.log(rows.length-1);
        });
    }
    if(search_query == 2){
        var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate from report where writer=?', [search], function(err,rows){
            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
            console.log('rows :' +  rows);
            // console.log(ffff);
            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"관리 요원"});
            console.log(rows.length-1);
        });
    }
    if(search_query == 3){
        // 구현하시오~~~~~~~~~~~~~~~~~~~~~~
        var query = connection.query('select idx,title,writer,administer,adcompany1,sn1,sn2,sn3,customer,tag,requestdate,repairdate from report where writer=?', [search], function(err,rows){
            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
            console.log('rows :' +  rows);
            // console.log(ffff);
            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"날짜(미구현)"});
            console.log(rows.length-1);
        });
    }

});

router.post('/download', function(req, res) {
    res.redirect('/board/page/1');
});

module.exports = router;
