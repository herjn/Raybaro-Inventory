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
    database: 'raybaro'    // 데이터베이스 이름
});


/* GET List Page. */
router.get('/list',function (req,res,next){
    res.redirect('/board/page/1')// /board로 접속요청이 들어왔을 때 1페이지로 자동으로 이동하도록 리다이렉트 해줍니다.
})

router.get('/list/:page',function(req, res, next) {
    var page = req.params.page;
    var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,price,enduser,memo,place from report',function(err,rows){
        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
        res.render('list', { title:'Board List',rows: rows }); // view 디렉토리에 있는 list 파일로 이동합니다.
    });
});

let null_to_string = function(rows){
    for(var i=0;i<rows.length;i++){
        if(rows[i].startday == null) rows[i].startday= "-";
        if(rows[i].endday == null) rows[i].endday = "-";
    }
}


router.get('/read/:idx',function (req,res,next) {
    /* GET 방식의 연결이므로 read 페이지 조회에 필요한 idx 값이 url 주소에 포함되어 전송됩니다.
    * url에서 gbidx 값을 가져오기 위해 request 객체의 params 객체를 통해 idx값을 가지고 옵니다.*/
    var idx = req.params.idx;
    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret1) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret1.length; i++){
            recompany_array[ret1[i].idx] = ret1[i].name;
            console.log("!!!!!!!!!")
            console.log(ret1[i].idx,  ret1[i].name);
        }

        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret3) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret3.length; i++){
                gearcompany_array[ret3[i].idx] = ret3[i].name;
                console.log(ret3[i].idx,  ret3[i].name);
            }

            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price,enduser,memo,place,comment,image from report where idx=?',[idx],function(err,rows){
                if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                // 이 idx값을 참조하여 DB에서 해당하는 정보를 가지고 옵니다.
                console.log(rows);
                null_to_string(rows);
                rows[0].recompany = recompany_array[rows[0].recompany];
                rows[0].gearcompany = gearcompany_array[rows[0].gearcompany];

                var fs = require('fs');

                fs.stat(rows[0].image, function(err) {
                    if (!err) {
                        console.log('file or directory exists');
                    }
                    else if (err.code === 'ENOENT'){
                        rows[0].image = "upload/not_found.png";
                        console.log('file or directory does not exist');
                        console.log(rows[0].image);
                    }
                    res.render('read', { title:'Board List',rows: rows });
                });
            });

        });

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



router.get('/page/:page',function(req,res,next) {

    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret1) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret1.length; i++){
            recompany_array[ret1[i].idx] = ret1[i].name;
            console.log(ret1[i].idx,  ret1[i].name);
        }
        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret3) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret3.length; i++){
                gearcompany_array[ret3[i].idx] = ret3[i].name;
                console.log(ret3[i].idx,  ret3[i].name);
            }

            var page = req.params.page;
            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\')as endday,clientsym,price,enduser,memo,place from report',function(err,rows){
                if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                null_to_string(rows);
                for(var i = 0; i < rows.length; i++){
                    // rows[i].sort = sort_array[rows[i].sort];
                    rows[i].recompany = recompany_array[rows[i].recompany];
                    // rows[i].title = title_array[rows[i].title];
                    rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                }
                res.render('page', { title:'Board List',rows: rows, page:page, length:rows.length-1, page_num:7, pass:true});
                console.log(rows.length-1);
            });

        });

    });

});


router.get('/write',function (req,res,next) {
    console.log("hello")
    // var query1 = connection.query('select idx, name from sort_data', function (err, sort_data) {
    //     if (err) console.log(err);
    var query1= connection.query('select idx, name from recompany_data', function (err, recompany_data) {
        if (err) console.log(err);
        // var query2= connection.query('select idx, name from title_data', function (err, title_data) {
        //     if (err) console.log(err);
        var query3= connection.query('select idx, name from gearcompany_data', function (err, gearcompany_data) {
            if (err) console.log(err);
            res.render('write', {
                title: 'RAYBARO',
                recompany_data: recompany_data,
                // title_data: title_data,
                gearcompany_data: gearcompany_data
            })
        });
    });
});


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
    console.log("22222");
    var body = req.body;
    console.log(body);
    var recompany=req.body.recompany;
    var writer = req.body.writer;
    var title = req.body.title;
    var gearcompany= req.body.gearcompany;
    var codenum=req.body.codenum;
    var codeserial=req.body.codeserial;
    var startday=req.body.startday;
    if(startday == "") startday = null;
    var endday=req.body.endday;
    if(endday == "") endday = null;
    var clientsym=req.body.clientsym;
    var price=req.body.price;
    var comment=req.body.comment;
    var enduser=req.body.enduser;
    var memo=req.body.memo;
    var place=req.body.place;
    var file = req.file;
    var imagepath;

    if(file == undefined) imagepath = "upload/original.png";
    else imagepath = file.path;

    console.log(recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,price,enduser,memo,place,comment,imagepath);
    connection.beginTransaction(function(err) {
        if(err) console.log(err);
        connection.query('insert into report(recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,price,enduser,memo,place,comment,image) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            ,[recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,price,enduser,memo,place,comment,imagepath]
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
    var query1= connection.query('select idx, name from recompany_data', function (err, recompany_data) {
        if (err) console.log(err);
        // var query2= connection.query('select idx, name from title_data', function (err, title_data) {
        //     if (err) console.log(err);
        var query3= connection.query('select idx, name from gearcompany_data', function (err, gearcompany_data) {
            if (err) console.log(err);
            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price,enduser,memo,place,comment,image from report where idx=?',[idx] ,function(err,rows){
                if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                null_to_string(rows);
                console.log('rows :' +  rows);
                res.render('update', {
                    title:'Board List',
                    rows: rows,
                    recompany_data: recompany_data,
                    // title_data: title_data,
                    gearcompany_data: gearcompany_data});
            });
        });
    });
});

router.post('/update/:idx', upload.single("photo"), function(req, res) {

    var body = req.body;
    var idx= req.params.idx;
    var recompany=req.body.recompany;
    var writer = req.body.writer;
    var title = req.body.title;
    var gearcompany= req.body.gearcompany;
    var codenum=req.body.codenum;
    var codeserial=req.body.codeserial;
    var startday=req.body.startday;
    console.log(startday);
    if(startday == "") startday = null;
    var endday=req.body.endday;
    console.log(endday);
    if(endday == "") endday = null;
    var clientsym=req.body.clientsym;
    var price=req.body.price;
    var comment=req.body.comment;
    var enduser=req.body.enduser;
    var memo=req.body.memo;
    var place=req.body.place;
    var file = req.file;
    // var imagepath;
    // //
    // if(file == undefined) imagepath = "upload/original.png";
    // else imagepath = file.path;
    // console.log(imagepath);
    var query = connection.query('update report set recompany=?,writer=?,title=?,gearcompany=?,codenum=?,codeserial=?,startday=?,endday=?,clientsym=?,price=?,enduser=?,memo=?,place=?,comment=? where idx=?', [recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,price,enduser,memo,place,comment,idx], function (err, rows) {
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

    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret2.length; i++){
            recompany_array[ret2[i].idx] = ret2[i].name;
            console.log(ret2[i].idx,  ret2[i].name);
        }

        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret4.length; i++){
                gearcompany_array[ret4[i].idx] = ret4[i].name;
                console.log(ret4[i].idx,  ret4[i].name);
            }

            var search_query = req.params.search_query;
            var search = req.params.search;
            var page = req.params.page;

            if(search_query == 1){
                var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price from report', function(err,rows){
                    // if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                    null_to_string(rows);
                    var arr = new Array();
                    for(var i = 0; i < rows.length; i++){
                        rows[i].recompany = recompany_array[rows[i].recompany];
                        rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                        if(rows[i].title.includes(search)){
                            arr.unshift(rows[i])
                        }

                    }

                    res.render('search', { title:'Board List',rows: arr, page:page, length:arr.length-1, page_num:7, pass:true, search:search, search_query:search_query,search_query_str:"모델명"});
                });

            }
            if(search_query == 2){
                var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price from report', function(err,rows){
                    if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                    null_to_string(rows);
                    var arr = new Array();
                    for(var i = 0; i < rows.length; i++){
                        rows[i].recompany = recompany_array[rows[i].recompany];
                        rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                        if(rows[i].codenum.includes(search)){
                            arr.unshift(rows[i])
                        }

                    }
                    res.render('search', { title:'Board List',rows: arr, page:page, length:arr.length-1, page_num:7, pass:true, search:search, search_query:search_query,search_query,search_query_str:"반출번호"});
                    console.log(rows.length-1);
                });
            }
            if(search_query == 3){
                var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price from report', function(err,rows){
                    if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                    null_to_string(rows);
                    var arr = new Array();
                    for(var i = 0; i < rows.length; i++){
                        rows[i].recompany = recompany_array[rows[i].recompany];
                        rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                        if(rows[i].codeserial.includes(search)){
                            arr.unshift(rows[i])
                        }

                    }
                    res.render('search', { title:'Board List',rows: arr, page:page, length:arr.length-1, page_num:7, pass:true, search:search, search_query:search_query,search_query_str:"시리얼번호"});
                    console.log(rows.length-1);
                });
            }

        });
    });

});



router.post('/date_search', function(req, res) {
    var body = req.body;
    var date_search_query = body.date_search_query;
    var startday = body.startday;
    var endday = body.endday;
    console.log(date_search_query, startday, endday)
    res.redirect('/board/date_search/' + date_search_query + '/' + startday +'/'+ endday + '/1');
});

router.get('/date_search/:date_search_query/:startday/:endday/:page', function(req, res){

    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret2.length; i++){
            recompany_array[ret2[i].idx] = ret2[i].name;
            console.log(ret2[i].idx,  ret2[i].name);
        }
        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret4.length; i++){
                gearcompany_array[ret4[i].idx] = ret4[i].name;
                console.log(ret4[i].idx,  ret4[i].name);
            }

            var date_search_query = req.params.date_search_query;
            var startday = req.params.startday;
            var endday = req.params.endday;
            console.log(date_search_query, startday, endday);

            var page = req.params.page;
            if(date_search_query == 1){
                var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday from report where DATE(startday) BETWEEN ? AND ?', [startday, endday], function(err,rows){
                    if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                    null_to_string(rows);
                    for(var i = 0; i < rows.length; i++){
                        // rows[i].sort = sort_array[rows[i].sort];
                        rows[i].recompany = recompany_array[rows[i].recompany];
                        // rows[i].title = title_array[rows[i].title];
                        rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                    }
                    res.render('datesearch', { title:'Board List',rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, startday:startday,endday:endday, date_search_query:date_search_query,date_str:"입고날짜"});
                    console.log(rows.length-1);
                });
            }
            if(date_search_query == 2){
                var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday from report where DATE(endday) BETWEEN ? AND ?', [startday, endday], function(err,rows){
                    if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                    null_to_string(rows);
                    for(var i = 0; i < rows.length; i++){
                        rows[i].recompany = recompany_array[rows[i].recompany];짜
                        rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                    }
                    res.render('datesearch', { title:'Board List',rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, startday:startday,endday:endday, date_search_query:date_search_query,date_str:"출고날짜"});
                    console.log(rows.length-1);
                });
            }
        });
    });
});


router.get('/search_home', function(req, res){
    res.render('search_home', {title:'Search'});
});

router.get('/rfinish/:page', function(req, res){
    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret2.length; i++){
            recompany_array[ret2[i].idx] = ret2[i].name;
            console.log(ret2[i].idx,  ret2[i].name);
        }

        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret4.length; i++){
                gearcompany_array[ret4[i].idx] = ret4[i].name;
                console.log(ret4[i].idx,  ret4[i].name);
            }
            var page = req.params.page;
            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price from report where endday is not NULL', function(err,rows){
                if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                null_to_string(rows);
                for(var i = 0; i < rows.length; i++){
                    // rows[i].sort = sort_array[rows[i].sort];
                    rows[i].recompany = recompany_array[rows[i].recompany];
                    // rows[i].title = title_array[rows[i].title];
                    rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];

                }
                console.log('rows :' +  rows);
                // console.log(ffff);
                res.render('rfinish', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true});
                console.log(rows.length-1);
            });
        });
    });
    // res.render('rfinish', {title:'rfinish'});
});
router.get('/ring/:page', function(req, res){
    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret2.length; i++){
            recompany_array[ret2[i].idx] = ret2[i].name;
            console.log(ret2[i].idx,  ret2[i].name);
        }

        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret4.length; i++){
                gearcompany_array[ret4[i].idx] = ret4[i].name;
                console.log(ret4[i].idx,  ret4[i].name);
            }
            var page = req.params.page;
            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price from report where endday is NULL', function(err,rows){
                if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                null_to_string(rows);
                for(var i = 0; i < rows.length; i++){
                    // rows[i].sort = sort_array[rows[i].sort];
                    rows[i].recompany = recompany_array[rows[i].recompany];
                    // rows[i].title = title_array[rows[i].title];
                    rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];

                }
                console.log('rows :' +  rows);
                // console.log(ffff);
                res.render('ring', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true});
                console.log(rows.length-1);
            });
        });
    });
});



router.post('/download', function(req, res){

    var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
        if(err) console.log(err);
        var recompany_array = new Array();
        for(var i = 0; i < ret2.length; i++){
            recompany_array[ret2[i].idx] = ret2[i].name;
            console.log(ret2[i].idx,  ret2[i].name);
        }

        var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
            if(err) console.log(err);
            var gearcompany_array = new Array();
            for(var i = 0; i < ret4.length; i++){
                gearcompany_array[ret4[i].idx] = ret4[i].name;
                console.log(ret4[i].idx,  ret4[i].name);
            }

            var query = connection.query('select idx,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%Y-%m-%d\') as startday,DATE_FORMAT(endday, \'%Y-%m-%d\') as endday,clientsym,price,enduser,place,comment,image from report',function(err,rows){
                null_to_string(rows);

                var xl = require('excel4node'); // npm install excel4node --save 를 통해 설치
                // Create a new instance of a Workbook class
                var wb = new xl.Workbook();

                // Add Worksheets to the workbook
                var ws = wb.addWorksheet('Sheet 1');

                ws.cell(1, 1).string('No');
                ws.cell(1, 2).string('입고처');
                ws.cell(1, 3).string('수리담당자');
                ws.cell(1, 4).string('모델명');
                ws.cell(1, 5).string('장비제조사');
                ws.cell(1, 6).string('반출번호');
                ws.cell(1, 7).string('시리얼번호');
                ws.cell(1, 8).string('입고날');
                ws.cell(1, 9).string('출고날');
                ws.cell(1, 10).string('고객접수증상');
                ws.cell(1, 11).string('가격');
                ws.cell(1, 12).string('enduser');
                ws.cell(1, 13).string('수리위치');
                ws.cell(1, 14).string('수리내역');
                ws.cell(1, 15).string('사진')
                for(var i=0;i<rows.length;i++){
                    console.log(rows.length);
                    ws.cell(2+i, 1).string(rows[i].idx.toString());
                    ws.cell(2+i, 2).string(recompany_array[rows[i].recompany]);
                    ws.cell(2+i, 3).string(rows[i].writer);
                    ws.cell(2+i, 4).string(rows[i].title);
                    ws.cell(2+i, 5).string(gearcompany_array[rows[i].gearcompany]);
                    ws.cell(2+i, 6).string(rows[i].codenum);
                    ws.cell(2+i, 7).string(rows[i].codeserial);
                    ws.cell(2+i, 8).string(rows[i].startday);
                    ws.cell(2+i, 9).string(rows[i].endday);
                    ws.cell(2+i, 10).string(rows[i].clientsym);
                    ws.cell(2+i, 11).string(rows[i].price);
                    ws.cell(2+i, 12).string(rows[i].enduser);
                    ws.cell(2+i, 13).string(rows[i].place);
                    ws.cell(2+i, 14).string(rows[i].comment);
                    ws.cell(2+i, 15).string(rows[i].image);

                }

                var rightNow = new Date();
                wb.write('raybaro - ' + rightNow.toISOString().substring(0, 13) + '.xlsx', res);

            });
        });

    });

});

module.exports = router;