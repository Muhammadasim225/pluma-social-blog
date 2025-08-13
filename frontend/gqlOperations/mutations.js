import { gql } from "@apollo/client"
export const LIKE_POST=gql`mutation likesPost($insertData:enterLikeData!){
  likesPost(insertData:$insertData){
        likesCount
    title,
    description
    user{
      full_name
    }
    tags{
      text
    }  
  }
}`

export const LOGIN_USER=gql`mutation loginUser($registeredUser:enterLoginDetails!){
  loginUser(registeredUser:$registeredUser){
    token
    } 
  } 
`

export const SIGNUP_USER=gql`
mutation createUser($userNew:UserInput!){
  signUpUser(userNew:$userNew){
      full_name,
      email_address,
      password
  }
}`

export const CREATE_BLOG=gql`
mutation BlogPostCreation($insertContent: enterAllDetails!) {
  createBlogPost(insertContent: $insertContent) {
    title
    description
    cover_img
    user { 
      full_name
    }
    tags {
      text
    }
    readTime
  }
}

`
export const EDIT_OUR_PROFILE = gql`mutation EditProfile($editData: EditProfileInput!) {
  edit_profile(editData: $editData) {
    about_Us
    twitter_link
    github_link
    linkedin_link
    user {
      full_name
      email_address
      username
      profile_pic
    }
  }
}
`;

export const COMMENT_POST=gql`
mutation createComment($insertCommentData:enterCommentData!){
 commentPost(insertCommentData: $insertCommentData) {
    comments {
      text
    }
  }
  }
`
export const FOLLOW_OTHER_USER=gql`mutation followUser($insertFollowingData:enterFollowingData!){
  followOtherUser(insertFollowingData:$insertFollowingData){
    follower{
      id,
      email_address
      full_name
    },
    following{
      id,
      email_address
      full_name

    }  }
}`

export const DELETE_ACCOUNT=gql`mutation {
  deleteAccount {
    email_address
  }
}`
