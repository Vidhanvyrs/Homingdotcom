import apiRequest from "./apiRequest.js";
//going to use react router dom inordr to use fetching of the data just like we used react query
export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
