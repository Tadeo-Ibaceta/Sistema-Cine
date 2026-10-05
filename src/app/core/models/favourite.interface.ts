import { Movie } from "./movie.interface";

export interface Favourite {
    id?: string;
    user_id?: string;
    movie_id: string;
    nota: string;
    comentario: string;
    Movie?: Movie;
}
