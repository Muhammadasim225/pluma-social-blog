import { gql } from "@apollo/client"
export const GET_ALL_POSTS=gql`query getAllBlogPosts{
  posts{
    id,
    title
    likesCount
    commentCount
    description
    createdAt
    cover_img
    readTime
      user {
      id
      full_name
      email_address
      password
      profile_pic
      },
    tags{
      text
    }
  }
}`


export const GET_OTHER_USER_BY_ID=gql`query GetOtherSingleUser($insertId:enterIdData!) {
    getOtherSingleUser(insertId: $insertId) {
    id
      full_name
    email_address
    profile_pic
      username
    followerCount
    followingCount
    postCount
     followers {
      follower{
        id
        full_name
      }
    }
    following{
      following{
        id
        full_name
      }
    }
      posts {
        id
        title
        description
        cover_img
         tags {
            text 
        }
        readTime
        createdAt
        likesCount
        views
      }
    }
  }`

  export const GET_OUR_FOLLOWER_COUNT=gql`query getOurFollowerCount{
  getOurFollowerCount
}`

export const GET_OUR_FOLLOWING_COUNT=gql`query getOurFollowingCount{
  getOurFollowingCount 
}`

export const GET_FOLLOWING_USER_POST=gql`
query getFollowingUserPosts {
  getFollowingUserPosts {
    id
    title
    description
    readTime
    createdAt
    cover_img
    likesCount
    commentCount
    user {
      id
      full_name
      profile_pic
      email_address
      username
    }
    tags {
      text
    }
  }
}
`
export const GET_POST_BY_ID=gql`query getPostById($addId:inputAddId!){
  post(addId:$addId){
    id
    title
    description
    createdAt
    cover_img
    readTime
    likesCount
    views
    commentCount
    tags{
      text
    }
    user{
      id
      full_name
      email_address
      username
      profile_pic
      profile{
        about_Us
      }
       followers {
        follower {
          id
          full_name
          username
          profile_pic
        }
        createdAt
      }
        
}  
    comments{
      text
      user{
        full_name
        profile_pic
      }
      createdAt 
    }    
  }
}`

export const GET_USER_BY_ID=gql`query getUserById{
  user{
    full_name,
    profile_pic
    email_address,
    username,
    profile{
      about_Us,
      linkedin_link,
      github_link,
      twitter_link
    } 
}
}`


export const SEARCH_RESULTS=gql`query SearchPosts($keywords: String!) {
  searchPosts(keywords: $keywords) {
  id
    title,
    description,
    cover_img,
    likesCount
    commentCount
    createdAt
    readTime
    user{
      full_name
    },
    tags{
    text
  }
  }
}`

export const GET_RELATED_POSTS=gql`query getRelatedBlogPosts($addRelatedId:inputAddTheId!){
  getRelatedBlogPosts(addRelatedId:$addRelatedId){
    id
    title
    description
    createdAt
    cover_img
    readTime
    likesCount
    views
    commentCount
    tags{
      text
    }
    user{
      id
      full_name
      email_address
      username
      profile_pic
      profile{
        about_Us
      }
    }
    comments{
      text
      user{
        full_name
        profile_pic
      }
      createdAt 
    }    
  }
}`

export const GET_TRENDING_POSTS=gql`query getRelatedBlogPosts{
  posts{
    id,
    title,    
    description,
    cover_img
    readTime
       user {
        id
      full_name
      email_address
      password
      profile_pic
      },
    tags{
      text
    },
    likesCount,
    commentCount,
    createdAt
  }
}`

export const GET_POPULAR_POSTS=gql`query popularPosts{
  posts {
    id
    title
    readTime
    createdAt
    user {
      id
      full_name
    }
  }
}
`

