import { Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import RosterProvider from "../contexts/RosterContext";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Login from "./Login";
import Management from "./Management";
import PasswordReset from "./PasswordReset";
import PrivateRoute from "./PrivateRoute";
import Signup from "./Signup";
import TestsCompo from "./TestsCompo";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div id="app" className="bg-dark" style={{ minHeight: "100vh" }}>
          <Header />
          <Container className="border border-light">
            <Row className="justify-content-center">
              <RosterProvider>
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  <Route path="/forgot-password" component={PasswordReset} />
                  <Route path="/tests" component={TestsCompo} />
                  <Route path="/management" component={Management} />
                </Switch>
              </RosterProvider>
            </Row>
          </Container>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
