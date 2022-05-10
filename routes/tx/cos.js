const express = require('express')
const router = express.Router()
const baseController = require('../../app/controller/baseController')

router.get('/bucketInfo', baseController.getBucketInfo)
router.get('/sts', baseController.getCredential)
router.post('/authorization', baseController.getAuthorization)
module.exports = router