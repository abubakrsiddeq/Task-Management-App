import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { getCurrentUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess, getErrorMessage } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  password: z.string().min(6, "Password must be at least 6 characters.").optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid profile details.");
    }

    await connectToDatabase();

    const updateData: Record<string, string> = {
      name: parsed.data.name,
    };

    if (parsed.data.password) {
      updateData.password = await bcrypt.hash(parsed.data.password, 10);
    }

    await User.findByIdAndUpdate(user.userId, updateData);

    return apiSuccess({ message: "Profile updated successfully." });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
