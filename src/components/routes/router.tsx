import { createBrowserRouter } from "react-router-dom";
import TodayWeather from "@/pages/today-weather";
import NotFound from "@/pages/not-found";

export const router = createBrowserRouter([
  { path: "/", Component: TodayWeather },
  { path: "*", Component: NotFound },
]);
