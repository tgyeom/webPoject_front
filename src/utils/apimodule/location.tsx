import api from "../api/Instance";

import location from "../api/locationInstance";

/**
 * 길찾기 결과값을 보여주기 위한 get요청
 * @param locationTransport
 * @param locationDirection
 * @returns
 */
const locationResultResponse = async () => {
  try {
    const response = await api.get("/location/result");
    const direction = response.data.locationDirection;
    console.log(direction.locationTransport, direction.locationTime);
    return { success: true, direction };
  } catch (error) {
    console.error("error:", error);
    return { success: false, error: "요청 실패" };
  }
};

/**
 * 출발지 입력
 * @param text
 * @returns
 */
const searchNaverPlaces = async (text: any) => {
  try {
    const response = await location.get("/v1/search/local.json", {
      params: {
        query: text,
        display: 5,
        start: 1,
        sort: "random",
      },
      headers: {
        "X-Naver-Client-Id": "nfiMlVtIR8DmtDMqhvpO",
        "X-Naver-Client-Secret": "Tkg91YuVMY",
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    if (response.status === 200) {
      return { suceess: true, data };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching data from Naver API: ", error);
    throw new Error("Internal server error");
  }
};

// 네이버 지도 경로 API 호출 함수 (tr)
const getNaverMapDirection = async (start: any, goal: any, option: any) => {
  try {
    const response = await location.get(
      `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": "sr9ox19ub6",
          "X-NCP-APIGW-API-KEY": "V8pEuKAgZB1sHY6RvcVKELtaBEJPFjliZNfUiARg",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Naver Map Direction API:", error);
    throw new Error("Internal server error");
  }
};

// 네이버 지도 경로 이미지 API 호출 함수
const getNaverDirectionMap = async (
  w: any,
  h: any,
  center: any,
  level: any
) => {
  try {
    const response = await location.get(
      "https://naveropenapi.apigw.ntruss.com/map-static/v3/raster",
      {
        params: {
          w,
          h,
          center,
          level,
        },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": "sr9ox19ub6",
          "X-NCP-APIGW-API-KEY": "V8pEuKAgZB1sHY6RvcVKELtaBEJPFjliZNfUiARg",
        },
        responseType: "arraybuffer", // 이미지 데이터를 ArrayBuffer로 받아오기 위해 responseType을 지정합니다.
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching route map:", error);
    throw new Error("Internal server error");
  }
};

/**
 * 대중교통 경로
 * @param SX
 * @param SY
 * @param EX
 * @param EY
 * @returns
 */
const getOdsayRoute = async (SX: any, SY: any, EX: any, EY: any) => {
  try {
    const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${SX}&SY=${SY}&EX=${EX}&EY=${EY}&OPT=1&apiKey=ROqhJXXjx3uvKLQ5iNtT7rdI1ilUdJD%2BmWOtlnPs%2Fag`;
    const response = await location.get(url);
    const data = response.data;

    if (response.status === 200) {
      return { success: true, data };
    } else {
      return { success: false, data };
    }
  } catch (error) {
    console.error("Error fetching data from ODSAY API:", error);
    throw new Error("Internal server error");
  }
};

export {
  // mappingLocation,
  locationResultResponse,
  searchNaverPlaces,
  getNaverDirectionMap,
  getNaverMapDirection,
  getOdsayRoute,
};
