import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOption);

  try {
    const body = await req.json();
    const { message, briefId, assign } = body;

    // Create data
    const newBriefNotif = await db.briefNotification.create({
      data: {
        message: message,
        briefId: briefId,
        assign: { connect: assign },
      },
    });

    return NextResponse.json(
      {
        brief: newBriefNotif,
        message: "Brief notification created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }

  // if (
  //   session?.user.role === "Admin" ||
  //   session?.user.role === "Customer Service" ||
  //   session?.user.role === "Team Member"
  // ) {

  // } else {
  //   return NextResponse.json(
  //     { error: "You dont have access" },
  //     {
  //       status: 403,
  //     }
  //   );
  // }
}

export async function GET() {
  const session = await getServerSession(authOption);

  try {
    //get all posts
    const briefNotif = await db.briefNotification.findMany({
      select: {
        id: true,
        message: true,
        briefId: true,
        assign: true,
        read: true,
        createdAt: true,
      },
    });

    //return response JSON
    return NextResponse.json(
      {
        success: true,
        message: "List Data Brief Notifications",
        data: briefNotif,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error },
      {
        status: 500,
      }
    );
  }

  // if (
  //   session?.user.role === "Admin" ||
  //   session?.user.role === "Customer Service" ||
  //   session?.user.role === "Team Member"
  // ) {

  // } else {
  //   return NextResponse.json(
  //     { error: "You dont have access" },
  //     {
  //       status: 403,
  //     }
  //   );
  // }
}
