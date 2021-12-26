import React, { useReducer, createContext } from 'react';
import routesUrl from '../router/routes_url.json';
import Reducer from './reducer';
import config from '../config.json';
import { getValue } from '../common/data_storage';

const initialState = {
  userData: getValue('userData') || '',
  routesUrl,
  config,
};

export const context = createContext(initialState);

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <context.Provider value={{ state, dispatch }}>
      {children}
    </context.Provider>
  );
};

export default Store;
