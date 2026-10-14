'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ConfigProvider, theme } from 'antd';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#B84A22', // Amber Spice Terracotta
            colorBgBase: '#FFFFFF',
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E9DFD3',
            colorText: '#2C221C',
            colorTextSecondary: '#786960',
            borderRadius: 14,
            fontFamily: "'Poppins', sans-serif",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </Provider>
  );
}
