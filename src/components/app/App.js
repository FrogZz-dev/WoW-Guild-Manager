import { Container } from "react-bootstrap";
import { AuthProvider } from "../../contexts/AuthContext";
import Header from "./Header";
import MainRoutes from "@components/routes/MainRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import RosterProvider from "../../contexts/RosterContext";
import FiltersProvider from "../../contexts/FiltersContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div id="app" className="bg-dark min-vh-100">
          <Header />
          <RosterProvider>
            <FiltersProvider>
              <Container fluid="md" style={{ minHeight: "85vh" }}>
                <MainRoutes />
              </Container>
            </FiltersProvider>
          </RosterProvider>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
