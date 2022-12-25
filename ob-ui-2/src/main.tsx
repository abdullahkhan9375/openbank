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
import { BankDetails } from './pages/Bank/BankDetails';
import { ShowBanks } from './pages/Bank/ShowBanks';
import  store from "./store";
import { Provider } from 'react-redux';
import { ShowTests } from './pages/Test/ShowTests';
import { TestDetails } from './pages/Test/TestDetails';
import { ShowExam } from './pages/Exam/ShowExam';

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Welcome } from './pages/Home/Welcome';

Amplify.configure(awsconfig);

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
        path: "welcome",
        element: <Welcome/>
      },
      {
        path: "banks",
        element: <ShowBanks/>,
      },
      {
        path: "tests",
        element: <ShowTests/>,
      },
      {
        path: "tests",
        children:
        [
          {
            path: ":id",
            element: <TestDetails/>
          },
          {
            path: "new",
            element: <TestDetails/>
          }
        ]
      },
      {
        path:"exam",
        children:
        [
          {
            path: ":id",
            element: <ShowExam/>,
            children:
            [
              {
                path: ":type",
                element: <ShowExam/>
              }
            ]
          },
        ]
      },
      {
        path: "banks",
        children:
        [
          {
            path: ":id",
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
