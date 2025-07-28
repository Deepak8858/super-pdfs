"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ComponentType } from "react";

export default function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  const WithAuth = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/login");
        }
      };
      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}
