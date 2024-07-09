const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const Post = require('../models/post')
const FeedController = require('../controllers/feed')


describe('Feed controller', function () {
    let userId;
    before(async function() {
        await mongoose.connect("mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/test-messages?w=majority")
        const user = new User({
            email:'admin256@gmail.com',
            password:'password1',
            name:'Test Admin',
                posts:[]
            })
        const savedUser = await user.save()
        userId=savedUser._id.toString()
    })
    after(async function () {
        await User.deleteMany({})
        await mongoose.disconnect()  
    })
    it('should add a created post to the post of the creator', async function () {

        const req = {
            body:{
                title:'Test post',
                content:'Test content'
            },
            file:{
                path:'abc'
            },
            userId
        }
        const res = {
            status:function(){
            return this
            }, 
            json:function(){}
        }

       const savedUser =  await FeedController.createPost(req, res, ()=>{})
       expect(savedUser).to.have.property('posts')
       expect(savedUser.posts).to.have.length(1)
    })

})