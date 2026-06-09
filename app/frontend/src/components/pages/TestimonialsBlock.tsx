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

// const dataStructure: TestimonialsData = {
//   title: "Как Skill Pulse помогает людям",
//   subtitle: "Истории успеха наших пользователей — от джунов до HR-менеджеров",
//   testimonials: [
//     {
//       id: 1,
//       avatar:
//         "https://em-content.zobj.net/source/apple/453/technologist_1f9d1-200d-1f4bb.png",
//       name: "Алексей Петров",
//       role: "Frontend разработчик",
//       company: "TechStart",
//       rating: 4,
//       text: "Skill Pulse помог мне понять, какие навыки сейчас в тренде. За три месяца подтянул слабые места и закрыл позицию Middle-разработчика.",
//     },
//     {
//       id: 2,
//       avatar:
//         "https://em-content.zobj.net/source/apple/453/woman-detective_1f575-fe0f-200d-2640-fe0f.png",
//       name: "Мария Иванова",
//       role: "HR Manager",
//       company: "Retail Group",
//       rating: 3,
//       text: "Использую Skill Pulse для мониторинга офферов бренда. Инструмент незаменим для анализа зарплатных ожиданий кандидатов на рынке.",
//     },
//     {
//       id: 3,
//       avatar:
//         "https://em-content.zobj.net/source/apple/453/man-mechanic_1f468-200d-1f527.png",
//       name: "Дмитрий Сидоров",
//       role: "Team Lead",
//       company: "FinTech Solutions",
//       rating: 5,
//       text: "Отличная аналитика для оценки команды. Помогает строить индивидуальные треки развития сотрудников без лишней бюрократии.",
//     },
//     {
//       id: 4,
//       avatar:
//         "https://em-content.zobj.net/source/apple/453/woman-artist_1f469-200d-1f3a8.png",
//       name: "Анна Кузнецова",
//       role: "Lead UX/UI Designer",
//       company: "Design Studio",
//       rating: 2,
//       text: "Порадовала идеальная адаптивность компонентов и внимание к деталям. UI-кит экономит кучу времени при проектировании интерфейсов. Порадовала идеальная адаптивность компонентов и внимание к деталям.",
//     },
//   ],
// };

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
