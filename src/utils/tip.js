/**
 * @Author:      skyeGao
 * @Email:       yyjzp1314@126.com
 * @DateTime:    2019-03-27 23:51:24
 * @Description: Description 
 */

import { Message } from 'element-ui'

export const modifySuccess = (msg, time=3)=>{
  Message({
    message: msg,
    type: 'success',
    duration: time * 1000
  })
}

export const success = (time=3)=>{
  Message({
    message: "操作成功",
    type: 'success',
    duration: time * 1000
  })
}

export const modifyFail = (msg, time=3)=>{
  Message({
    message: '修改失败，'+(msg||'服务器错误'),
    type: 'error',
    duration: time * 1000
  })
}

export const errorMessage = (msg, time=3) => {
  Message({
    message: msg,
    type: 'error',
    duration: time * 1000
  })
}

export const warningMessage = (msg, time=3) => {
  Message({
    message: msg,
    type: 'warning',
    duration: time * 1000
  })
}