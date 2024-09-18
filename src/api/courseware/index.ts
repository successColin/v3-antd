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
  return request(`course/${data.courseBookId}/tree`, {
    method: 'post',
    data
  });
}

// 批量新增课件
export async function addBatchCourseware(data) {
  return request('courseware/batch/add', {
    method: 'post',
    data
  });
}

// 批量删除课件
export async function delCourseware(data) {
  return request('courseware/chapter/delete', {
    method: 'post',
    data
  });
}

// 理论题库
// 题型分值配置查询
export async function getExerciseConfig() {
  return request('exercise/typeScore/config', {
    method: 'get',
  });
}

// 分页查询题目列表
export async function getExerciseList(data) {
  return request('exercise/queryByPage', {
    method: 'post',
    data
  });
}