require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
require('./plugins/pm2Bus');

(async function() {
	// 앱 초기화
	const app = express();
	const port = process.env.VUE_APP_SERVER_PORT || 3000;
	const webServer = http.createServer(app);

	// Logger
	const logger = require('./plugins/logger');
	global.$logger = logger;

	// Socket.IO 적용
	const socket = require('./plugins/socket');
	socket(webServer);

	// 설정정보 로드
	const configModel = require('./api/_model/configModel');
	$logger.info("설정 로드 전")
	await configModel.load();
	$logger.info("설정 로드 후");

	let isDisableKeepAlive = false;
	app.use((req, res, next) => {
		if (isDisableKeepAlive) {
			console.log('Keep Alive :', isDisableKeepAlive);
			$logger.info('Keep Alive : ' + isDisableKeepAlive);
			res.set('Connection', 'close')
		}
		next();
	})

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

	// Session
	const session = require('express-session');
	app.use(session({
		secret : siteConfig.SECRET_KEY, // 쿠키 변조 방지에 대한 해시
		resave : true, // 세션을 언제나 저장할지 여부
		saveUninitialized : false, // 세선 저장 전 초기화 안함
	}));

	// Global
	global.USER_PROFILE_PATH = path.join(__dirname, './upload/userProfile');
	fs.mkdirSync(USER_PROFILE_PATH, { recursive : true });
	global.UPLOAD_PATH = path.join(__dirname, './upload');

	// Passport
	const passport = require('./plugins/passport');
	passport(app);

	// User Profile Image Thumbnail
	const thumbnail = require('./plugins/thumbnail');
	app.use('/upload/:_path', thumbnail(path.join(__dirname, './upload')));

	// 정적 폴더
	app.use(express.static(path.join(__dirname, "../dist")));

	// api router
	const autoRoute = require('./autoRoute');
	autoRoute('/api', app);
	app.use('/api/*', (req, res) => {
		$logger.error('요청하신 API가 없습니다.');
		res.json( {err : "요청하신 API가 없습니다."} );
	});

	// Vue SSR
	const { createBundleRenderer } = require('vue-server-renderer');
	const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');
	const serverBundle = require(path.join(__dirname, '../dist/vue-ssr-server-bundle.json'));
	const clientManifest = require(path.join(__dirname, '../dist/vue-ssr-client-manifest.json'));

	app.get('*', (req, res) => {
		const renderer = createBundleRenderer(serverBundle, {
			runInNewContext : false,
			template,
			clientManifest,
		});

		const ctx = {
			url : req.url,
			title : 'Vue SSR App',
			metas : `<!-- inject more metas -->`,
			user : req.user || null,
			token : req.cookies.token || null,
			config : clientConfig,
		};

		const stream = renderer.renderToStream(ctx);

		stream.on('end', ()=> {
			const memSize = Object.entries(process.memoryUsage())[0][1];
			$logger.info('스트림 렌더 종료 ', (memSize / 1024 / 1024).toFixed(4));
			if (process.platform == 'linux') {
				if (memSize > 150000000) {
					$logger.info('서버 재시작');
					process.emit('SIGINT');
				}
			}
		}).pipe(res);
	});

	// 서버 Listen
	webServer.listen(port, () => {
		process.send('ready');
		$logger.info(`http://localhost:${port} 서버 시작`);
	});

	process.on('SIGINT', function() {
		isDisableKeepAlive = true;
		webServer.close(function() {
			$logger.info('server closed');
			process.exit(0);
		})
	});
})();