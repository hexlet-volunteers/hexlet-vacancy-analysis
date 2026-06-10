import {
  Container,
  Title,
  Text,
  Center,
  Card,
  Flex,
  Group,
  Avatar,
  Stack,
  Divider,
  Rating,
} from "@mantine/core";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

interface TestimonialsData {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

interface TestimonialItem {
  id: number;
  avatar: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
}

const TestimonialsBlock = (content: TestimonialsData) => {
  const { title, subtitle, testimonials } = content;
  return (
    <Container size="lg" pt="lg">
      <Center>
        <Title order={2} ta="center">
          {title}
        </Title>
      </Center>
      <Center mb="xl">
        <Text ta="center">{subtitle}</Text>
      </Center>
      <Center>
        <Flex gap="md" direction={{ base: "column", sm: "row" }}>
          {testimonials.map((testimonial) => {
            return (
              <Card
                padding="xs"
                withBorder
                key={testimonial.id}
                id={testimonial.id.toString()}
                flex={1}
                shadow="xs"
              >
                <Group gap="xs" mb="lg">
                  <Avatar src={testimonial.avatar} radius={0}></Avatar>
                  <Stack gap={0}>
                    <Text fw="bold">{testimonial.name}</Text>
                    <Text>{testimonial.role}</Text>
                  </Stack>
                </Group>
                <Rating defaultValue={testimonial.rating} mb="lg" readOnly />
                <Text mb="lg">"{testimonial.text}"</Text>
                <Divider mb="lg" />
                <Group gap="xs" mb="lg">
                  <BuildingOffice2Icon className="h-5 w-5 text-gray-500" />
                  <Text c="dimmed" size="sm">
                    {testimonial.company}
                  </Text>
                </Group>
              </Card>
            );
          })}
        </Flex>
      </Center>
    </Container>
  );
};

export default TestimonialsBlock;
