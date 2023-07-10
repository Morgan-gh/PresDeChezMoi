import React, { useState } from "react";
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
        <Route path="*" element={<PageNotFound />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <FooterLandingPage />
    </>
  );
};

const HomeContainer = () => {

  return (
    <>
      <NavBarHome />
      <ChatBot />
      <ResearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home/test" element={<Test />} />
      </Routes>
    </>
  );
};


const App = () => {
  const [loading, setLoading] = useState(true);
  const spinner = document.getElementById("spinner_onload");

  const isLog = true; //modif avec redux pour savoir si oui on non le user est connecté

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
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<LandingContainer />} />
            <Route path="/home/*" element={<Protected isLoggedIn={isLog}><HomeContainer /></Protected>} />
          </Routes>
        </BrowserRouter>
      </>
    )
  );
};

export default App;
