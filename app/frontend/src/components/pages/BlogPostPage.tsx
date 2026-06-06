import {
  Container,
  Title,
  Text,
  Image,
  Group,
  Box,
  Badge,
  Flex,
  Stack,
  Grid,
  Button,
  Card,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { UserIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { ElementType } from 'react';

interface FullPost {
  id: number;
  title: string;
  content_full: string;
  created_at: string;
  duration_minutes: string;
  category: string;
  author: string;
  tags: string[];
  image?: string;
  author_about?: string;
  recommended_posts?: ShortPost[];
}

interface ShortPost {
  id: number;
  title: string;
  content_short: string;
  category__name: string;
  author__first_name: string;
  created_at: string;
  duration_minutes: string;
}

interface BlogPostPageProps {
  post: FullPost;
}

type MetaItemProps = {
  icon: ElementType;
  value: React.ReactNode;
};


const MetaItem = ({icon: Icon, value} : MetaItemProps) => {
  return (
    <Group gap="xs">
      <Icon
        style={{
          width: 18,
          height: 18,
          color: 'var(--mantine-color-dimmed)',
        }}
      />
      <Text size="sm">{value}</Text>
    </Group>
  )
}

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  return (
    <Container pt="xl" pb="xl" size="md">
      <Stack gap="md">
        <Badge variant="light" bd="1px solid var(--mantine-color-blue-light-color)" tt="none">
          {post.category}
        </Badge>
        <Stack gap="sm">
          <Title order={1}>{post.title}</Title>
          <Group>
            <MetaItem icon={UserIcon} value={post.author} />
            <MetaItem icon={CalendarIcon} value={post.created_at} />
            <MetaItem icon={ClockIcon} value={post.duration_minutes} />
          </Group>
        </Stack>
        {post.image && (
          <Flex justify="center" align="center">
            <Image src={post.image} alt={post.title} w={200} h={200} fit="cover" />
          </Flex>
        )}
        <Box
          component="article"
          bd="1px solid var(--mantine-color-gray-2)"
          p="md"
          bdrs="md"
          dangerouslySetInnerHTML={{ __html: post.content_full }}
        />
        <Box bg="#0D2E46" px="lg" py="md" bdrs="md">
          <Grid align="center" c="white">
            <Grid.Col span={{ base: 12, sm: 1 }}>
              <Flex justify={{ base: 'center', sm: 'flex-start' }} align="center" h="100%">
                {post.image ? (
                  <Image src={post.image} alt={post.author} h={50} w={50} radius="xl" fit="cover" />
                ) : (
                  <Flex
                    bg="white"
                    c="#0D2E46"
                    p="xs"
                    bdrs="xl"
                    h={50}
                    w={50}
                    justify="center"
                    align="center"
                  >
                    <UserIcon style={{ width: 24, height: 24 }} />
                  </Flex>
                )}
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 9 }}>
              <Stack gap="sm">
                <Title order={4}>Автор: {post.author}</Title>
                {post.author_about && <Text>{post.author_about}</Text>}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 2 }}>
              <Button w="100%">Подписаться</Button>
            </Grid.Col>
          </Grid>
        </Box>
        {post.recommended_posts && post.recommended_posts.length > 0 && (
          <Box>
            <Title order={2}>Читайте также</Title>
            <SimpleGrid mt="sm" cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {post.recommended_posts.slice(0, 3).map((recommendedPost) => {
                return (
                  <Card key={recommendedPost.id} withBorder radius="md" p="lg">
                    <Stack h="100%" justify="space-between">
                      <Stack gap="xs">
                        <Badge variant="light" tt="none">
                          {recommendedPost.category__name}
                        </Badge>
                        <Title order={3}>{recommendedPost.title}</Title>
                        <Text lineClamp={3}>{recommendedPost.content_short}</Text>
                      </Stack>
                      <Box>
                        <Divider />
                        <Group justify="space-between">
                           <MetaItem icon={CalendarIcon} value={recommendedPost.created_at} />
                           <MetaItem icon={ClockIcon} value={recommendedPost.duration_minutes} />
                        </Group>
                      </Box>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default BlogPostPage;
