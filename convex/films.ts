import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createFilm = mutation({
    args: {
        name: v.string(),
        country: v.string(),
        year: v.string(),
        janres: v.array(v.string()),
        fileUrl: v.string(),
        thumbnailUrl: v.string(),
        characters: v.string(),
        description: v.string(),


    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("User is not authenticated")
        }

        await ctx.db.insert("films", {
            name: args.name,
            country: args.country,
            year: args.year,
            janres: args.janres,
            fileUrl: args.fileUrl,
            thumbnailUrl: args.thumbnailUrl,
            characters: args.characters,
            description: args.description,
            rating: Math.random() * 10
        })
    }
})

export const getFilms  = query({
    handler: async (ctx) => {
        return await ctx.db.query("films").collect()
    }
})

export const getFilmById = query({
    args: { filmId: v.string()},
    handler: async (ctx, args) => {
        return await ctx.db
        .query("films")
        .filter((q) => q.eq(q.field("_id"), args.filmId))
        .collect()
    },
})


export const searchMovies = query({
    args: {
       searchTerm: v.string(),
    },
    handler: async (ctx, args) => {
        const results = await ctx.db.query("films").withIndex("by_creation_time").order("asc").collect()

        const filtered = results.filter((q) => {
            return q.name.includes(args.searchTerm);
        });
        

        return filtered.slice(0, 12);
    },
});


export const filteredMovies = query({
    args: {
        genre: v.optional(v.string())
    },
    handler: async (ctx, args) => {

        if (!args.genre) return
        const films = await ctx.db.query("films").withIndex("by_name").order("asc").collect()

        const result = films.filter(film => { 
            return film.janres.includes(args.genre!)
         })

        return result
        

    },
})


   