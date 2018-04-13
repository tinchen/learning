const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//const gcs = require('@google-cloud/storage')();

const google = require('googleapis'),
      urlshortener = google.urlshortener({ version: 'v1', auth: 'AIzaSyAjy6zF7bmLY3eKN6CRtDJMDZrEUdjrrf4' });

const http = require('http'),
      Stream = require('stream').Transform,
      fs = require('fs');

const ebookRef = admin.database().ref('/ebook');
const albumsRef = admin.database().ref('/ebook/albums');

//const imagesRef = admin.storage().ref('/images');

exports.ebook = functions.https.onRequest((request, response) => {
    response.setHeader('Content-Type', 'application/json');

    //console.log(decodeURIComponent(request.query.album));
    if (request.query.album) {
        var key = ebookRef.push().key;
        var album = {};
        album[key] = JSON.parse(decodeURIComponent(request.query.album));

        //console.log(album);
        albumsRef.update(album);
        response.send(JSON.stringify(album));
    }
    else {
        ebookRef.once('value').then((snapshot) => {
            var result = snapshot.val();
            if (request.query.callback) {
                response.send(request.query.callback + '(' + JSON.stringify(result) + ')');
            }
            else {
                response.send(JSON.stringify(result));
            }
        });
    }
});

exports.googl = functions.https.onRequest((request, response) => {
    if (!request.query.u) {
        response.status(404).type('txt').send('URL Not found');
        return;
    }

   var resource = {
        longUrl: request.query.u
    }
    urlshortener.url.insert({ resource: resource }, (err, result) => {
        if (err) {
            response.status(500).type('txt').send(err);
            return;
        }
        response.status(200).setHeader('Content-Type', 'application/json');
        if (request.query.callback) {
            response.send(request.query.callback + '(' + JSON.stringify(result) + ')');
        }
        else {
            response.send(JSON.stringify(result));
        }
    });
});

exports.fetchUrl = functions.https.onRequest((request, response) => {
    if (!request.query.url) {
        response.status(404);
        response.type('txt').send('URL Not found');
        return;
    }

    //const bucket = gcs.bucket(fileBucket);
    const tempFilePath = '/tmp/googlelogo.png';

    http.request(request.query.url, (res) => {
        var data = new Stream();
        res.on('data', (chunk) => {
            data.push(chunk);
        });
        res.on('end', () => {
            fs.writeFileSync(tempFilePath, data.read());
            const stats = fs.statSync(tempFilePath);
            response.send(stats.size / 1000000.0);
        });
    }).end();
});
