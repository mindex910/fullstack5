import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(
        "loggedBlogUser", JSON.stringify(user)
      )
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleBlog = async (event) => {
    event.preventDefault()
    console.log("making a new blog:", title, author, url)
    try {
      await blogService.create({title, author, url})
      setTitle("")
      setAuthor("")
      setUrl("")
    }
    catch {
      setErrorMessage("something went wrong")
    }
  }

const logOut = () => {
  window.localStorage.removeItem("loggedBlogUser")
  console.log("logging out")
  setUser(null)
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={logOut}>logout</button></p>
      <h2>create new</h2>
      <form onSubmit={handleBlog}>
        <div>
          <label>
            title <input type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            author <input type="text" value={author} onChange={({target}) => setAuthor(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            url <input type="text" value={url} onChange={({target}) => setUrl(target.value)}/>
          </label>
        </div>
        <button>create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
