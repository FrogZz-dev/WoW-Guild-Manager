import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Login from "./Login";
import PasswordReset from "./PasswordReset";
import PrivateRoute from "./PrivateRoute";
import Signup from "./Signup";
import TestsCompo from "./TestsCompo";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={PasswordReset} />
              <Route path="/tests" component={TestsCompo} />
            </Switch>
          </div>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
