"use node";

import { v } from "convex/values";
import Stripe from "stripe";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";


type Metadata = {
  userId: string;
};

export const pay = action({
  args: { payId: v.string()},
  handler: async (ctx, args  ) => {
    const user = await ctx.auth.getUserIdentity();
    console.log("pay")
    if (!user) {
      throw new Error("you must be logged in to subscribe");
    }

    if (!user.emailVerified) {
      throw new Error("you must have a verified email to subscribe");
    }

    let payID
    if (args.payId === "30") {
      payID = process.env.PRICE_ID!
    } else if(args.payId === "90") {
      payID = process.env.PRICE_90_ID!
    } else if (args.payId === "365") {
      payID = process.env.PRICE_365_ID!
    }

    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: payID! , quantity: 1 }],
      customer_email: user.email,
      metadata: {
        userId: user.subject,
      },
      mode: "subscription",
      success_url: `${domain}`,
      cancel_url: `${domain}`,
    });

    return session.url!;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    console.log("fulfilling")
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });
    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET!;
    try {
      const event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      console.log(`Received event: ${event.type}`);
      console.log(`Payload: ${args.payload}`);

// checkout.session.completed
      if ( event.type =="checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        const userId = completedEvent.metadata.userId;

        await ctx.runMutation(internal.users.updateSubscription, {
          userId: userId,
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        await ctx.runMutation(internal.users.updateSubscriptionBySubId, {
          subscriptionId: subscription.items.data[0]?.price.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});