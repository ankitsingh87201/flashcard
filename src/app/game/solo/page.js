"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SoloRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/game?mode=solo");
  }, [router]);

  return <p className="text-center mt-20">Loading Solo Mode...</p>;
}
