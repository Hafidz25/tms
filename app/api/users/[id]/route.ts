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
  const users = await db.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Delete user successfully",
      data: users,
    },
    {
      status: 200,
    }
  );
}
