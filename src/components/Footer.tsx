import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2023 PokéAPI Website. Pokémon and Pokémon character names are trademarks of Nintendo.</p>
      </div>
    </footer>
  );
};

export default Footer;