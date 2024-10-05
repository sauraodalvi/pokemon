import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: string[];
}

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPokemon = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`, {
        signal: abortControllerRef.current.signal
      });
      const results = response.data.results;
      const newPokemon = await Promise.all(
        results.map(async (result: { name: string; url: string }) => {
          const detailsResponse = await axios.get(result.url, {
            signal: abortControllerRef.current?.signal
          });
          return {
            name: result.name,
            url: result.url,
            id: detailsResponse.data.id,
            types: detailsResponse.data.types.map((type: { type: { name: string } }) => type.type.name),
          };
        })
      );
      setPokemon((prevPokemon) => {
        const uniquePokemon = newPokemon.filter(
          (newPoke) => !prevPokemon.some((prevPoke) => prevPoke.id === newPoke.id)
        );
        return [...prevPokemon, ...uniquePokemon];
      });
      setHasMore(response.data.next !== null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching Pokemon:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPokemon();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPokemon]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const filteredPokemon = pokemon.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === '' || p.types.includes(typeFilter);
    return nameMatch && typeMatch;
  });

  return (
    <div>
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Pokémon List</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemon.map((p) => (
          <Link
            key={p.id}
            to={`/pokemon/${p.id}`}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
              className="mx-auto mb-2"
            />
            <h2 className="text-center capitalize">{p.name}</h2>
            <div className="flex justify-center mt-2">
              {p.types.map((type) => (
                <span
                  key={`${p.id}-${type}`}
                  className="text-xs px-2 py-1 mr-1 rounded"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {loading && <Loading />}
      {!loading && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type] || '#888888';
}

export default PokemonList;