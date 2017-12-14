const fs = require('fs')

exports.readFileAsync = function (fpath, encoding) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fpath, encoding, function (err, content) {
      if (err)
        reject(err);
      else
        resolve(content);
    })
  })
}

exports.writeFileAsync = function (fpath, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fpath, content, function (err) {
      if (err)
        reject(err);
      else
        resolve();
    })
  })
}
/**
 * [连字符转驼峰]
 * stu_id --> stuId
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
exports.hyphenToHump = (str) => {
  return str.replace(/_(\w)/g, (...args) => {
    return args[1].toUpperCase();
  });
}
/**
 * [驼峰转连字符]
 * stuId -> stu_id
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
exports.humpToHyphen = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}