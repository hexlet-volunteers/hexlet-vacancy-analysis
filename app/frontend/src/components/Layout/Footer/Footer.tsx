import { Link } from "@inertiajs/react";
import {
 Container,
 Flex,
 Text,
 Stack,
 Anchor,
 Group,
 Box,
 Title,
 Divider,
 ThemeIcon,
} from "@mantine/core";
// Импортируем Heroicons (outline или solid)
import {
 ChatBubbleLeftRightIcon,
 GlobeAltIcon,
 PlayIcon,
} from "@heroicons/react/24/outline";
import { ArrowTrendingUpIcon } from "@heroicons/react/16/solid";

const navSections = [
 {
  title: "Продукт",
  links: [
   { label: "Дашборд", href: "#" },
   { label: "Аналитика", href: "#" },
   { label: "Вакансии", href: "/vacancies" },
   { label: "Карта", href: "#" },
   { label: "Тота ИИ", href: "#" },
  ],
 },
 {
  title: "Компании",
  links: [
   { label: "О нас", href: "/" },
   { label: "Для агенств", href: "/foragencies" },
   { label: "Блог", href: "#" },
   { label: "Отзывы", href: "#" },
   { label: "Сообщество", href: "#" },
  ],
 },
 {
  title: "Поддержка",
  links: [
   { label: "Документация", href: "#" },
   { label: "FAQ", href: "#" },
   { label: "Техподдержка", href: "#" },
   { label: "Тарифы", href: "#" },
   { label: "Контакты", href: "#" },
  ],
 },
];

const Footer = () => {
 const currentYear = new Date().getFullYear();

 const groups = navSections.map((group) => {
  const links = group.links.map((link, index) => (
   <Anchor
    key={index}
    component={Link}
    href={link.href}
    c="gray.5"
    size="sm"
    underline="hover"
   >
    {link.label}
   </Anchor>
  ));

  return (
   <Stack key={group.title} gap="xs" miw="150px">
    <Text fw={700} c="white" size="sm">
     {group.title}
    </Text>
    {links}
   </Stack>
  );
 });

 return (
  <Box component="footer" bg="#001B3A" py={60}>
   <Container size="lg">
    <Flex
     justify="space-between"
     align="flex-start"
     direction={{ base: "column", md: "row" }}
     gap={{ base: 40, md: 50 }}
    >
     <Stack gap="md" flex={1}>
      <Group gap="xs">
       <ThemeIcon color="transparent">
        <ArrowTrendingUpIcon color="#4ECDC4" />
       </ThemeIcon>
       <Title order={4} c="white" fw={700}>
        Skill Pulse
       </Title>
      </Group>

      <Text c="gray.5" size="sm" maw={320} lh="1.6">
       Современная аналитика рынка IT-вакансий для принятия взвешенных карьерных
       решений.
      </Text>

      <Group gap="md">
       <ThemeIcon color="transparent">
        <GlobeAltIcon color="#868e96" />
       </ThemeIcon>
       <ThemeIcon color="transparent">
        <ChatBubbleLeftRightIcon color="#868e96" />
       </ThemeIcon>
       <ThemeIcon color="transparent">
        <PlayIcon color="#868e96" />
       </ThemeIcon>
      </Group>
     </Stack>

     <Flex
      gap={{ base: 40, sm: 60, lg: 100 }}
      direction={{ base: "column", xs: "row" }}
      flex={1}
      justify={{ base: "flex-start", md: "flex-end" }}
     >
      {groups}
     </Flex>
    </Flex>
    <Divider my={30} color="rgba(255, 255, 255, 0.1)" />

    <Flex
     justify="space-between"
     align="center"
     direction={{ base: "column", sm: "row" }}
     gap="md"
    >
     <Text c="#868e96" size="xs">
      © {currentYear} Skill Pulse. Все права защищены.
     </Text>

     <Group gap="xl">
      <Anchor
       component={Link}
       href="#"
       c="#868e96"
       size="xs"
       underline="hover"
      >
       Политика конфиденциальности
      </Anchor>
      <Anchor
       component={Link}
       href="#"
       c="#868e96"
       size="xs"
       underline="hover"
      >
       Условия использования
      </Anchor>
     </Group>
    </Flex>
   </Container>
  </Box>
 );
};

export default Footer;
