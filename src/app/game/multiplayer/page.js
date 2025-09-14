"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MultiplayerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/game?mode=multi");
  }, [router]);

  return <p className="text-center mt-20">Loading Multiplayer...</p>;
}
