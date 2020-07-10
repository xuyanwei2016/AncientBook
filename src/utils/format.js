export function formatTree(arr){
  arr.forEach(item => {
    if (item.children.length>0) {
      item.disabled = true
      formatTree(item.children)
    }
  })
}

export function formatOptions(arr) {
  let formatArr = []
  function formatFun(arr) {
    arr.forEach(item => {
      const { departmentId: deptId, departmentName: deptName } = item
      formatArr.push({ deptId, deptName })
      if (item.list.length > 0) {
        formatFun(item.list)
      }
    })
  }
  formatFun(arr)
  return formatArr
}