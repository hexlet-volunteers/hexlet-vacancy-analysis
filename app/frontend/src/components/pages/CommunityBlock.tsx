import { BriefcaseIcon, AcademicCapIcon, UsersIcon, PlayIcon } from '@heroicons/react/24/outline';

import { Anchor, Container, Title, Text, SimpleGrid, Card, ThemeIcon, Stack } from '@mantine/core';


interface Channel {
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface CommunityContent {
  title: string;
  description: string;
  channels: Channel[];
}

const DEFAULT_CONTENT = {
  title: 'Наше сообщество',
  description:
    'Мы работаем вместе с ведущими образовательными платформами и IT-сообществами для вашего профессионального роста',
  channels: [
    {
      icon: 'telegram',
      title: 'Хекслет Карьера',
      description: 'Карьерный центр для IT-специалистов',
      link: 'https://career.hexlet.io/',
      color: 'violet',
    },
    {
      icon: 'discord',
      title: 'Хекслет',
      description: 'Образовательная платформа для разработчиков',
      link: 'https://ru.hexlet.io/',
      color: 'indigo',
    },
    {
      icon: 'run-it',
      title: 'Run IT',
      description: 'Сообщество IT-профессионалов',
      link: 'https://runit.hexlet.ru/',
      color: 'teal',
    },
    {
      icon: 'youtube',
      title: 'Хекслет YouTube',
      description: 'Видеоуроки и вебинары',
      link: 'https://www.youtube.com/@HexletOrg',
      color: 'red',
    },
  ],
};

const ICON_MAP: Record<string, React.ElementType> = {
  telegram: BriefcaseIcon,
  discord: AcademicCapIcon,
  'run-it': UsersIcon,
  youtube: PlayIcon,
};

const CommunityBlock = ({ content = DEFAULT_CONTENT }: { content?: CommunityContent }) => {
  return (
    <Container size="xl" py="xl">
      <Stack align="center" gap="xs">
        <Title ta="center" order={2}>
          {content.title}
        </Title>
        <Text ta="center" c="dimmed" maw={600} mx="auto">
          {content.description}
        </Text>
      </Stack>
      <SimpleGrid mt={40} cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {content.channels.map((channel) => {
          const Icon = ICON_MAP[channel.icon];
          return (
            <Card
              key={channel.title}
              withBorder
              radius="md"
              p="xl"
            >
              <Stack align="center">
                <ThemeIcon size={64} radius="md" color={channel.color || 'blue'} variant="filled">
                  {Icon && <Icon className="w-6 h-6" />}
                </ThemeIcon>
                <Text ta="center" fw={700}>
                  {channel.title}
                </Text>
                <Text ta="center" c="dimmed" size="sm">
                  {channel.description}
                </Text>
                <Anchor size="sm" fw={500} c="cyan.7" target="_blank" href={channel.link} rel="noopener noreferrer">
                  Перейти →
                </Anchor>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default CommunityBlock;
