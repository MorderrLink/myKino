import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
export default authMiddleware({
    publicRoutes: [ "/film/[filmId]", "/", "/api/edgestore/init", ],
    afterAuth: (auth, req) => {
      if (auth.isPublicRoute) {
        return NextResponse.next();
      }
    },

});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};