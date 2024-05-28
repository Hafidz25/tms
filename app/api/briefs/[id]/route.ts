import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const briefs = await db.brief.delete({
    where: { id: params.id },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Delete brief successfully",
      data: briefs,
    },
    {
      status: 200,
    }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { title, deadline, content, status, assign } = body;

  // Hash password
  //   const hashedPassword = await hash(password, 10);
  const briefs = await db.brief.update({
    where: { id: params.id },
    data: {
      title: title,
      deadline: deadline,
      content: content,
      status: status,
      assign: { set: assign },
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Brief update successfully",
      data: briefs,
    },
    {
      status: 200,
    }
  );
}
