import { v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";

const FREE_CREDITS = 5;

export const createUser = internalMutation({
    args: { email: v.string(), userId: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            email: args.email,
            userId: args.userId,
            favourite: [],
            seen: [],
            favouriteCategory: "Не выбран",
            credits: FREE_CREDITS,
        })
    }
})

export const getUserById = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.userId ?? args.userId == "undefined") return null
        const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
        return users
    }
})


export const updateSubscription = internalMutation({
    args: { subscriptionId: v.string(), userId: v.string(), endsOn: v.number() },
    handler: async (ctx, args) => {
      const user = await getFullUser(ctx, args.userId);

      if (!user) {
        throw new Error("no user found with that user id");
      }
  
      await ctx.db.patch(user._id, {
        subscriptionId: args.subscriptionId,
        endsOn: args.endsOn,
      });
    },
});
  
export const updateSubscriptionBySubId = internalMutation({
args: { subscriptionId: v.string(), endsOn: v.number() },
handler: async (ctx, args) => {
    const user = await ctx.db
    .query("users")
    .withIndex("by_subscriptionId", (q) =>
        q.eq("subscriptionId", args.subscriptionId)
    )
    .first();

    if (!user) {
    throw new Error("no user found with that user id");
    }

    await ctx.db.patch(user._id, {
    endsOn: args.endsOn,
    });
},
});

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
    return ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
}


export const isUserSubscribed = async (ctx: QueryCtx | MutationCtx) => {
    const user = await ctx.auth.getUserIdentity();
  
    if (!user) {
      return false;
    }
  
    const userToCheck = await getFullUser(ctx, user.subject);
  
    return (userToCheck?.endsOn ?? 0) > Date.now();
};

export const addToFavourite = mutation({
    args: { filmId: v.id("films") },
    handler: async (ctx, args) =>  {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("User is not authenticated!")
        }

        const fullUser = await getFullUser(ctx, user.subject);
        const favourites = fullUser?.favourite
        favourites?.push(args.filmId)
        if (fullUser == undefined) {
            throw new Error("User is not undefined!")
        }

        await ctx.db.patch(fullUser?._id, {
            favourite: favourites
        })
        
    },
})

export const removeFromFavourite = mutation({
    args: { filmId: v.id("films") },
    handler: async (ctx, args) =>  {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("User is not authenticated!")
        }

        const fullUser = await getFullUser(ctx, user.subject);
        const favourites = fullUser?.favourite.filter(film => film != args.filmId!)
        if (fullUser == undefined) {
            throw new Error("User is not undefined!")
        }

        await ctx.db.patch(fullUser?._id, {
            favourite: favourites
        })
        
    },
})


export const getFavourite = query({
    args: { filmIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        if (args.filmIds.length == 0 ) return 
        
        const filmsPromises = args.filmIds.map((film) => {
            return ctx.db.query("films").filter((q) => q.eq(q.field("_id"), film)).collect();
           });
           
           // Wait for all promises to resolve
        const films = await Promise.all(filmsPromises);
        const flattenedFilms = films.flatMap(filmArray => filmArray);
        return flattenedFilms
    },
})

export const getSeen = query({
    args: { filmIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        if (args.filmIds.length == 0 ) return 
        
        const filmsPromises = args.filmIds.map((film) => {
            return ctx.db.query("films").filter((q) => q.eq(q.field("_id"), film)).collect();
           });
           
           // Wait for all promises to resolve
        const films = await Promise.all(filmsPromises);
        const flattenedFilms = films.flatMap(filmArray => filmArray);
        return flattenedFilms
    },
})



export const setFavouriteCategory = mutation({
    args: { category: v.string() },
    handler: async (ctx, args) => {

        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            console.error("User is not authenticated!")
            return
        }

        const fullUser = await getFullUser(ctx, user.subject);
        if (fullUser == undefined) {
            console.error("User is not undefined!")
            return
        }


        await ctx.db.patch(fullUser?._id, {
            favouriteCategory: args.category
        })
    },

})


export const nameChange = mutation({
    args: { newName: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            console.error("User is not authenticated!")
            return
        }

        const fullUser = await getFullUser(ctx, user.subject);
        if (fullUser == undefined) {
            console.error("User is not undefined!")
            return
        }

        await ctx.db.patch(fullUser?._id, {
            email: args.newName
        })

    },
})

export const addToSeen = mutation({
    args: { filmId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            console.error("User is not authenticated!")
            return
        }

        const fullUser = await getFullUser(ctx, user.subject);
        if (fullUser == undefined) {
            console.error("User is not undefined!")
            return
        }

        await ctx.db.patch(fullUser?._id, {
            seen: fullUser.seen.concat(args.filmId)
        })

    },
})