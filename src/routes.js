import Settings from "./pages/Settings";

import Home from "./pages/Home/page";
import Dropdowns from "./pages/Dropdowns/page";

export const routes = [
  {
    title: "Home",
    url: "/",
    component: Home,
  },

  {
    title: "Manage Dropdowns",
    url: "/dropdowns",
    component: Dropdowns,
  },

  {
    title: "Settings",
    url: "/settings",
    component: Settings,
  },
];
