"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/utils/slices/authApiSlice";
import {
  setCredentials,
  logout,
  setAuthChecked,
} from "@/utils/slices/authSlice";
import GlobalLoader from "@/components/GlobalLoader";
import { useRouter, usePathname } from "next/navigation";
import { useGetOrganizationMeQuery } from "@/utils/slices/organizationApiSlice";

const LOADER_MIN_MS = 2200; // covers the bar fill (250ms + 1700ms) plus a short hold at 100%
const LOADER_FADE_MS = 450;
const LOADER_SETTLE_MS = 300; // lets the page finish its first render behind the full bar

export default function UserAuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Initial-load splash: stays up for a minimum time so the branded animation can finish
  // (auth usually resolves almost instantly in production), then fades out.
  const [minElapsed, setMinElapsed] = useState(false);
  const [splash, setSplash] = useState("show"); // show -> mounting -> leaving -> done

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setMinElapsed(true), reduce ? 600 : LOADER_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  const authChecked = useSelector((state) => state.auth.authChecked);

  useEffect(() => {
    if (splash === "show" && authChecked && minElapsed) setSplash("mounting");
  }, [splash, authChecked, minElapsed]);

  // The bar has finished by now. The page mounts behind the static splash (any main-thread
  // stall is invisible here); the fade starts only once that work has settled.
  useEffect(() => {
    if (splash !== "mounting") return;
    const t = setTimeout(() => setSplash("leaving"), LOADER_SETTLE_MS);
    return () => clearTimeout(t);
  }, [splash]);

  useEffect(() => {
    if (splash !== "leaving") return;
    const t = setTimeout(() => setSplash("done"), LOADER_FADE_MS);
    return () => clearTimeout(t);
  }, [splash]);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const {
    data: userData,
    error: userError,
    isFetching: userFetching,
  } = useGetMeQuery(undefined, {
    skip: userInfo?.type === "organization",
  });

  const {
    data: orgData,
    error: orgError,
    isFetching: orgFetching,
  } = useGetOrganizationMeQuery(undefined, {
    skip: userInfo?.type === "user",
  });



  /* ---------------------------
     EXISTING AUTH CHECK (UNCHANGED)
  ---------------------------- */
  useEffect(() => {
    if (userFetching || orgFetching) return;

    // ✅ If user session exists
    if (userData?.data) {
      dispatch(
        setCredentials({
          ...userData.data,
          type: "user",
        })
      );
    }

    // ✅ If organization session exists
    else if (orgData?.data) {
      dispatch(
        setCredentials({
          ...orgData.data,
          type: "organization",
        })
      );
    }

    // ❌ No valid session
    else if (
      userError?.status === 401 &&
      orgError?.status === 401
    ) {
      dispatch(logout());
    }

    dispatch(setAuthChecked());

  }, [
    userFetching,
    orgFetching,
    userData,
    orgData,
    userError,
    orgError,
    dispatch,
  ]);


  /* ---------------------------
     PROFILE COMPLETION (USER ONLY)
  ---------------------------- */
  useEffect(() => {
    if (authChecked && userInfo && userInfo.type === "user") {
      const isIncomplete = !userInfo.fullName || !userInfo.email;
      const isSignupPage = pathname === "/signup";

      if (isIncomplete && !isSignupPage) {
        router.push("/signup");
      }
    }
  }, [authChecked, userInfo, pathname, router]);

  /* ---------------------------
     ROLE-BASED ROUTE PROTECTION
  ---------------------------- */

  /* ---------------------------
     BLOCK APP UNTIL AUTH RESOLVED
  ---------------------------- */
  // Same root structure in every phase: the page and the loader each keep a fixed slot, so
  // neither is ever remounted (a remount would restart the bar and re-run the page's first
  // render). Children stay blocked until the splash has played; auth gating is unchanged.
  return (
    <>
      {splash === "show" ? null : children}
      {splash === "done" ? null : <GlobalLoader leaving={splash === "leaving"} />}
    </>
  );
}
