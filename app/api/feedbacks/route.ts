import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
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
    session?.user.role === "Customer Service" ||
    session?.user.role === "Team Member"
  ) {
    try {
      const body = await req.json();
      const { content, briefId, userId, userSentId, isReply, status, replyId } =
        body;

      // Create data
      const newFeedback = await db.feedback.create({
        data: {
          content: content,
          briefId: briefId,
          userId: userId,
          userSentId: userSentId,
          isReply: isReply,
          replyId: replyId,
          status: status,
        },
      });

      return NextResponse.json(
        {
          brief: newFeedback,
          message: "Feedback created successfully",
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
      const feedbacks = await db.feedback.findMany({
        select: {
          id: true,
          content: true,
          briefId: true,
          userId: true,
          userSentId: true,
          isReply: true,
          replyId: true,
          isEdited: true,
          status: true,
        },
      });

      //return response JSON
      return NextResponse.json(
        {
          success: true,
          message: "List Data Feedbacks",
          data: feedbacks,
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
