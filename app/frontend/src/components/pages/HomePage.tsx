import { SearchBar } from '../shared/SearchBar';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const HomePage = () => {
  const [value, setValue] = useState('');

  const handleChange = (val: string) => {
    setValue(val);
  };

  const handleSearch = (value: string) => {
    router.get('/vacancies', { search: value });
  };
  return (
    <div>
      <SearchBar
        value={value}
        placeholder="Должность, технология или компания..."
        onSubmit={handleSearch}
        onChange={handleChange}
      />
      <h1 className="text-3xl font-bold">Главная</h1>
      <p className="mt-4">Информация.</p>
    </div>
  );
};

export default HomePage;
