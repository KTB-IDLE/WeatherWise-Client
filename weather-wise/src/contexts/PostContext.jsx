// src/contexts/PostContext.jsx
import React, { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const setAllPosts = (newPosts) => {
    setPosts(newPosts);
  };

  return (
    <PostContext.Provider value={{ posts, setAllPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};
