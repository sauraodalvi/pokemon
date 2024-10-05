import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';

interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
}

const PokemonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!pokemon) {
    return <div>Pokemon not found</div>;
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 capitalize">{pokemon.name}</h1>
        <div className="flex flex-col md:flex-row">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto md:mx-0 mb-4 md:mb-0 md:mr-6"
          />
          <div>
            <p><strong>Height:</strong> {pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <p className="capitalize">{stat.stat.name}: {stat.base_stat}</p>
                <div className="w-full bg-gray-200 rounded">
                  <div
                    className="bg-blue-500 rounded"
                    style={{ width: `${(stat.base_stat / 255) * 100}%`, height: '8px' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Moves</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.moves.slice(0, 10).map((move) => (
              <span key={move.move.name} className="bg-gray-200 px-2 py-1 rounded capitalize">
                {move.move.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Back to Pokemon List
        </Link>
      </div>
    </div>
  );
};

export default PokemonDetails;