import React from "react";

export interface SignUpFormType {
  first_name: string;
  last_name: string;
  birthday: string;
  gender: number;
  email: string;
  about_me: string;
  biography: string;
  purposes: string;
  phone: string;
  region?: string;
  district?: string;
  password: string;
}

export interface SignUpContextType {
  step: number;
  form: SignUpFormType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setForm: React.Dispatch<React.SetStateAction<SignUpFormType>>;
}

export interface SignUpProviderProps {
  children: React.ReactNode;
}

export interface Step0ErrorsType {
  first_name?: string;
  phone?: string;
  password?: string;
}

export interface Step2ErrorsType {
  first_name?: string;
  last_name?: string;
  birthday?: string;
  gender?: string;
  email?: string;
  region?: string;
  district?: string;
}
