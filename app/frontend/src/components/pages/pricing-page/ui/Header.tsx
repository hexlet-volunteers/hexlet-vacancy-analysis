import { Group, Text, Anchor, ThemeIcon, Flex, rem} from "@mantine/core";
import { ArrowTrendingUpIcon } from "@heroicons/react/16/solid";
import { HomeIcon } from "@heroicons/react/24/outline";

const Header = () => {
 return (
  <Flex
   component="header"
   bg="#0A192F"
   align="center"
   justify="center"
   c="white"
   h={60}
   w="100%"
  >
   <Group
    justify="space-between"
    maw="1100px"
    w="100%"
    p="0 1rem"
   >
    <Flex align="center" gap="10px">
     <ThemeIcon color="#0A192F">
      <ArrowTrendingUpIcon color="#4ECDC4" />
     </ThemeIcon>
     <Text fw={700} size="md" lh={1}>
      Skill Pulse
     </Text>
    </Flex>
    <Flex align="center" gap="30px">
    <Anchor href="/" c="white">
       <Text fw={600} c="white">Для агенств</Text>
     </Anchor>
     <Anchor href="/" c="white">
      <Flex align="center" ta="center" gap={rem(4)}>
       <ThemeIcon color="#0A192F">
        <HomeIcon />
       </ThemeIcon>
       <Text fw={600}>На главную</Text>
      </Flex>
     </Anchor>
    </Flex>
   </Group>
  </Flex>
 );
};

export default Header;

