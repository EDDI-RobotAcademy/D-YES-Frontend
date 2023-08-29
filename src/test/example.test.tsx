import React from "react";
import '@testing-library/jest-dom';
import "matchmedia-polyfill";
import "matchmedia-polyfill/matchMedia.addListener";
import { render } from "@testing-library/react";
import { HashRouter } from 'react-router-dom';
import MainPage from "../page/MainPage";


it("메인페이지 테스트", () => {
    render(
        <HashRouter>
            <MainPage />
        </HashRouter>
    );
});
