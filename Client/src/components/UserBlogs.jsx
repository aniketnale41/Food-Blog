import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import "./userBlogs.css";

import { Link, useNavigate } from "react-router-dom";
import UserBlogView from "./UserBlogOpearations/UserBlogView";
import UserBlogDelete from "./UserBlogOpearations/UserBlogDelete";
import MDEditor from "@uiw/react-md-editor";
import Navbar from "./Navbar";

function UserBlogs(blogId) {
  const [userData, setUserData] = useState({});
  const [userBlogs, setUserBlogs] = useState([]);

  // const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };

  useEffect(() => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const path = `/blog/user/:userId/blogs`;

      // Decode the token to get user information
      // const decodedToken = jwtDecode(token);
      // const userIdFromToken = decodedToken.payload.userId;
      // setLoggedIn(true);

      // Fetch user details and blogs together
      axios
        .get(apiBaseUrl + path, {
          withCredentials: true,
        })
        .then((response) => {
          const sortedBlogs = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUserBlogs(sortedBlogs);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }, [navigate]);

  console.log(userBlogs);

  const formatDate = (timeStamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeStamp).toLocaleString("en-US", options);
  };

  return (
    <div>
      <div className="mb-10">
        <Navbar />
      </div>
      <div>
        {userBlogs.map((blog, index) => (
          <div className=" max-w-3xl mx-auto " key={index}>
            <div className="bg-white rounded-sm overflow-hidden shadow-custom mb-2 hover:transform scale-105 transition-transform duration-300">
              {/*Always perfome the checks if to see if the item is present*/}
              {blog.image && blog.image.contentType && (
                <img
                  className=" w-full h-32 object-cover objct-center"
                  src={`data:${blog.image.contentType};base64,${Buffer.from(
                    blog.image.data.data
                  ).toString("base64")}`}
                  alt={blog.title}
                />
              )}
              <div className="px-6 py-4">
                <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">
                  {blog.title}
                </h1>
                <MDEditor.Markdown
                  source={blog.content}
                  style={{ whiteSpace: "pre-wrap" }}
                  className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                />
                <p className="text-gray-600 md:text-lg">
                  Created on:{formatDate(blog.createdAt)}
                </p>
              </div>
              <div className="mb-5 px-6">
                <Link to={`/home/userId/View/${blog._id}`}>
                  <button>ViewBlog</button>|
                </Link>
                <Link to={`/home/userId/Edit/${blog._id}`}>
                  <button>EditBlog</button>
                </Link>
                |
                <UserBlogDelete blogId={blog._id} key={blog._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBlogs;
