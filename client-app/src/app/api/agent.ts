import axios, { AxiosResponse, AxiosError } from "axios";
import { Activity } from "../models/activity";
import { Profile, Photo } from "../models/profile";
import { history } from "../..";
import { toast } from "react-toastify";
import { User, UserFormValues } from "app/models/user";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.log(error);
  if (error.message === "Network Error" && !error.response) {
    toast.error(error.message);
  }
  if (error.response) {
    const { status, data, config } = error.response;
    if (status === 404) {
      history.push("/notfound");
    }
    if (
      status === 400 &&
      config.method === "get" &&
      data.errors.hasOwnProperty("id")
    ) {
      history.push("/notfound");
    }
    if (status === 500) {
      toast.error(error.message);
    }
    throw error.response;
  }
});

const responseBody = (response: AxiosResponse) => response.data;

const timeoutMS = 1000;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) =>
    axios.get(url).then(sleep(timeoutMS)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(timeoutMS)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(timeoutMS)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(timeoutMS)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (): Promise<Activity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: Activity) => requests.post(`/activities/`, activity),
  update: (activity: Activity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unAttend: (id: string) => requests.delete(`/activities/${id}/attend`),
};

const Users = {
  current: (): Promise<User> => requests.get("/user"),
  login: (user: UserFormValues): Promise<User> =>
    requests.post("/user/login", user),
  register: (user: UserFormValues): Promise<User> =>
    requests.post("/user/register", user),
};

const Profiles = {
  get: (username: string): Promise<Profile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<Photo> =>
    requests.postForm("/photos", photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  follow: (username: string) =>
    requests.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) =>
    requests.delete(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: "following" | "followers") =>
    requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
};

export default { Activities, Users, Profiles };
