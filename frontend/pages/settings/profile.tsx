import React, { useState } from "react";
import ETKTemplate from "../../components/Template";
import ETKSettingsTemplate from "../../components/Settings/Index"
import { useAppContext } from "../../providers/AppContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { user } = useAppContext();
  const router = useRouter();
  console.log("profile tsx settings")
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);
  return (
    <ETKTemplate>
      <ETKSettingsTemplate>
      </ETKSettingsTemplate>
    </ETKTemplate>
  );
}