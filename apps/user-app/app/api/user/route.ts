import { auth } from "../../lib/auth"

export async function GET() {
  const session = await auth()

  if (session?.user) {
    return Response.json({ user: session.user })
  }

  return Response.json(
    { message: "Not logged in" },
    { status: 403 }
  )
}