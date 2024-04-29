// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const HOST = 'http://localhost';
const app = express();
const posts = require('./posts');
const ACCESS_SECRET_KEY = 'secretText'

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'POST, GET'
}));
// JSON 형태의 요청 body를 파싱하기 위해 미들웨어 사용
app.use(express.json());

// 사용자 인증 라우트
app.post('/login',(req, res) => {
    // TODO 1: 사용자 이름을 요청 본문에서 받음
    let data;
    const username = req.body.username;
    const user = {name: username};
    console.log(`${req.method} 요청이 들어왔어요`) // 삭제
    
    // TODO 2: accessToken 발급
    /*
    jsonwebtoken 모듈의 sign 함수 사용, 유효기간 설정
    */ 
    const accessToken = jwt.sign(user, ACCESS_SECRET_KEY, { expiresIn: '2h' });
    console.log(accessToken);

    // TODO 3 : 응답을 보내기
    res.json({accessToken: accessToken});
});

// 보호된 라우트
app.get('/posts', authMiddleware, (req, res) => {
    
    // TODO 5: 인증된 사용자에게만 POST 데이터 응답
    res.json(posts);
    console.log(`${req.method} 요청이 들어왔어요`) // 삭제
})


// 미들웨어
function authMiddleware(req, res, next){
    // 토큰 가져오기
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // TODO 8: 서버 내부에서 발생할 수 있는 다른 오류들도 처리
    if (token === null) return res.sendStatus(401);
    
    /*
    미들웨어 함수 작성. jsonwebtoken 모듈의 verify 함수 사용
    */
   // TODO 4: accessToken 검증
   jwt.verify(token, ACCESS_SECRET_KEY, (err, user) => {
       // TODO 7: 인증 실패시 적절한 http 상태 코드와 메시지 응답
       if (err) return res.sendStatus(403);
    })
    console.log(token);
    next();
}

// 참고사항
// jsonwebtoken 모듈의 메서드와 옵션에 대해 사전학습
// 클라이언트 또는 API 테스트 도구를 통해 로컬에서 서버 테스트 가능


// 서버가 4000번 포트에서 듣기를 시작합니다. 서버가 시작되면 콘솔에 메시지를 출력합니다.
const port = 4000;
app.listen(port, () => {
    console.log(`✅ listening on port ${HOST}:${port} 🚀`);
});
