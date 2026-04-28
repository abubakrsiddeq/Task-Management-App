import bcrypt from "bcryptjs";

import { apiError, apiSuccess, getErrorMessage } from "@/lib/api";
import { setAuthCookie, signAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeUser } from "@/lib/serializers";
import { signupSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid signup details.");
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: parsed.data.email });

    if (existingUser) {
      return apiError("An account with this email already exists.", 409);
    }

    const password = await bcrypt.hash(parsed.data.password, 12);

    const user = await User.create({
      ...parsed.data,
      password,
    });

    const safeUser = serializeUser(user);
    const token = await signAuthToken({
      userId: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
    });

    await setAuthCookie(token);

    return apiSuccess({ user: safeUser }, { status: 201 });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
