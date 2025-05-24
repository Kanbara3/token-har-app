import './App.css';
import Header from './Header';
import HarUploader from './HarUploader';
import CharacterList from './CharacterList';
import swordNames from './swordNames';
import roleNames from './roleNames';
import React, { useState } from 'react';

function App() {
  const [characters, setCharacters] = useState([]);
  return (
    <div className="App">
      <Header />
      <HarUploader onCharactersExtracted={setCharacters} />
      <CharacterList characters={characters} swordNames={swordNames} roleNames={roleNames} />
    </div>
  );
}

export default App;
