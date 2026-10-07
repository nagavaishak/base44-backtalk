import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import NewTake from '@/pages/NewTake';
import Interview from '@/pages/Interview';
import TakeDetail from '@/pages/TakeDetail';
import Home from '@/pages/Home';
import Takes from '@/pages/Takes';
import Leaderboard from '@/pages/Leaderboard';
import Settings from '@/pages/Settings';
import Empty from '@/pages/Empty';
import SignIn from '@/pages/SignIn';
import ForkTake from '@/pages/ForkTake';
import DraftTake from '@/pages/DraftTake';
import Drafts from '@/pages/Drafts';
import Profile from '@/pages/Profile';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/takes/new" element={<NewTake />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/takes/:id/draft" element={<DraftTake />} />
        <Route path="/takes/:id" element={<TakeDetail />} />
        <Route path="/takes/:id/fork" element={<ForkTake />} />
        <Route path="/takes" element={<Takes />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/u/:handle" element={<Profile />} />
        <Route path="/chats" element={<Empty title="Chats" note="Your conversations about a take will live here." />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App