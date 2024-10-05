import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const Home: React.FC = () => {
  return (
    <div>
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-6">Welcome to PokéAPI Website</h1>
      <p className="mb-4">
        Explore the world of Pokémon using data from the PokéAPI. This website provides information about various Pokémon, their abilities, moves, and more.
      </p>
      <Link to="/pokemon" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        View Pokémon List
      </Link>
    </div>
  );
};

export default Home;