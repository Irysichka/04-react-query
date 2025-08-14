import axios from "axios"
import { Movie } from "../types/movie"

export interface  GetMoviesResponse {
    results: Movie[];
    page: number;
    total_page: number;
    total_results: number;
}

export async function fetchMovies(query: string, page: number) {
        const response = await axios.get<GetMoviesResponse>("https://api.themoviedb.org/3/search/movie",
            {
                params: {
                    query,
                    page,
                },
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                },
            });
        return response.data;
}
    
