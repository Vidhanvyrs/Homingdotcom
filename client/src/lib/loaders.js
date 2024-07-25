import { defer } from "react-router-dom";
import apiRequest from "./apiRequest.js";
//going to use react router dom inordr to use fetching of the data just like we used react query
export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  // console.log(request)
  //getting the url using ?
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query); //goin to remove await for using defer from react router dom
  //   return res.data;
  return defer({
    postResponse: postPromise, //our post response which we are sending to show it in frontend
  });
  // const res = await apiRequest("/posts/" + params.id);
  // return res.data;
};

//profile page loader
export const profilePageLoader = async () => {
  const postPromise = await apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise, //our post response which we are sending to show it in frontend
  });
};
