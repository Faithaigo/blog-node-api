const express = require('express')

const router = express.Router()

const feedController = require('../conntrollers/feed')

router.get('/posts', feedController.getPosts)

router.post('/post', feedController.postPosts)

module.exports = router