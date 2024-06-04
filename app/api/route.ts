import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const session = await getServerSession(authOption);
  return NextResponse.json({ authenticated: !!session });
}
