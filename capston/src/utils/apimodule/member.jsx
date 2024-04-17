import api from "../api/Instance";

/**
 * 유저 로그인 axios
 * @param {*} email
 * @param {*} pwd
 * @returns
 */

export const loginGetMeberId = async () => {
  try {
    const response = await api.get("/member/login");
    const result = response.data.loginId;
    console.log(result);
    return { success: true, result };
  } catch (error) {
    console.error("error:", error);
    return { success: false, error: "실패" };
  }
};
export const loginUser = async (email, pwd) => {
  try {
    const response = await api.post("/member/login", {
      memberEmail: email,
      memberPassword: pwd,
    });

    const memberId = response.data.memberid;
    localStorage.setItem("memberIdNumber", memberId);
    console.log(response.data);
    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("error:", error);
    return { success: false, error: "요청 실패" };
  }
};
/**
 * 유저 중복가입방지 axios
 * @param {*} signupEmail
 * @returns success
 */
export const signupVerify = async (email) => {
  try {
    const response = await api.post("/member/verify", {
      memberEmail: email,
    });

    if (response.data.success) {
      return { success: true, message: "사용하실 수 있는 이메일입니다." };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("error:", error);
    return { success: false, error: "요청 실패" };
  }
};

/**
 * 유저 회원가입 axios
 * @param {*} signupEmail
 * @param {*} signupPwd
 * @returns success
 */
export const signupUser = async (email, pwd) => {
  try {
    const response = await api.post("/member/save", {
      memberEmail: email,
      memberPassword: pwd,
    });

    console.log(email, pwd);

    if (response.data.success) {
      return { success: true, message: "회원가입 성공" };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("error:", error);
    return { success: false, error: "요청 실패" };
  }
};
