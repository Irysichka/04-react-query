import css from "./App.module.css";
import { fetchMovies, GetMoviesResponse } from "../../services/movieService";
import { keepPreviousData } from "@tanstack/react-query";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import toast from "react-hot-toast";
import { Movie } from "../../types/movie";
import { useEffect } from "react";
import MovieModal from "../MovieModal/MovieModal";


export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<GetMoviesResponse>({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const hasResults = data?.total_results || 0;


  useEffect(() => {
    if (data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSubmit = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };



  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSubmit} />
        {isSuccess && hasResults > 1 && (
          <ReactPaginate
            pageCount={hasResults}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {data?.results && <MovieGrid movies={data.results} onSelect={handleSelectMovie}/>}
{selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
        )}
      </div>
    </>
  );
}
