import { v } from "convex/values";
import { query } from "./_generated/server";


export const getSeenByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        if (args.userId == "undefined") return 
        const filteredQuery = await ctx.db.query("seen").filter((q) => q.eq(q.field("userId"), args.userId)).collect();
        const filmsPromises = filteredQuery.map((film) => {
            return ctx.db.query("films").filter((q) => q.eq(q.field("_id"), film.filmId)).collect();
           });
           
           // Wait for all promises to resolve
        const films = await Promise.all(filmsPromises);
        const flattenedFilms = films.flatMap(filmArray => filmArray);
        return flattenedFilms
    },
})

