import { Route, Routes } from "react-router-dom";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import axios from "axios";
import Layout from "./component/Layout";
import { UserContextProvider } from "./component/UserContext";
import ChatPage from "./Pages/ChatPage";
import ProfilePage from "./Pages/ProfilePage";

axios.defaults.baseURL = "http://localhost:4001/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
