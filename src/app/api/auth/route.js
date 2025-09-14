import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password, type } = await req.json();

    let result;
    if (type === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ user: result.data.user });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode"); // login or signup
  const { email, password } = await req.json();

  try {
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return Response.json({ message: "Signup successful! Please check your email." });
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return Response.json({ message: "Login successful!" });
    }

    return Response.json({ message: "Invalid mode" }, { status: 400 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
