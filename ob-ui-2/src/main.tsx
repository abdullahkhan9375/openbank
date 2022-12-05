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
import { BankDetails } from './pages/Bank/BankDetails';
import { ShowBanks } from './pages/Bank/ShowBanks';
import  store from "./store";
import { Provider } from 'react-redux';

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
        path: "banks",
        element: <ShowBanks/>,
      },
      {
        path:"user",
        element: <ShowUser/>,
      },
      {
        path: "banks",
        children:
        [
          {
            path: ":bankId",
            element: <BankDetails/>
          },
          {
            path:"new",
            element: <BankDetails/>
          }
        ],
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
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
    </React.StrictMode>
);