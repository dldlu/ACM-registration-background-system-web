import request from "@/utils/request";

// 登录方法
export function login(number, password) {
  const data = {
    number,
    password,
  };
  return request({
    url: "/user/login/adminitrator",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}
