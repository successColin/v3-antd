import { request } from '@/utils/request';

// 获取当前登陆人班级-年级
export async function getClassGrades() {
  return request('sso/classGrades', {
    method: 'get',
  });
}

// 获取课件列表
export async function getCourseList(params) {
  return request('course/queryCourseList', {
    method: 'get',
    params
  });
}


// 新增课本篇章节
export async function addCourse(data) {
  return request('course/add', {
    method: 'post',
    data
  });
}

// 修改课本篇章节
export async function editCourse(data) {
  return request('course/edit', {
    method: 'post',
    data
  });
}

// 删除课本篇章节
export async function delCourse(data) {
  return request('course/delete', {
    method: 'post',
    data
  });
}