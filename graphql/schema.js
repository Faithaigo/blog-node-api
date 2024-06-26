const {buildSchema} = require('graphql') //build schema that can be parsed by graphql and graphql-http

module.exports = buildSchema(`
    type Post{
        _id :ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    input postInputData{
        title: String!
        content: String!
        imageUrl: String!
    }
    type User{
        _id: ID!
        name: String!
        email:String!
        password:String
        status: String!
        posts : [Post!]!
    }
    type AuthData{
        token:String!
        userId:String!
    }
    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }
    input userInputData{
        email:String!
        name:String!
        password:String!
    }
    type RootQuery {
        login(email:String!, password:String!) : AuthData!
        getPosts(page:Int): PostData!
    }
    type RootMutation{
        createUser(userInput: userInputData): User!
        createPost(postInput:postInputData!): Post!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)