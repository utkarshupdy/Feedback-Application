import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    // Decode username if needed
    const decodedUsername = decodeURIComponent(username);

    // Find user in the database
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 404 }
      );
    }

    // Validate verification code and expiration
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    // const isCodeNotExpired = true;
    console.log(isCodeValid);
    console.log(isCodeNotExpired);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account verified successfully.",
        }),
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification code expired. Please sign up again.",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Incorrect verification code.",
      }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      { status: 500 }
    );
  }
}
