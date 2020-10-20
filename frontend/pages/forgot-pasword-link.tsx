import React, { useState } from "react";
import { useRouter } from "next/router";
import { apiRest } from "../lib/api.js";
import { useAppContext } from "../providers/AppContext.js";
import ETKForgotPasswordLinkButton from "../components/ForgotPasswordLink/Button"
import ETKForgotPasswordLinkForm from "../components/ForgotPasswordLink/Form"
import ETKTemplate from "../components/Template";

export default function ForgotPasswordLinkPage() {
  const { user, setUser, isLoading } = useAppContext();
  
  return (
    <ETKTemplate>
      <ETKForgotPasswordLinkForm/>
    </ETKTemplate>
  );
}
