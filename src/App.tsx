import { AuthProvider } from "navigation/AuthConText";
import Header from "navigation/Header";
import MainPage from "page/MainPage";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </Header>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
