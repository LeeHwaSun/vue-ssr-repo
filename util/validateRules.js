const rules = {
    min({ label, len = 3, info = null }) {
        return v => !!v ? v.length >= len || info || `${label}은(는) ${len}자 이상 입력하세요.` : true;
    },
    required({ label }) {
        return v => !!v || `${label}은(는) 필수 입력입니다.`;
    },
    alphaNum() {
        return v => !!v ? /^[a-zA-Z0-9_]+$/.test(v) || '영,숫자만 입력하세요.' : true;
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
            required : true,
            pattern : /^[a-zA-Z0-9_-]+$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.min(opt));
        ruleArr.push(rules.pattern(opt));
        return ruleArr;
    },
    name(options) {
        const defaultOptions = {
            label : "이름",
            len : 2,
            info : null,
            required : true
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.min(opt));
        return ruleArr;
    },
    password(options) {
        const defaultOptions = {
            label : "비밀번호",
            info : "비밀번호는 영어, 숫자, 특수문자(?!@#${})를 포함하여 입력해주세요.",
            len : 6,
            required : true,
            pattern: /^.*(?=^.{6,}$)(?=.*\d)(?=.*[a-zA-z])(?=.*[?!@#$\{\}]).*$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.min(opt));
        ruleArr.push(rules.pattern(opt));
        return ruleArr;  
    },
    email(options) {
        const defaultOptions = {
            label : "이메일",
            info : "이메일은 형식에 맞게 입력하세요.(예 : aaa@example.com)",
            required : true,
            pattern : /([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.pattern(opt));
        return ruleArr;
    },
    date(options) {
        const defaultOptions = {
            label : "날짜",
            info : 'YYYY-MM-DD 형식의 맞게 입력하세요.',
            required : true,
            pattern : /^\d{4}-\d{2}-\d{2}$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.pattern(opt));
        return ruleArr;
    },
    phone(options) {
        const defaultOptions = {
            label : "전화번호",
            info : null,
            required : true,
            pattern : /^(\d{2,3}-)?\d{2,4}-\d{4}$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.pattern(opt));
        return ruleArr;
    },
    cfgKey(options) {
        const defaultOptions = {
            label : "키",
            len : 3,
            info : null,
            required : true,
            pattern : /^[a-zA-Z0-9_-]+$/
        };
        const opt = Object.assign(defaultOptions, options);
        const ruleArr = [];
        if (opt.required) {
            ruleArr.push(rules.required(opt));
        }
        ruleArr.push(rules.min(opt));
        ruleArr.push(rules.pattern(opt));
        return ruleArr;
    },
}

module.exports = rules;