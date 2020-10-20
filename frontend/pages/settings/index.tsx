import React, { useState } from "react";
import ETKTemplate from "../../components/Template";
import ETKSettingsTemplate from "../../components/Settings/Index"
import { useAppContext } from "../../providers/AppContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SettingsPage() {
  const { user, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    console.log("héé")
    console.log(user)
    console.log(isLoading)
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [isLoading, user]);

  return (
    <ETKTemplate>
      <ETKSettingsTemplate>
      </ETKSettingsTemplate>
    </ETKTemplate>
  );
}