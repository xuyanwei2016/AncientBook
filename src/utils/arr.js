 /**
  * @Author:      skyeGao
  * @Email:       yyjzp1314@126.com
  * @DateTime:    2019-04-07 23:51:24
  * @Description: 数组相关 
  */
 
'use strict';
import _ from 'lodash'
var arrayToTree = require('array-to-tree');

// 数组转成树结构
export const arr2tree = (arr, rules) => {
  let newArr = arr.map((item)=>{
    const parent_id_key = rules && rules.parent_id ? rules.parent_id : 'parentId'
    let parentId = `${item[parent_id_key]}` === '-1' ? undefined : item[parent_id_key];

    let obj;
    if(!rules){
      obj = {
        id: item.id,
        key: item.id,
        value: item.id,
        parent_id: parentId,
        type: item.type,
        label: item.name
      }
    }else{
      obj = {};

      Object.keys(rules).forEach((key)=>{
        let itemKey = rules[key];
        obj[key] = item[itemKey]
      })
      obj.parent_id = parentId;
    }
    return obj

  })
  return arrayToTree(newArr);
}

// 树结构平铺成数组
export const tree2Arr = (tree) => {
  let queen = []
  const result = []
  queen = queen.concat(tree)
  while (queen.length) {
    const first = queen.shift()
    if (first.children) {
      first.children.forEach(item => {
        item.pid = first.id
      })
      queen = queen.concat(first.children)
      delete first['children']
    }
    result.push(first)
  }
  return result
}
