const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json()); // JSON 파싱을 위해 추가

// GET 요청 처리 - 네이버 장소 검색 API
app.get('/naver/search', async (req, res) => {
  try {
    const { text } = req.query;
    
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: {
        query: text,
        display: 5,
        start: 1,
        sort: 'random'
      },
      headers: {
        'X-Naver-Client-Id': 'nfiMlVtIR8DmtDMqhvpO',
        'X-Naver-Client-Secret': 'Tkg91YuVMY',
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Naver API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET 요청 처리 - 네이버 지도 경로 API
app.get('/naver/direction', async (req, res) => {
  try {
    const { start, goal, option } = req.query;
    
    const response = await axios.get(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': 'sr9ox19ub6',
        'X-NCP-APIGW-API-KEY': 'V8pEuKAgZB1sHY6RvcVKELtaBEJPFjliZNfUiARg',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Naver Map Direction API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // GET 요청 처리 - 네이버 지도 경로 이미지 API
// app.get('/naver/direction-map', async (req, res) => {
//   try {
//     const { w, h, center, level } = req.query;
    
//     const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-static/v2/raster', {
//       params: {
//         w,
//         h,
//         center,
//         level,
//       },
//       headers: {
//         'X-NCP-APIGW-API-KEY-ID': 'sr9ox19ub6',
//         'X-NCP-APIGW-API-KEY': 'V8pEuKAgZB1sHY6RvcVKELtaBEJPFjliZNfUiARg',
//       },
//     });

//     res.set('Content-Type', 'image/png');
//     res.send(response.data);
//   } catch (error) {
//     console.error('Error fetching route map:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// GET 요청 처리 - 네이버 지도 경로 이미지 API
app.get('/naver/direction-map', async (req, res) => {
  try {
    const { w, h, center, level } = req.query;
    
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-static/v3/raster', {
      params: {
        w,
        h,
        center,
        level,
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': 'sr9ox19ub6',
        'X-NCP-APIGW-API-KEY': 'V8pEuKAgZB1sHY6RvcVKELtaBEJPFjliZNfUiARg',
      },
      responseType: 'arraybuffer', // 이미지 데이터를 ArrayBuffer로 받아오기 위해 responseType을 지정합니다.
    });

    // 받아온 이미지 데이터를 클라이언트에게 전송합니다.
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching route map:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});