import React from "react";
import {Route} from "react-router-dom";
import {SignInPage} from "./pages/signin";
import {SignOutPage} from "./pages/signout";
import {SignUpPage} from "./pages/signup/index";
import {SignUpOtpVerifyPage} from "./pages/signup/step2";
import {Step3PersonalInfoPage} from "./pages/signup/step3";
import {Step4ProfileInfoPage} from "./pages/signup/step4";
import {Step5PurposesPage} from "./pages/signup/step5";
import {OneIdPage} from "./pages/oneid";

export const AuthenticationRoutes: React.ReactElement = (
  <Route path="auth">
    <Route path="sign-in" element={<SignInPage />} />
    <Route path="sign-up" element={<SignUpPage />} />
    <Route path="sign-up/step2" element={<SignUpOtpVerifyPage />} />
    <Route path="sign-up/step3" element={<Step3PersonalInfoPage />} />
    <Route path="sign-up/step4" element={<Step4ProfileInfoPage />} />
    <Route path="sign-up/step5" element={<Step5PurposesPage />} />
    <Route path="sign-out" element={<SignOutPage />} />
    <Route path="oneid" element={<OneIdPage />} />
  </Route>
);

