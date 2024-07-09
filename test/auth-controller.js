const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const AuthController = require('../controllers/auth')


describe('Auth Controlleer - Login', function () {
    before(async function() {
        await mongoose.connect("mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/test-messages?w=majority")
    })
    after(async function () {
        await User.deleteMany({})
        await mongoose.disconnect()  
    })
    it('should throw an error with code 500 if accessing the databasee fails', function (done) {
        sinon.stub(User, 'findOne')
        User.findOne.throws();

        const req = {
            body:{
                email:'test@test.com',
                password:'password1'
            }
        }

        AuthController.login(req, {}, ()=>{}).then(result=>{
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500)
            done() //mocha should wait to execute the test case until the promise has resolved
        })

        User.findOne.restore();
    })

    it('Should send a response with a valid user status for an existing user', async function() {
        try {
            const user = new User({
                email:'admin256@gmail.com',
                password:'password1',
                name:'Test Admin',
                    posts:[]
                })
            const savedUser = await user.save()
            const req = {userId:savedUser._id.toString()}
            const res = {
                statusCode:500,
                userStatus: null,
                status: function(code){
                    this.statusCode = code 
                    return this
                },
                json: function(data){
                    this.userStatus = data.status;
                }
            }
            await AuthController.getUserStatus(req, res, ()=>{}).then(()=>{
                expect(res.statusCode).to.be.equal(200)
                expect(res.userStatus).to.be.equal('I am new') 
            })
        } catch (err) {
            console.log(err)
        }

    })
})