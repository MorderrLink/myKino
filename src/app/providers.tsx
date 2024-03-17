"use client"

import { EdgeStoreProvider } from "@/lib/edgestore";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export function Providers({children}: PropsWithChildren) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <EdgeStoreProvider>
                {children}
                
            </EdgeStoreProvider>
        </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}