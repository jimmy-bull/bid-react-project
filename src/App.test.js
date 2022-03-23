import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
 import { allMyreducers } from './app/reducers';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={allMyreducers}>
      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
