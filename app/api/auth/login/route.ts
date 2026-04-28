import bcrypt from "bcryptjs";

import { apiError, apiSuccess, getErrorMessage } from "@/lib/api";
import { setAuthCookie, signAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serializeUser } from "@/lib/serializers";
import { loginSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid login details.");
    }

    await connectToDatabase();

    const user = await User.findOne({ email: parsed.data.email });

    if (!user) {
      return apiError("Invalid email or password.", 401);
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);

    if (!isPasswordValid) {
      return apiError("Invalid email or password.", 401);
    }

    const safeUser = serializeUser(user);
    const token = await signAuthToken({
      userId: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
    });

    await setAuthCookie(token);

    return apiSuccess({ user: safeUser });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
