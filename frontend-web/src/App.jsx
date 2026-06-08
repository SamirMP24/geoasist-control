import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function Layout() {
  const location = useLocation();
  const sinLayout = ["/"];
  const conLayout = !sinLayout.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {conLayout && <Sidebar />}
      <div style={{
        flex: 1,
        marginLeft: conLayout ? "230px" : "0",
        marginTop: conLayout ? "52px" : "0",
        minHeight: "100vh",
      }}>
        {conLayout && <Navbar />}
        <AppRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;