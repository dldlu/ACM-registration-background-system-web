import request from "@/utils/request";

// 查询列表
/**
 *
 * @param query
 * @returns {
 *                 "id": 26,
 *                 "student_number": "S001",
 *                 "student_name": "张三",
 *                 "major_class": "计算机科学与技术",
 *                 "sex": "男",
 *                 "qq": "123456",
 *                 "phone": "1234567890",
 *                 "email": "zhangsan@example.com",
 *                 "year": 2023,
 *                 "last_ip": "192.168.1.1",
 *                 "sign_time": "2023-10-06T18:08:29+08:00",
 *                 "status": 1
 *             },
 */
export function listInfo(query) {
  return request({
    url: `/info/applicants/${query.pageSize}/${query.pageNum}`,
    method: "get",
  });
}

// 查询项目管理详细
export function getInfo(infoId) {
  return request({
    url: "/info/applicant/" + infoId,
    method: "get",
  });
}

// 新增
/**
 *
 * @param data{
 *     "id": 79,
 *     "sex": "女",
 *     "major_class": "ex",
 *     "student_name": "基头基志际",
 *     "student_number": "83",
 *     "phone": "18179345982",
 *     "qq": "",
 *     "year": 7,
 *     "email": "g.fhlkx@qq.com",
 *     "last_ip": "47.68.44.203",
 *     "status": 44
 * }
 * @returns {*}
 */
export function addInfo(data) {
  return request({
    url: "/info/applicant",
    method: "post",
    data: data,
  });
}

// 修改
/**
 *
 * @param data{
 *     "id": 79,
 *     "sex": "男",
 *     "major_class": "ex",
 *     "student_name": "基头基志际",
 *     "student_number": "83",
 *     "phone": "18179345982",
 *     "qq": "",
 *     "year": 7,
 *     "email": "g.fhlkx@qq.com",
 *     "last_ip": "47.68.44.203",
 *     "status": 44
 * }
 * @returns {*}
 */
export function updateInfo(data) {
  return request({
    url: "/info/applicant",
    method: "put",
    data: data,
  });
}

// 批量删除
/**
 * @param data  : "ids": [1,2,3,4,5]
 * @returns {*}
 */
export function delInfo(data) {
  return request({
    url: "/info/applicant",
    method: "delete",
    data: data,
  });
}

export function ListByYear(year, halfYear, query) {
  return request({
    url: `/info/applicant/${year}/${halfYear}/${query.pageSize}/${query.pageNum}`,
    method: "post",
  });
}

export function Download(data) {
  return request({
    url: "/file/export",
    method: "post",
    data: data,
  });
}
