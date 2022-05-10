module.exports = {
    //数组去重
    uniqueArr: (arr) =>{
        return Array.from(new Set(arr))
    },
    checkIfNull:(obj,arr)=>{
        let nullArr = []
        for (let i of arr){
            if(obj[i] === undefined) {
                nullArr.push(i)
            }
        }
        return nullArr
    },
    checkID: (ID) => {
        if(typeof ID !== 'string') return '非法字符串';
        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
        var d = new Date(birthday);
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
        var currentTime = new Date().getTime();
        var time = d.getTime();
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var sum = 0, i, residue;
      
        if(!/^\d{17}(\d|x)$/i.test(ID)) return false;
        if(city[ID.substr(0,2)] === undefined) return false;
        if(time >= currentTime || birthday !== newBirthday) return false;
        for(i=0; i<17; i++) {
          sum += ID.substr(i, 1) * arrInt[i];
        }
        residue = arrCh[sum % 11];
        if (residue.toLowerCase() !== ID.substr(17, 1).toLowerCase()) return false;
      
        return true
    },
    //时间格式化处理
    dateFormat: (fmt,date) => {
        function addZero (x,n) {
            for (let i = 0; i < n; i++) {
                if (x.toString().length < n) {
                x = '0' + x;
                }
            }
            return x;
            }
        var o = {
        'M+': date.getMonth()+1,                 //月份
        'd+': date.getDate(),                    //日
        'h+': date.getHours(),                   //小时
        'm+': date.getMinutes(),                 //分
        's+': date.getSeconds(),                 //秒
        'q+': Math.floor((date.getMonth()+3)/3), //季度
        'S': addZero(date.getMilliseconds(),3)    //毫秒
        }
        if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
        return fmt
    }
}
