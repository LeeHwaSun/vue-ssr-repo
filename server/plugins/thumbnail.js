const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imgSize = require('image-size');

const thumbnail = function(uploadPath) {
    return async function(req, res, next) {
        const _path = `${uploadPath}/${req.params._path}`;
        const srcFile = `${_path}${req.path}`;
        const fileInfo = path.parse(req.path);
        if (!fs.existsSync(srcFile)) {
            return res.status(400).end('file not found');
        }

        try {
            const dim = imgSize(srcFile);
            // gif 일때
            if (dim.type != 'jpg' && dim.type != 'png' && dim.type != 'jpeg') {
                return res.end(fs.readFileSync(srcFile));
            }

            // request image size
            const w = parseInt(req.query.w) || 0;
            const h = parseInt(req.query.h) || 0;

            // 요청 사이즈가 둘다 없으면
            if (w == 0 && h == 0) {
                // 원본을 보내준다
                return res.end(fs.readFileSync(srcFile));
            }

            // cache folder
            const destPath = _path + '/.cache';
            fs.mkdirSync(destPath, { recursive : true });

            // cache file name
            const destFile = `${destPath}/${fileInfo.name}_w${w}_h${h}${fileInfo.ext}`;

            // cache 된 파일이 있으면 cache 파일을 보내준다.
            if (fs.existsSync(destFile)) {
                return res.end(fs.readFileSync(destFile));
            }

            await sharp(srcFile).resize(w || null, h || null).toFile(destFile);

            return res.end(fs.readFileSync(destFile));
        } catch (e) {
            return res.end(fs.readFileSync(srcFile));
        }
        
    }
}

module.exports = thumbnail;