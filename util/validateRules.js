const rules = {
    max({ label, len = 3, info = null }) {
        return v => !!v ? v.length >= len || info || `${label}은(는) ${len}자 이상 입력하세요.` : true;
    },
    required({ label }) {
        return v => !!v || `${label}은(는) 필수 입력입니다.`;
    },
    alphaNum() {
        return v => !!v ? /^[a-zA-Z0-9]+$/.test(v) || '영,숫자만 입력하세요.' : true;
    },
    pattern({ label, pattern, info = null }) {
        return v => !!v ? pattern.test(v) || info || `${label}은(는) 형식에 맞게 입력하세요.` : true;
    },
    matchValue(origin, info = null) {
        return v => v === origin || info || '비밀번호가 일치하지 않습니다.';
    },
    id(options) {
        const defaultOptions = {
            label : "아이디",
            len : 3,
            info : null,
            required : true
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.max(opt));
        ruleArr.push(rules.alphaNum());
        return ruleArr;
    }
}

module.exports = rules;