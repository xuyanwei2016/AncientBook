export function getMultipleSelectionIDs(selections, idName = 'id') {
    if ( Boolean(selections[0]) && selections.length > 0 ) {
        return [...new Set(selections.map(item => item[idName]))]
    } else {
        return []
    }
}

export function getMaxSort(arr, key = 'sort') {
  return arr.reduce((maxNum, item) => Math.max(maxNum, item[key]), 0)
}

export function insertBtnRes(modules, arr) {
    modules.forEach(item => {
        item.disabled = true
        if (item.children.length === 0) {
            const val = arr.filter(arg => arg.mpId === item.id)
            if (val.length > 0) {
                item.children = val
            }
        } else {
            insertBtnRes(item.children, arr)
        }
    })
}
//跟上面的方法一样就是去掉disabled = true,
//上面也不知道哪里用了
//写个新的打开角色管理设置权限里面的全选
export function insertBtnResUndis(modules, arr) {
    modules.forEach(item => {
        //item.disabled = true
        if (item.children.length === 0) {
            const val = arr.filter(arg => arg.mpId === item.id)
            if (val.length > 0) {
                item.children = val
            }
        } else {
            insertBtnResUndis(item.children, arr)
        }
    })
}
export function deleteString(oArr, dArr) {
    return oArr.filter(obj => dArr.indexOf(obj) === -1)
}

export function deleteItems(oArr, dArr, key = 'id') {
    return oArr.filter(obj => dArr.map(item => item[key]).indexOf(obj[key]) === -1)
}

export function removeDuplicates(myArr, key = 'id') {
    return myArr.filter((obj, idx) => myArr.map(item => item[key]).indexOf(obj[key]) === idx)
}