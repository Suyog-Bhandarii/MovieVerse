import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';  // Import AuthProvider
import WatchlistProvider from './context/WatchlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>       {/* Wrap with AuthProvider */}
    <WatchlistProvider> {/* Then wrap with WatchlistProvider */}
      <App />
    </WatchlistProvider>
  </AuthProvider>
);
