import { request } from '@/utils/request';

// 获取课件列表
export async function getCourseList(params) {
  return request('course/queryBookList', {
    method: 'get',
    params
  });
}

// 新增课本篇章节
export async function addCourse(data) {
  return request('course/book/add', {
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

// 指定课本树结构
export async function getCourseBookTree(data) {
  console.log(data)
  return request(`course/${data.courseBookId}/tree`, {
    method: 'post',
    data
  });
}