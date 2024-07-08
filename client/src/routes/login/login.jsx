import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext.jsx";

function Login() {
  //for showing error
  const [error, setError] = useState("");
  //disble the login button until request gets a response
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);

  //as soon as user registers itself route them to login page
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    //sending our formdata to the backend api
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // console.log(username, email, password);
    try {
      //using localhost api url to post the data of our new user
      const res = await apiRequest.post(
        "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      // console.log(res.data);
      //now as we got our userinfo from the server we will store it in LocalStorage to use it for our profile page
      // localStorage.setItem("user", JSON.stringify(res.data));

      //here we are taking care of localStorage in our context
      updateUser(res.data);
      
      navigate("/");
    } catch (error) {
      // console.log(err);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
