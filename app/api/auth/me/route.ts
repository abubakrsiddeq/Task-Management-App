import { apiSuccess, apiError, getErrorMessage } from "@/lib/api";
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUserFromCookies();

    if (!user) {
      return apiError("Unauthorized.", 401);
    }

    return apiSuccess({
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
