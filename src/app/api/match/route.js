import connectMongo from "@/lib/mongo";
import Match from "@/models/Match";

export async function POST(req) {
  await connectMongo();
  try {
    const { players, scores, winner } = await req.json();
    const match = await Match.create({ players, scores, winner });
    return new Response(JSON.stringify({ success: true, match }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET() {
  await connectMongo();
  try {
    const matches = await Match.find().sort({ createdAt: -1 }).limit(10);
    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
