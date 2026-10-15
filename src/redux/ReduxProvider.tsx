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
            colorPrimary: '#F15A24', // Sunset Terracotta
            colorBgBase: '#FFFFFF',
            colorBgContainer: '#FFFFFF',
            colorBorder: '#E5E5E5',
            colorText: '#1A130E',
            colorTextSecondary: '#555555',
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
