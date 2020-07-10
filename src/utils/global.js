export const requestPath = {
    common: '/sysuser/bg',
    book: '/book/bg',
    content: 'content/bg',
    stock: '/repertory/bg',
    marketing: '/marketing/bg',
    order: '/order/bg',
    resource: '/resource/bg',
    third: '/third',
    file: '/file/file/',
    works: '/works/bg',
    ftp:'/file/ftp',
    statistics:'/statistics/bg',
    pdf:'/pdf/file',
  newbook:'/newbook/bg',
        // ipPort:'http://122.14.50.6:8096',
        // ipPort:'http://192.168.2.7:8096',
}

// export const uploadUrl = `http://rsks.class.com.cn/file/`
export const uploadUrl =  `${process.env.BASE_API}/file/file/`
    // BASE_API: '"http://rsks.class.com.cn"'
export const downloadPath = 'download'
export const uploadPath = 'upload'
