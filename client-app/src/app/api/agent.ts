import axios, { AxiosResponse, AxiosError } from "axios";
import { Activity } from "../models/activity";
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

const reqests = {
  get: (url: string) =>
    axios.get(url).then(sleep(timeoutMS)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(timeoutMS)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(timeoutMS)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(timeoutMS)).then(responseBody),
};

const Activities = {
  list: (): Promise<Activity[]> => reqests.get("/activities"),
  details: (id: string) => reqests.get(`/activities/${id}`),
  create: (activity: Activity) => reqests.post(`/activities/`, activity),
  update: (activity: Activity) =>
    reqests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => reqests.delete(`/activities/${id}`),
  attend: (id: string) => reqests.post(`/activities/${id}/attend`, {}),
  unAttend: (id: string) => reqests.delete(`/activities/${id}/attend`),
};

const Users = {
  current: (): Promise<User> => reqests.get("/user"),
  login: (user: UserFormValues): Promise<User> =>
    reqests.post("/user/login", user),
  register: (user: UserFormValues): Promise<User> =>
    reqests.post("/user/register", user),
};

export default { Activities, Users };
