import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

// Mock essential services that might crash or hang in a test environment
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({})),
}));

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

test('renders App without crashing', () => {
  // We only wrap in Provider because App itself provides BrowserRouter and other context providers
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
