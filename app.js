var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
//var bodyParser = require('body-parser');
var router = express.Router();

//sets up the repo for static files
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){
    res.render(path.join(__dirname, 'views/progress.html'));
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads');

    //rename the file to original name
    // we want to rename to final name
    form.on('file', function(field, file){
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    //log errors
    form.on('error', function(err){
        console.log('error uploading' + err);
    });

    //this is the end of the communication!
    form.on('end', function(){
       //console.log(form);
        return res.send({redirect:'/progress.html'});
    });

    form.parse(req);

    return res.sendFile(path.join(__dirname, 'views/progress.html'));
});

var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});
