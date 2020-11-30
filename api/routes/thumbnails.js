const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('thumbnailer-bucket');
const imagePath = path.join(__dirname, '../../nailer/images');
const cachePeriod = 60 * 60 * 24;
const cacheHeader = `public, max-age=${cachePeriod}`;
const useStorage = process.env.NODE_ENV === 'production';

const mimes = {
    'jpeg': 'jpg',
    'jpg': 'jpg',
    'png': 'png',
    'gif': 'gif',
};

function getFileStreamFromDisk(name) {
    const filePath = path.join(imagePath, name);

    if (fs.existsSync(filePath)) {
        return fs.createReadStream(filePath);
    }

    return false;
}

function getFileStreamFromStorage(name) {
    const remoteFile = bucket.file(name);
    return remoteFile.createReadStream();
}

const getFileStream = useStorage ? getFileStreamFromStorage : getFileStreamFromDisk;

router.get('/thumbnails', function (req, res) {
    const { name } = req.query;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(404).json({ message: 'Thumbnail not found.' });
    }

    const parts = name.split('.');
    const mime = mimes[parts[1]];

    if (parts.length < 2 || !mime) {
        return res.status(404).json({ message: 'Thumbnail not found.' });
    }

    const stream = getFileStream(name);

    if (!stream) {
        return res.status(404).json({ message: 'Thumbnail not found.' });
    }

    res.writeHead(200, {
        'content-type': `image/${mime}`,
        'Cache-control': cacheHeader,
    });

    stream
        .on('error', function(err) {
            console.error('[Thumbnail Route]:', err.message);
        })
        .on('close', function() {
            res.end();
        })
        .on('finish', function() {
            res.end();
        })
        .on('end', function() {
            res.end();
        }).pipe(res);

    // For some reason, sometimes the stream fails to close locally.
    // Remove this to debug it and figure out why
    // Could be due to incorrect content-length headers in the file?
    if (!useStorage) {
        setTimeout(() => {
            stream.close();
        }, 100);
    }
});

module.exports = router;