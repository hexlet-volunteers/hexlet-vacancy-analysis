import { Group, ThemeIcon } from "@mantine/core";
import {
 Stack,
 Flex,
 Box,
 Title,
 Text,
 Button,
 Card,
 rem,
} from "@mantine/core";
import { advantages, hashmapForAdvantagesIcons, features } from "../api/data";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const advantagesDataWithIcons = advantages.map((advantage) => {
 const advantageIcon = hashmapForAdvantagesIcons[advantage.icon];
 return { ...advantage, iconEl: advantageIcon };
});

const Advantages = () => {
 return (
  <Stack gap="lg" pb="20px" w="100%" maw="556px" mx="auto">
   {advantagesDataWithIcons.map((advantage, index) => (
    <Group key={index} wrap="nowrap">
     <ThemeIcon
      size="lg"
      radius="md"
      variant="light"
      color="#4ECDC4"
      style={{
       backgroundColor: "transparent",
       border: "1px solid #4ECDC4",
      }}
     >
      <advantage.iconEl />
     </ThemeIcon>
     <Stack gap={4} ta="left">
      <Text fw={700} c="white">
       {advantage.title}
      </Text>
      <Text size="sm" c="dimmed">
       {advantage.description}
      </Text>
     </Stack>
    </Group>
   ))}
  </Stack>
 );
};

const CorporateSolutionBlock = () => {
 return (
  <Stack
   c="white"
   style={{
    width: "100%",
   }}
   py={{ base: "md", md: "xl" }}
   bg="#082c4c"
  >
   <Flex
    direction={{ base: "column", md: "row" }}
    justify={{ base: "center", md: "space-between" }}
    align={{ base: "center", md: "flex-start" }}
    gap={{ base: "xl", md: "100px" }}
    maw="1300px"
    w="100%"
    m="0 auto"
    px={{ base: "md", sm: "lg", md: "xl" }}
   >
    <Box w={{ base: "100%", md: "600px" }} ta={{ base: "center", md: "left" }}>
     <Title
      order={1}
      fz={{ base: "42px", sm: "48px", md: "50px" }}
      lh={{ base: 1.2, md: 1.1 }}
      mb="md"
     >
      <Text component="span" inherit>
       Решение для
      </Text>
      <br />
      <Text component="span" inherit c="#4ECDC4">
       агенств и HR-команд
      </Text>
     </Title>
     <Text
      fz={{ base: "md", sm: "lg", md: "xl" }}
      mb="xl"
      maw={{ base: "100%", sm: "520px" }}
      mx={{ base: "auto", md: 0 }}
     >
      Мощные инструменты аналитики для рекрутинговых агенств, HR-отделов и
      кадровых агенств
     </Text>
     <Advantages />
     <Flex
      gap="lg"
      direction={{ base: "column", sm: "row" }}
      pb="xl"
      maw={{ base: "100%", sm: "530px" }}
      mx={{ base: "auto", md: 0 }}
     >
      <Button
       style={{
        backgroundColor: "#4ECDC4",
        transition: "background-color 0.3s",
       }}
       fullWidth
       aria-label="Узнать подробнее"
       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3BB2A0")}
       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4ECDC4")}
       size="md"
      >
       Узнать подробнее
      </Button>
      <Button
       style={{
        backgroundColor: "white",
        color: "black",
        transition: "background-color 0.3s",
       }}
       fullWidth
       aria-label="Связаться с нами"
       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F0F0")}
       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
       size="md"
      >
       Связаться с нами
      </Button>
     </Flex>
    </Box>
    <Card
     radius="lg"
     mt="30px"
     mb="30px"
     p="15px"
     shadow="md"
     maw={rem(580)}
     w="100%"
     bg="#224968"
     c="white"
     bd="1px solid rgba(255, 255, 255, 0.1)"
    >
     <Title
      ta="center"
      fz={{ base: "42px", sm: "48px", md: "50px" }}
      c="#4ECDC4"
     >
      Корпоративный
     </Title>
     <Text ta="center" p="10px"> От Р49,990/мес</Text>
     {features.map((feature, index) => (
      <Group key={index} wrap="nowrap" align="flex-start" w="100%" mb="5px">
       <ThemeIcon
        size="md"
        radius="xl"
        color="#4ECDC4"
        bg="none"
        variant="light"
       >
        <CheckCircleIcon />
       </ThemeIcon>
       <Text size="md" c="white">
        {feature}
       </Text>
      </Group>
     ))}
     <Button
      mt="10px"
      mb="10px"
      style={{
       backgroundColor: "#4ECDC4",
       transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3BB2A0")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4ECDC4")}
     >
      Оставить заявку
     </Button>
    </Card>
   </Flex>
  </Stack>
 );
};

export default CorporateSolutionBlock;
