// 因此命名空间不带this 所以引入的时候要用  functionName.apply(this,[arg1,arg2])调用

/*
 ** 用法示例
 ** operationMsg.apply(this,[res.data,'修改'])
 */
export function operationMsg(data, msgName) {
    if (data.code === 0) {
        this.$message({
            type:'success',
            message: `${msgName}成功`,
            duration:1000
        })
        this.getList()
    } else {
        this.$message({
            type: 'error',
            message: `${msgName}失败`,
            duration: 1000
        })
    }
}

export function errorMsg(data, msg) {
    data.code === -2 ? this.$message.error(`${msg}失败：${data.msg}`) : this.$message.error(`${msg}失败`)
}

export function requestMsg(data, msgName) {
    if (data.code === 0) {
        this.$message.success(`${msgName}成功`)
        this.getList()
    } else if (data.code == -2) {
        this.$message.error(`${msgName}失败：${data.msg}`)
    } else {
        this.$message.error(`${msgName}失败`)
    }
}

export function returnMsg(data, msgName) {
    if (data.code === 0) {
        this.$message.success(`${msgName}成功`)
        this.getList()
    }else{
        this.$message.error(`${msgName}失败,${data.msg}`)
    } 
    // else if (data.code === -3 ) {
    //     this.$message.error(`${msgName}失败！${data.msg}`)
    // }
}
/*
 ** 用法示例
 ** confirm.apply(this,['确认xxx吗？','批量操作'])
 */
export function confirm(msg, title = '提示') {
    return this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
            // center: true
    })
}


//选择列表
export function checkSelect(arr) {
    if (arr.length === 0) {
        this.$message.warning('请先选择需要操作的条目')
        return false
    }
    return true
}
//时间比较
export function compareDate (s1,s2){
    let beginDate=new Date(s1);
    let endDate=new Date(s2);
    if(beginDate>endDate){
        return false
    }else{
        return true
    }
}

//处理数组
export function mergeObject(array) {

}
//根据id去重
export function uniqueArr(array){
    let newJson = []; //盛放去重后数据的新数组
    for(let i=0;i<array.length;i++){  //循环json数组对象的内容   
        let flag = true;  //建立标记，判断数据是否重复，true为不重复  
        let item1=array[i];
        for(let j=0;j<newJson.length;j++){  //循环新数组的内容   
            let item2=newJson[j]; 
            if(item1.id==item2.id){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                flag = false;
            }
        }  
        if(flag){ //判断是否重复
            newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
        }
    }
    return newJson
}


//字节单位转换成K,M,G
export function getFileSize(size) {
    if (!size)
        return "";
    var num = 1024.00; //byte
    if (size < num)
        return size + "B";
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "K"; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}