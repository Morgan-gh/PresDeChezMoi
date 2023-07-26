import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Test from "./pages/Test";
import TeamPage from "./pages/TeamPage";
import NavBarLandingPage from "./components/NavBarLandingPage";
import FooterLandingPage from "./components/FooterLandingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AnimateBackground from "./components/AnimateBackground";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ChatBot from "./components/MainComponent/ChatBot";
import NavBarHome from "./components/MainComponent/NavBarHome";
import UserMenu from "./components/MainComponent/UserMenu";
import ResearchBar from "./components/MainComponent/ResearchBar";
import Protected from "./protected";
import { Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import Chat from "./components/MainComponent/Chat/Chat";
import AdministrationPage from "./pages/AdministrationPage";
import NavBarAdmin from "./components/Admin/NavBarAdmin";
import General from "./components/Admin/General";
import Role from "./components/Admin/Role";
import Tickets from "./components/Admin/Tickets";
import Event from "./components/Admin/Event";
import Post from "./components/Admin/Post";
import ViewPost from "./pages/ViewPost";
import { useParams } from "react-router-dom";
import { getAPI } from "./api";
import Loader from "./components/Loader";
import NavBarUser from "./components/User/NavBarUser";
import Settings from "./components/User/Settings";
import Myposts from "./components/User/Myposts";
import MySave from "./components/User/MySave";
import MyLoot from "./components/User/MyLoot";

const LandingContainer = () => {
  return (

    <>
      <NavBarLandingPage />
      <AnimateBackground />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<PageNotFound navigation={"/"} />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <FooterLandingPage />
    </>

  );
};

const HomeContainer = () => {

  const user = useSelector((state) => state.utilisateur)

  if (user.isLogin && user.idRole === 3) {
    return (
      <>
        <ChatBot />
        <ResearchBar />
        <NavBarHome isAdmin='admin' />
        {/* <UserMenu /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<PageNotFound navigation={"/home"} />} />
        </Routes>
      </>
    );
  }
  if (user.isLogin) {
    return (
      <>
        <ChatBot />
        <ResearchBar />
        <NavBarHome />
        {/* <UserMenu /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<PageNotFound navigation={"/home"} />} />
        </Routes>
      </>
    );
  }
  else {
    return (<Navigate to="/login" replace />);
  }

};

const AdminContainer = () => {

  const user = useSelector((state) => state.utilisateur)

  if (user.isLogin && user.idRole === 3) {
    return (
      <>
        <NavBarAdmin />
        <Routes>
          <Route path="/" element={<General />} />
          <Route path="*" element={<PageNotFound navigation={"/home"} />} />
          <Route path="/role-user" element={<Role />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/notif-event" element={<Event />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </>
    );
  }

  else {
    return (<Navigate to="/login" replace />);
  }
}

const ViewContainer = () => {

  const [idToVerif, setIdToVerif] = useState([]);
  const [loadingVerif, setLoadingVerif] = useState(true);


  useEffect(() => {
    getAPI('http://127.0.0.1:8081/api/annonce/', {}, {})
      .then((response) => {

        for (var n = 0; n < response.dataAPI.length; n++) {
          setIdToVerif(idToVerif => [...idToVerif, response.dataAPI[n].id]);
        }

        setLoadingVerif(false);
      })
      .catch((error) => {
        console.log('error', error);
        setLoadingVerif(false)
      });
  }, []);

  const { id } = useParams();

  const parsedId = parseInt(id);
  const isValidId = idToVerif.includes(parsedId);

  if (!isValidId) {
    return <PageNotFound navigation={'/login'} />;
  }

  else {

    return (
      <>
        {loadingVerif ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<ViewPost postId={id} />} />
          </Routes>
        )}
      </>
    );
  }

}

const UserContainer = () => {

  const user = useSelector((state) => state.utilisateur)

  if (user.isLogin) {

    return (
      <>
        <ChatBot />
        <NavBarHome />
        {/* <UserMenu /> */}
        <NavBarUser />
        <Routes>
          <Route path="/settings" element={< Settings />} />
          <Route path="/my-posts" element={< Myposts />} />
          <Route path="/my-save" element={< MySave />} />
          <Route path="/my-loot" element={< MyLoot />} />
          <Route path="*" element={<PageNotFound navigation={"/home"} />} />
        </Routes>
      </>
    )
  }
  else {
    return (<Navigate to="/login" replace />);
  }
}

const App = () => {

  const [loading, setLoading] = useState(true);
  const spinner = document.getElementById("spinner_onload");

  if (spinner) {
    setTimeout(() => {
      document.querySelector(".container_onload").classList.add("fade_out");
      spinner.style.display = "none";
      setLoading(false);
      document.querySelector(".body").classList.add("fade_in");
    }, 2000);
  }
  return (
    !loading && (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<LandingContainer />} />
            <Route path="/home/*" element={<HomeContainer />} />
            <Route path="/home/administration/*" element={<AdminContainer />} />
            <Route path="/home/user/*" element={<UserContainer />} /> {/* mettre route home apres (/home/user/*) */}
            <Route path="/view-post/:id" element={<ViewContainer />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    )
  );
};

export default App;
