import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks/page";
import Meetings from "./pages/Meetings/page";
import Dropdowns from "./pages/Dropdowns/page";

export const routes = [
  {
    title: "Tareas",
    url: "/",
    component: Tasks,
  },
  {
    title: "Reuniones",
    url: "/Meetings",
    component: Meetings 
  },
  // {
  //   title: "Manage Dropdowns",
  //   url: "/dropdowns",
  //   component: Dropdowns,
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   component: Settings,
  // },
];
