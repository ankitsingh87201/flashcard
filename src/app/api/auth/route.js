import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    // 1. Get body data
    const { email, password, type } = await req.json();

    // 2. Agar query param se mode bhejna ho
    const { searchParams } = new URL(req.url);
    const mode = type || searchParams.get("mode");

    let result;

    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      return NextResponse.json({ message: "Login successful!", user: result.data.user });
    }

    if (mode === "signup") {
      result = await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      return NextResponse.json({ message: "Signup successful! Please check your email.", user: result.data.user });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
