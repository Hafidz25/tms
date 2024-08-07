import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

import { authOption } from "@/lib/auth";

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOption);

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service"
  ) {
    try {
      const body = await req.json();
      const { title, deadline, content, status, assign, authorId } = body;

      // Create data
      const newBrief = await db.brief.create({
        data: {
          title: title,
          deadline: deadline,
          content: content,
          status: "Assigned",
          assign: { connect: assign },
          authorId: authorId,
        },
      });

      const author = await db.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          briefs: true,
        },
        where: { id: authorId },
      });

      const newBriefNotif = await db.briefNotification.create({
        data: {
          message: `${author?.name.italics()} just added a new brief ${newBrief.title.italics()}`,
          briefId: newBrief.id,
          assign: { connect: assign },
        },
      });

      return NextResponse.json(
        {
          brief: newBrief,
          notification: newBriefNotif,
          message: "Brief created successfully",
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
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOption);

  if (
    session?.user.role === "Admin" ||
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    try {
      //get all posts
      const briefs = await db.brief.findMany({
        select: {
          id: true,
          title: true,
          deadline: true,
          content: true,
          status: true,
          assign: true,
          authorId: true,
          feedback: {
            select: {
              id: true,
              content: true,
              briefId: true,
              userId: true,
              userSentId: true,
              isReply: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Briefs",
          data: briefs,
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
  } else {
    return NextResponse.json(
      { error: "You dont have access" },
      {
        status: 403,
      }
    );
  }
}
