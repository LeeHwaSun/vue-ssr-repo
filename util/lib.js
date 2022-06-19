const lib = {
    deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        const result = Array.isArray(obj) ? [] : {};
        for (const key of Object.keys(obj)) {
            result[key] = lib.deepCopy(obj[key]);
        }
        return result;
    },
    modelCall : async (fn, ...args) => {
        try {
            const result = await fn( ...args );
            $logger.info(`${fn.name} success : ${JSON.stringify(result)}`);
            return result;
        } catch (e) {
            $logger.error(`${fn.name} error : ${e.message}`);
            return { err : e.message }
        }
    },
    getIp(req) {
        return req.ip.replace('::ffff:', '');
    },
    findParentVm(vm, target) {
        let parent = vm.$parent;
        while (parent.$vnode) {
            if (parent.$vnode.tag.endsWith(target)) {
                return parent;
            }
            parent = parent.$parent;
        }
        return null;
    },
    getSummary(content, len = 300) {
        let text = content.replace(/(<([^>]+)>)/ig, "");
        if (text.length > len) {
            text = text.substr(0, len - 3) + "...";
        }
        return text;
    },
    fileSize(x) {
        const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const e = Math.floor(Math.log(x) / Math.log(1024));
        return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    },
    getImage(item, table, imgSize) {
        // 본문에 업로드된 이미지
        if (item.wrImgs.length) {
            return `/upload/${table}/${item.wrImgs[0].brd_file_src}?w=${imgSize.w}&h=${imgSize.h}`;
        }
        // 첨부파일에 업로드된 이미지
        if (item.wrFiles.length) {
            for (const file of item.wrFiles) {
                if (file.brd_file_type.startsWith('image')) {
                    return `/upload/${table}/${file.brd_file_src}?w=${imgSize.w}&h=${imgSize.h}`;
                }
            }
        }
        // URL 링크로 올린 이미지
        const pattern = /<img[^>]*src=\"([^\"]+)\"[^>]*>/;
        const matches = item.wr_content.match(pattern);
        if (matches) {
            return matches[1];
        }
        // 없으면 no image
        return `/image/noimage.jpg?w=${imgSize.w}&h=${imgSize.h}`;
    }
}

module.exports = lib;