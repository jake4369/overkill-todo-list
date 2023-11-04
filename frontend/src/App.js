import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </main>
  );
};

export default App;
