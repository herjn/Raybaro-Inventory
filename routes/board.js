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
    var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,repairsym from report',function(err,rows){
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
    console.log("idx : "+idx);
    var sort_query = connection.query('select idx, name from sort_data', function (err, ret) {
        if(err) console.log(err);
        var sort_array = new Array();
        for(var i = 0; i < ret.length; i++){
            sort_array[ret[i].idx] = ret[i].name;
            console.log(ret[i].idx,  ret[i].name);
        }
        var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
            if(err) console.log(err);
            var recompany_array = new Array();
            for(var i = 0; i < ret2.length; i++){
                recompany_array[ret2[i].idx] = ret2[i].name;
                console.log(ret2[i].idx,  ret2[i].name);
            }
            var sort_query = connection.query('select idx, name from title_data', function (err, ret3) {
                if(err) console.log(err);
                var title_array = new Array();
                for(var i = 0; i < ret3.length; i++){
                    title_array[ret3[i].idx] = ret3[i].name;
                    console.log(ret3[i].idx,  ret3[i].name);
                }
                var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
                    if(err) console.log(err);
                    var gearcompany_array = new Array();
                    for(var i = 0; i < ret4.length; i++){
                        gearcompany_array[ret4[i].idx] = ret4[i].name;
                        console.log(ret4[i].idx,  ret4[i].name);
                    }

                    var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym,comment,image from report where idx=?',[idx],function(err,rows){
                        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                        // 이 idx값을 참조하여 DB에서 해당하는 정보를 가지고 옵니다.

                        null_to_string(rows);
                        rows[0].sort = sort_array[rows[0].sort];
                        rows[0].recompany = recompany_array[rows[0].recompany];
                        rows[0].title = title_array[rows[0].title];
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

//
// router.get('/page',function (req,res,next) {
//     res.redirect('/board/page/1');
// })

router.get('/page/:page',function(req,res,next)
{
    var sort_query = connection.query('select idx, name from sort_data', function (err, ret) {
        if(err) console.log(err);
        var sort_array = new Array();
        for(var i = 0; i < ret.length; i++){
            sort_array[ret[i].idx] = ret[i].name;
            console.log(ret[i].idx,  ret[i].name);
        }
        var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
            if(err) console.log(err);
            var recompany_array = new Array();
            for(var i = 0; i < ret2.length; i++){
                recompany_array[ret2[i].idx] = ret2[i].name;
                console.log(ret2[i].idx,  ret2[i].name);
            }
            var sort_query = connection.query('select idx, name from title_data', function (err, ret3) {
                if(err) console.log(err);
                var title_array = new Array();
                for(var i = 0; i < ret3.length; i++){
                    title_array[ret3[i].idx] = ret3[i].name;
                    console.log(ret3[i].idx,  ret3[i].name);
                }
                var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
                    if(err) console.log(err);
                    var gearcompany_array = new Array();
                    for(var i = 0; i < ret4.length; i++){
                        gearcompany_array[ret4[i].idx] = ret4[i].name;
                        console.log(ret4[i].idx,  ret4[i].name);
                    }

                    var page = req.params.page;
                    var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report',function(err,rows){
                        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                        null_to_string(rows);
                        for(var i = 0; i < rows.length; i++){
                            rows[i].sort = sort_array[rows[i].sort];
                            rows[i].recompany = recompany_array[rows[i].recompany];
                            rows[i].title = title_array[rows[i].title];
                            rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                        }
                        res.render('page', { title:'Board List',rows: rows, page:page, length:rows.length-1, page_num:7, pass:true});
                        console.log(rows.length-1);
                    });

                });

            });

        });

    });
});


router.get('/write',function (req,res,next) {
    var query1 = connection.query('select idx, name from sort_data', function (err, sort_data) {
        if (err) console.log(err);
        var query2 = connection.query('select idx, name from recompany_data', function (err, recompany_data) {
            if (err) console.log(err);
            var query3 = connection.query('select idx, name from title_data', function (err, title_data) {
                if (err) console.log(err);
                var query4 = connection.query('select idx, name from gearcompany_data', function (err, gearcompany_data) {
                    if (err) console.log(err);
                    res.render('write', {
                        title: 'RAYBARO',
                        sort_data: sort_data,
                        recompany_data: recompany_data,
                        title_data: title_data,
                        gearcompany_data: gearcompany_data
                    })
                });
            });
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

    var body = req.body;
    var sort=req.body.sort;
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
    var repairsym=req.body.repairsym;
    var comment=req.body.comment;
    var file = req.file;
    var imagepath;
    if(file == undefined) imagepath = "upload/original.png";
    else imagepath = file.path;

    console.log(sort,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,repairsym,comment,imagepath);
    connection.beginTransaction(function(err) {
        if(err) console.log(err);
        connection.query('insert into report(sort,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,repairsym,comment,image) values(?,?,?,?,?,?,?,?,?,?,?,?,?)'
            ,[sort,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,repairsym,comment,imagepath]
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
    var query1 = connection.query('select idx, name from sort_data', function (err, sort_data) {
        if (err) console.log(err);
        var query2 = connection.query('select idx, name from recompany_data', function (err, recompany_data) {
            if (err) console.log(err);
            var query3 = connection.query('select idx, name from title_data', function (err, title_data) {
                if (err) console.log(err);
                var query4 = connection.query('select idx, name from gearcompany_data', function (err, gearcompany_data) {
                    if (err) console.log(err);
                    var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym,comment,image from report where idx=?',[idx] ,function(err,rows){
                        if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                        null_to_string(rows);
                        console.log('rows :' +  rows);
                        // console.log(ffff);
                        res.render('update', {
                            title:'Board List',
                            rows: rows,
                            sort_data: sort_data,
                            recompany_data: recompany_data,
                            title_data: title_data,
                            gearcompany_data: gearcompany_data});
                    });
                });
            });
        });
    });
});

router.post('/update/:idx', upload.single("photo"), function(req, res) {
    var idx = req.params.idx;
    var body = req.body;
    var sort=req.body.sort;
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
    var repairsym=req.body.repairsym;
    var comment=req.body.comment;
    var file = req.file;
    var imagepath;

    if(file == undefined) imagepath = "upload/original.png";
    else imagepath = file.path;
    console.log(imagepath);
    var query = connection.query('update report set sort=?,recompany=?,writer=?,title=?,gearcompany=?,codenum=?,codeserial=?,startday=?,endday=?,clientsym=?,repairsym=?,comment=?,image=? where idx=?', [sort,recompany,writer,title,gearcompany,codenum,codeserial,startday,endday,clientsym,repairsym,comment,imagepath,idx], function (err, rows) {
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
    var sort_query = connection.query('select idx, name from sort_data', function (err, ret) {
        if(err) console.log(err);
        var sort_array = new Array();
        for(var i = 0; i < ret.length; i++){
            sort_array[ret[i].idx] = ret[i].name;
            console.log(ret[i].idx,  ret[i].name);
        }
        var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
            if(err) console.log(err);
            var recompany_array = new Array();
            for(var i = 0; i < ret2.length; i++){
                recompany_array[ret2[i].idx] = ret2[i].name;
                console.log(ret2[i].idx,  ret2[i].name);
            }
            var sort_query = connection.query('select idx, name from title_data', function (err, ret3) {
                if(err) console.log(err);
                var title_array = new Array();
                for(var i = 0; i < ret3.length; i++){
                    title_array[ret3[i].idx] = ret3[i].name;
                    console.log(ret3[i].idx,  ret3[i].name);
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
                    console.log(search);
                    if(search_query == 1){
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report where writer=?', [search], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"고객명"});
                            console.log(rows.length-1);
                        });
                    }
                    if(search_query == 2){
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report where title=?', [search], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"제품명"});
                            console.log(rows.length-1);
                        });
                    }
                    if(search_query == 3){
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report where codenum=?', [search], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"제품코드"});
                            console.log(rows.length-1);
                        });
                    }
                    if(search_query == 4){
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report where codeserial=?', [search], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"시리얼번호"});
                            console.log(rows.length-1);
                        });
                    }

                });
            });

        });

    });


    // if(search_query == 2){
    //     var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym from report where startday=?', [search], function(err,rows){
    //         if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
    //         null_to_string(rows);
    //         console.log('rows :' +  rows);
    //         // console.log(ffff);
    //         res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search:search, search_query:"수리날짜"});
    //         console.log(rows.length-1);
    //     });
    // }
    // // if(search_query == 3){

});








router.post('/date_search', function(req, res) {
    var body = req.body;
    var date_search_query = body.date_search_query;
    var startday = body.startday;
    var endday = body.endday;
    console.log(date_search_query, startday, endday)
    res.redirect('/board/date_search/' + date_search_query + '/' + startday + '/' + endday + '/1');
});

router.get('/date_search/:date_search_query/:startday/:endday/:page', function(req, res){
    var sort_query = connection.query('select idx, name from sort_data', function (err, ret) {
        if(err) console.log(err);
        var sort_array = new Array();
        for(var i = 0; i < ret.length; i++){
            sort_array[ret[i].idx] = ret[i].name;
            console.log(ret[i].idx,  ret[i].name);
        }
        var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
            if(err) console.log(err);
            var recompany_array = new Array();
            for(var i = 0; i < ret2.length; i++){
                recompany_array[ret2[i].idx] = ret2[i].name;
                console.log(ret2[i].idx,  ret2[i].name);
            }
            var sort_query = connection.query('select idx, name from title_data', function (err, ret3) {
                if(err) console.log(err);
                var title_array = new Array();
                for(var i = 0; i < ret3.length; i++){
                    title_array[ret3[i].idx] = ret3[i].name;
                    console.log(ret3[i].idx,  ret3[i].name);
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
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday from report where DATE(startday) BETWEEN ? AND ?', [startday, endday], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search: startday + "~" + endday, search_query:"출고날짜"});
                            console.log(rows.length-1);
                        });
                    }
                    if(date_search_query == 2){
                        var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday from report where DATE(endday) BETWEEN ? AND ?', [startday, endday], function(err,rows){
                            if(err) console.log(err)        // 만약 에러값이 존재한다면 로그에 표시합니다.
                            null_to_string(rows);
                            for(var i = 0; i < rows.length; i++){
                                rows[i].sort = sort_array[rows[i].sort];
                                rows[i].recompany = recompany_array[rows[i].recompany];
                                rows[i].title = title_array[rows[i].title];
                                rows[i].gearcompany = gearcompany_array[rows[i].gearcompany];
                            }
                            console.log('rows :' +  rows);
                            // console.log(ffff);
                            res.render('search', { title:'Board List',rows: rows,rows: rows, page:page, length:rows.length-1, page_num:7, pass:true, search: startday + "~" + endday, search_query:"출고짜"});
                            console.log(rows.length-1);
                        });
                    }
                });
            });

        });

    });
});


router.get('/search_home', function(req, res){
    res.render('search_home', {title:'Search'});
});


router.post('/download', function(req, res){
    var sort_query = connection.query('select idx, name from sort_data', function (err, ret) {
        if(err) console.log(err);
        var sort_array = new Array();
        for(var i = 0; i < ret.length; i++){
            sort_array[ret[i].idx] = ret[i].name;
            console.log(ret[i].idx,  ret[i].name);
        }
        var recompany_query = connection.query('select idx, name from recompany_data', function (err, ret2) {
            if(err) console.log(err);
            var recompany_array = new Array();
            for(var i = 0; i < ret2.length; i++){
                recompany_array[ret2[i].idx] = ret2[i].name;
                console.log(ret2[i].idx,  ret2[i].name);
            }
            var sort_query = connection.query('select idx, name from title_data', function (err, ret3) {
                if(err) console.log(err);
                var title_array = new Array();
                for(var i = 0; i < ret3.length; i++){
                    title_array[ret3[i].idx] = ret3[i].name;
                    console.log(ret3[i].idx,  ret3[i].name);
                }
                var gearcompany_query = connection.query('select idx, name from gearcompany_data', function (err, ret4) {
                    if(err) console.log(err);
                    var gearcompany_array = new Array();
                    for(var i = 0; i < ret4.length; i++){
                        gearcompany_array[ret4[i].idx] = ret4[i].name;
                        console.log(ret4[i].idx,  ret4[i].name);
                    }

                    var query = connection.query('select idx,sort,recompany,writer,title,gearcompany,codenum,codeserial,DATE_FORMAT(startday, \'%y-%m-%d\') as startday,DATE_FORMAT(endday, \'%y-%m-%d\') as endday,clientsym,repairsym,comment,image from report',function(err,rows){
                        null_to_string(rows);

                        var xl = require('excel4node'); // npm install excel4node --save 를 통해 설치

                        // Create a new instance of a Workbook class
                        var wb = new xl.Workbook();

                        // Add Worksheets to the workbook
                        var ws = wb.addWorksheet('Sheet 1');

                        ws.cell(1, 1).string('번호');
                        ws.cell(1, 2).string('수리분류');
                        ws.cell(1, 3).string('수리요청회사');
                        ws.cell(1, 4).string('최초고객사 및 담당자');
                        ws.cell(1, 5).string('모델명');
                        ws.cell(1, 6).string('장비제조사명');
                        ws.cell(1, 7).string('제품코드번호');
                        ws.cell(1, 8).string('제품시리얼번호');
                        ws.cell(1, 9).string('입고날짜');
                        ws.cell(1, 10).string('출고날짜');
                        ws.cell(1, 11).string('고객접수증상');
                        ws.cell(1, 12).string('고장증상');
                        ws.cell(1, 13).string('수리내역');

                        for(var i=0;i<rows.length;i++){
                            console.log(rows.length);
                            ws.cell(2+i, 1).string(rows[i].idx.toString());
                            ws.cell(2+i, 2).string(sort_array[rows[i].sort]);
                            ws.cell(2+i, 3).string(recompany_array[rows[i].recompany]);
                            ws.cell(2+i, 4).string(rows[i].writer);
                            ws.cell(2+i, 5).string(title_array[rows[i].title]);
                            ws.cell(2+i, 6).string(gearcompany_array[rows[i].gearcompany]);
                            ws.cell(2+i, 7).string(rows[i].codenum);
                            ws.cell(2+i, 8).string(rows[i].codeserial);
                            ws.cell(2+i, 9).string(rows[i].startday);
                            ws.cell(2+i, 10).string(rows[i].endday);
                            ws.cell(2+i, 11).string(rows[i].clientsym);
                            ws.cell(2+i, 12).string(rows[i].repairsym);
                            ws.cell(2+i, 13).string(rows[i].comment);

                        }

                        var rightNow = new Date();
                        wb.write('raybaro - ' + rightNow.toISOString().substring(0, 13) + '.xlsx', res);

                    });
                });

            });

        });

    });

    //
    // // Create a reusable style
    // // Set value of cell A1 to 100 as a number type styled with paramaters of style
    // ws.cell(1, 1)
    //     .string('text')
    //     .style(style);
    // ws.cell(1, 2)
    //     .number(100)
    //
    // // Set value of cell B1 to 200 as a number type styled with paramaters of style
    // ws.cell(1, 3)
    //     .date(new Date())
    //     .style(style);
    //
    // // Set value of cell C1 to a formula styled with paramaters of style
    // ws.cell(1, 4)
    //     .formula('A1 + B1')
    //     .style(style);
    //
    // // Set value of cell A2 to 'string' styled with paramaters of style
    // ws.cell(1, 5)
    //     .string('id')
    //     .style(style);
    //
    // // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    // ws.cell(1, 6)
    //     .bool(true)
    //     .style(style)
    //     .style({font: {size: 14}});



    // res.redirect('/board/page/1');
});

module.exports = router;
