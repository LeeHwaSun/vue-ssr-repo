require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 앱 초기화
const app = express();
const port = process.env.VUE_APP_SERVER_PORT || 3000;
const webServer = http.createServer(app);

// favicon
app.use((req, res, next) => {
	if (req.path.indexOf('favicon.ico') > -1) {
		const favicon = fs.readFileSync(path.join(__dirname, '../dist/favicon.ico'));
		res.status(200).end(favicon);
		return;
	}
	next();
});

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
const fileupload = require('express-fileupload');
app.use(fileupload());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Global
global.USER_PROFILE_PATH = path.join(__dirname, './upload/userProfile');
fs.mkdirSync(USER_PROFILE_PATH, { recursive : true });

// Passport
const passport = require('./plugins/passport');
passport(app);

// User Profile Image Thumbnail
const thumbnail = require('./plugins/thumbnail');
app.use('/upload/:_path', thumbnail(path.join(__dirname, './upload')));

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist")));

// api router
const userRouter = require('./api/user');
app.use('/api/user', userRouter);
app.use('/api/*', (req, res) => {
	res.json( {err : "요청하신 API가 없습니다."} );
});

// Vue SSR
const { createBundleRenderer } = require('vue-server-renderer');
const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');
const serverBundle = require(path.join(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.join(__dirname, '../dist/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
	runInNewContext : false,
	template,
	clientManifest,
});

app.get('*', (req, res) => {
	const ctx = {
		url : req.url,
		title : 'Vue SSR App',
		metas : `<!-- inject more metas -->`,
	};

	const stream = renderer.renderToStream(ctx);

	stream.on('end', ()=> {
		console.log('스트림 렌더 종료');
	}).pipe(res);
});

// 서버 Listen
webServer.listen(port, () => {
    console.log(`http://localhost:${port}`)
});