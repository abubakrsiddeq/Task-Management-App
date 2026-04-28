import { apiSuccess, getErrorMessage, apiError } from "@/lib/api";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();

    return apiSuccess({ message: "Logged out successfully." });
  } catch (error) {
    return apiError(getErrorMessage(error), 500);
  }
}
