import { Link } from "@inertiajs/react";
import {
 Group,
 Button,
 Title,
 Container,
 Anchor,
 Box,
 Burger,
 Drawer,
 Stack,
 Divider,
 ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowTrendingUpIcon } from "@heroicons/react/16/solid";

const Header = () => {
 const [opened, { toggle, close }] = useDisclosure(false);

 const navLinks = [
  { label: "Дашборд", link: "#" },
  { label: "Аналитика", link: "#" },
  { label: "Вакансии", link: "/vacancies" },
  { label: "Карта", link: "#" },
  { label: "Тота ИИ", link: "#" },
  { label: "Для агентств", link: "/foragencies" },
  { label: "Блог", link: "#" },
 ];

 return (
  <Box component="header" bg="#001B3A" py="md">
   <Container size="xl">
    <Group justify="space-between">
     <Group gap="xs">
      <ThemeIcon color="transparent">
       <ArrowTrendingUpIcon color="#4ECDC4" />
      </ThemeIcon>
      <Title order={4} c="white" fw={700}>
       Skill Pulse
      </Title>
     </Group>

     <Group gap="lg" visibleFrom="md">
      {navLinks.map((link) => (
       <Anchor
        key={link.label}
        component={Link}
        href={link.link}
        c="white"
        fz="sm"
        fw={500}
        td="none"
       >
        {link.label}
       </Anchor>
      ))}
     </Group>

     <Group gap="lg" visibleFrom="md">
      <Button component={Link} bg="transparent" href="#" c="white" size="sm" fw={500}>
       Войти
      </Button>
      <Button component={Link} bg="#20b2aa" radius="md">
       Начать бесплатно
      </Button>
     </Group>

     <Burger
      opened={opened}
      onClick={toggle}
      hiddenFrom="md"
      size="sm"
      color="white"
     />
    </Group>
   </Container>

   <Drawer
    opened={opened}
    onClose={close}
    size="100%"
    padding="md"
    hiddenFrom="md"
    title="Навигация"
    zIndex={1000}
    classNames={{
    content: '!bg-[#001B3A] !text-white',
    title: '!text-2xl !font-bold',
    header: '!bg-[#001B3A] !text-white',
    close: '!text-white hover:!bg-white/10',     
  }}
   >
    <Stack gap="md" mt="xl">
     {navLinks.map((link) => (
      <Anchor
       key={link.label}
       href={link.link}
       component={Link}
       size="lg"
       c="white"
       underline="never"
       onClick={close}
      >
       {link.label}
      </Anchor>
     ))}

     <Divider my="sm" color="white" />

     <Button
      component={Link}
      href="#"
      c="white"
      size="lg"
      bg="#20b2aa"
      fullWidth
      onClick={close}
     >
      Войти
     </Button>

     <Button component={Link} href="#" bg="#20b2aa" size="lg" fullWidth>
      Начать бесплатно
     </Button>
    </Stack>
   </Drawer>
  </Box>
 );
};

export default Header;
