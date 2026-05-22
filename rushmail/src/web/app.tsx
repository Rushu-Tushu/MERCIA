import { Route, Switch, Redirect } from "wouter";
import { Provider } from "./components/provider";
import { authClient } from "./lib/auth";

// Pages
import LandingPage from "./pages/landing";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";
import ComposePage from "./pages/compose";
import EmailsPage from "./pages/emails";
import Analytics from "./pages/analytics";
import Templates from "./pages/templates";
import Resume from "./pages/resume";
import Notifications from "./pages/notifications";
import Settings from "./pages/settings";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "var(--bg)",
      }}>
        <div style={{
          width: 36, height: 36, border: "3px solid rgba(255,77,0,0.2)",
          borderTop: "3px solid #FF4D00", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <Redirect to="/sign-in" />;
  }

  return <Component />;
}

function App() {
  return (
    <Provider>
      <Switch>
        {/* Public */}
        <Route path="/" component={LandingPage} />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />

        {/* Protected */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={DashboardPage} />}
        </Route>
        <Route path="/compose">
          {() => <ProtectedRoute component={ComposePage} />}
        </Route>
        <Route path="/emails">
          {() => <ProtectedRoute component={EmailsPage} />}
        </Route>
        <Route path="/analytics">
          {() => <ProtectedRoute component={Analytics} />}
        </Route>
        <Route path="/templates">
          {() => <ProtectedRoute component={Templates} />}
        </Route>
        <Route path="/resume">
          {() => <ProtectedRoute component={Resume} />}
        </Route>
        <Route path="/notifications">
          {() => <ProtectedRoute component={Notifications} />}
        </Route>
        <Route path="/settings">
          {() => <ProtectedRoute component={Settings} />}
        </Route>

        {/* Fallback */}
        <Route>{() => <Redirect to="/" />}</Route>
      </Switch>
    </Provider>
  );
}

export default App;
