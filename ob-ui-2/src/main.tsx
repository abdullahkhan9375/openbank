import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Root } from "./pages/Root";
import { ShowHome } from './pages/Home/ShowHome';
import { ErrorPage } from './pages/ErrorPage';
import { ShowUser } from './pages/User/ShowUser';

const router = createBrowserRouter (
  [{
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "home",
        element: <ShowHome/>,
      },
      {
        path:"user",
        element: <ShowUser/>,
      }
    ]
  },
  ]
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);