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
            return result;
        } catch (e) {
            console.trace(e);
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
    }
}

module.exports = lib;