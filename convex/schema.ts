import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({


  films: defineTable({
    characters: v.string(),
    country: v.string(),
    description: v.string(),
    fileUrl: v.string(),
    janres: v.array(v.string()),
    name: v.string(),
    rating: v.optional(v.float64()),
    thumbnailUrl: v.string(),
    year: v.string(),
  }).index("by_name", ['name']),

  users: defineTable({
    userId: v.string(),
    email: v.string(),
    favourite: v.array(v.string()),
    seen: v.array(v.string()),
    favouriteCategory: v.string(),

    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    credits: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_subscriptionId", ["subscriptionId"]),

  favourite: defineTable({
    userId: v.id("users"),
    filmId: v.id("films")
  }).index("useId", ["userId"]),

  seen: defineTable({
    userId: v.id("users"),
    filmId: v.id("films"),
    seenAt: v.number(),
  }).index("useId", ["userId"]),

  subscription: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    endsAt: v.number()
  })
});

