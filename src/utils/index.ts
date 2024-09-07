import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es';
import type { App, Component, Plugin } from 'vue';
import { isArray, isObject } from './is';

export function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)?.[0] : undefined
}
/**
 * 将文件文件名转为文件类型判断
 */
export function parseMimeTypeToIconName(fileName, isType?) {
  if (!fileName) {
    return '';
  }
  const ext = getFileExtension(fileName)?.toLowerCase()
  if (!ext) {
    return '';
  }
  if (['png', 'jpg', 'jpeg', 'ico', 'gif', 'bmp', 'webp'].includes(ext)) {
    if (isType) {
      return "1"
    }
    return 'iconImg';
  }
  if (['mp4', 'avi', 'wmv', 'rmvb', '3gp', 'mov', 'm4v', 'flv', 'mkv'].includes(ext)) {
    if (isType) {
      return "2"
    }
    return 'iconVideo';
  }
  if (ext === 'pdf') {
    if (isType) {
      return "3"
    }
    return 'iconPdf';
  }
  if (['pptx', 'ppt', 'pptm'].includes(ext)) {
    if (isType) {
      return "4"
    }
    return 'iconPpt';
  }
  if (['docx', 'doc', 'docm', 'dot', 'dotx'].includes(ext)) {
    if (isType) {
      return "5"
    }
    return 'iconWord';
  }
  if (['csv', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xltx'].includes(ext)) {
    if (isType) {
      return "6"
    }
    return 'iconExcel';
  }
  
  // if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'tar.gz', 'tar.xz'].includes(ext)) {
  //   return 'file-type-zip';
  // }
  // if (['mp3', 'wav'].includes(ext)) {
  //   return 'file-type-music';
  // }
  // if (
  //   ['vue', 'js', 'go', 'java', 'ts', 'css', 'html', 'php', 'c', 'cpp', 'swift', 'kt'].includes(ext)
  // ) {
  //   return 'file-type-code';
  // }
  // if (['markdown', 'md', 'txt'].includes(ext)) {
  //   return 'file-type-txt';
  // }
  return 'file-type-unknown';
}

/**
 *
 * byte to size
 * formatBytes(1024);       // 1 KB
 * formatBytes('1024');     // 1 KB
 * formatBytes(1234);       // 1.21 KB
 * formatBytes(1234, 3);    // 1.205 KB
 * @param {number} bytes file size
 */
export function formatSizeUnits(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: "union" | "intersection" | "concat" | "replace" = "replace"
): T & U {
  if (!target) {
    return source as T & U
  }
  if (!source) {
    return target as T & U
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case "union":
          return unionWith(sourceValue, targetValue, isEqual)
        case "intersection":
          return intersectionWith(sourceValue, targetValue, isEqual)
        case "concat":
          return sourceValue.concat(targetValue)
        case "replace":
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays)
    }
    return undefined
  })
}

export const withInstall = <T>(component: Component<T>, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}
