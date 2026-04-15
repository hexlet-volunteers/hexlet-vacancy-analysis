import { TextInput, Button, Group, CloseButton } from '@mantine/core';
import { Search } from 'lucide-react';

type SearchBarProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

function SearchBar(props: SearchBarProps) {
  const { value, onChange, onSubmit, placeholder } = props;
  const valueTrim = value.trim();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (valueTrim === '') return;
    onSubmit(valueTrim);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="md" mb={20} mt="xs">
        <TextInput
          className="search-bar-input"
          w="50%"
          radius="md"
          size="md"
          rightSection={
            value ? <CloseButton onClick={() => onChange('')} /> : null
          }
          value={value}
          placeholder={placeholder}
          onChange={handleInput}
        />
        <Button
          type="submit"
          className="search-bar-button"
          disabled={valueTrim === ''}
          leftSection={<Search />}
        >
          Найти
        </Button>
      </Group>
    </form>
  );
}
export default SearchBar;
