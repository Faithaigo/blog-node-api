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
    type UserStatus {
        status: String!
    }
    type RootQuery {
        login(email:String!, password:String!) : AuthData!
        getPosts(page:Int): PostData!
        getPost(postId:ID!): Post!
        userStatus: UserStatus!
    }
    type DeletePost {
        message: String!
    }
    type RootMutation{
        createUser(userInput: userInputData): User!
        createPost(postInput:postInputData!): Post!
        updatePost(id:ID!, postInput:postInputData!): Post!
        deletePost(id:ID!): DeletePost!
        updateStatus(status: String!): UserStatus!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)