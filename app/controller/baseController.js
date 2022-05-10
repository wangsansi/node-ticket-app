var STS = require('qcloud-cos-sts');
var COS = require('cos-nodejs-sdk-v5');
// 配置参数
var config = {
    // secretId: process.env.GROUP_SECRET_ID,   // 固定密钥
    // secretKey: process.env.GROUP_SECRET_KEY,  // 固定密钥
    secretId: '对象存储secretId',
    secretKey: '对象存储secretKey',
    proxy: '',
    host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    durationSeconds: 1800,  // 密钥有效期
    // 放行判断相关参数
    bucket: 'bucket名称', // 换成你的 bucket
    region: 'bucket 所在地区', // 换成 bucket 所在地区
    allowPrefix: '文件存储路径', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    allowActions: [
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload',
        // 下载
        'name/cos:GetObject'
    ],
};

module.exports={
    getAuthorization: (req,res)=>{
        var shortBucketName = config.bucket.substr(0 , config.bucket.lastIndexOf('-'));
        var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
        var { Method,Pathname } = req.body
        var policy = {
            'version': '2.0',
            'statement': [{
                'action': config.allowActions,
                'effect': 'allow',
                'principal': {'qcs': ['*']},
                'resource': [
                    'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
                ],
            }],
        };
        STS.getCredential({
            secretId: config.secretId,
            secretKey: config.secretKey,
            proxy: config.proxy,
            durationSeconds: config.durationSeconds,
            policy: policy,
        }, function (err, tempKeys) {
            var Authorization = COS.getAuthorization({
                SecretId: config.secretId,
                SecretKey: config.secretKey,
                Method,
                Pathname,
                Expires: 60
            })
            if (err) {
                console.log('err',err)
                res.send({
                    code:1000,
                    msg: '获取签名失败'
                })
                return
            }
            if (tempKeys) {
                let credentials =tempKeys.credentials
                let data = {
                    SecurityToken:credentials.sessionToken,
                    Authorization: COS.getAuthorization({
                        SecretId: credentials.tmpSecretId,
                        SecretKey: credentials.tmpSecretKey,
                        Method,
                        Pathname
                    })
                }
                res.send({
                    code:0,
                    msg: 'ok',
                    data
                })
            } else {
                res.send({
                    code:1000,
                    msg: '获取签名失败'
                })
            }
        });
    },
    getCredential: (req,res)=>{
        try{
            var shortBucketName = config.bucket.substr(0 , config.bucket.lastIndexOf('-'));
            var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
            var policy = {
                'version': '2.0',
                'statement': [{
                    'action': config.allowActions,
                    'effect': 'allow',
                    'principal': {'qcs': ['*']},
                    'resource': [
                        'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
                    ],
                }],
            };
            STS.getCredential({
                secretId: config.secretId,
                secretKey: config.secretKey,
                proxy: config.proxy,
                durationSeconds: config.durationSeconds,
                policy: policy,
            }, function (err, tempKeys) {
                console.log(err)
                var result = JSON.stringify(err || tempKeys) || '';
                console.log(err)
                res.send({
                    code:0,
                    msg: 'ok',
                    data:result
                })
            })
        } catch(err){
            console.log('[getCredentialErr]:',err)
            res.send({
                code:1000,
                msg: '错误'
            })
        }
       
    },
    getBucketInfo: (req,res)=>{
        res.send({
            code:0,
            msg: 'ok',
            data:{
                bucket: '自己的存储桶名称',
                region: '自己的存储桶所在地区'
            }
        })
    }
}