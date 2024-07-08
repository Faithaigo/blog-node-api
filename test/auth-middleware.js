const isAuth = require('../middlware/is-auth')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon  = require('sinon')


describe('Auth middleware',()=>{
    it('Should throw an error if no authorization header is provided',function() {
        const req = {
            get: function() {
                return null
            }
        }
        //passing prepared reference to expect
        expect(isAuth.bind(this,req, {},()=>{})).to.throw('Not authenticated.')
    })

    it('It should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz'
            }
        }
        expect(isAuth.bind(this,req, {},()=>{})).to.throw()
    })

    it('should yield a user id after decoding the token',()=>{
        const req = {
            get: function() {
                return 'Bearer xyz'
            }
        }
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'})
        isAuth(req, {},()=>{})
        expect(req).to.have.property('userId')
        expect(req).to.have.property('userId', 'abc')
        expect(jwt.verify.called).to.be.true
        jwt.verify.restore()
    })

    it('should throw an error if the token cannot be verified',()=>{
        const req = {
            get: function() {
                return 'Bearer xyz'
            }
        }
        expect(isAuth.bind(this,req, {},()=>{})).to.throw()
    })


})

