import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'antd/dist/antd.css';
import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {createStore} from "redux";
import rootReducer from "./reducers";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";

const store: any = createStore(
    rootReducer,
    composeWithDevTools()
);


ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
