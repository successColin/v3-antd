import CryptoJS from 'crypto-js/crypto-js';

/*
 * 默认的 KEY IV     如果在加密解密的时候没有传入KEY和IV,就会使用这里定义的
 *
 * 前后端交互时需要前后端密钥和初始向量保持一致
 */

const KEY = CryptoJS.enc.Utf8.parse("zjkmsso!@#$%^&*(");//  密钥        长度必须为16位
const IV = CryptoJS.enc.Utf8.parse("ixfdapf075qmunp9");           //  初始向量    长度随意

/*
 * AES加密 ：字符串 没值不执行
 */
export function execEncrypt(str) {
    if (str) {
        return Encrypt(str)
    } else {
        return str
    }
}

/*
 * AES解密 ：字符串 没值不执行
 */
export function execDecrypt(str) {
    if (str) {
        return Decrypt(str)
    } else {
        return str
    }
}

/*
 * AES加密 ：字符串 key iv  返回base64
 */
function Encrypt(str) {
    let key = KEY
    let iv = IV
    // keyStr, ivStr
    // if (keyStr && ivStr) {
    //     key = CryptoJS.enc.Utf8.parse(keyStr);
    //     iv = CryptoJS.enc.Utf8.parse(ivStr);
    // }
    let srcs = CryptoJS.enc.Utf8.parse(str);
    var encrypt = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,            //这里可以选择AES加密的模式
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

/*
 * AES 解密 ：字符串 key iv  返回base64
 */
function Decrypt(str) {
    let key = KEY
    let iv = IV

    // , keyStr = '', ivStr = ''
    // if (keyStr && ivStr) {
    //     key = CryptoJS.enc.Utf8.parse(keyStr);
    //     iv = CryptoJS.enc.Utf8.parse(ivStr);
    // }

    let base64 = CryptoJS.enc.Base64.parse(str);
    let src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,            //这里可以选择AES解密的模式
        padding: CryptoJS.pad.Pkcs7
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
