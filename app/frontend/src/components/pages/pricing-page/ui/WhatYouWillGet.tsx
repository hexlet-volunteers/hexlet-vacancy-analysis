import { Title, Text, Stack, Flex, ThemeIcon} from "@mantine/core";
import { featuresData, type FeatureCardData } from "../api/data";

interface FeatureCardProps {
 icon: FeatureCardData["icon"];
 title: FeatureCardData["title"];
 description: FeatureCardData["description"];
}

const FeatureCard: React.FC<FeatureCardProps> = (props) => {
 const Icon = props.icon;

 return (
  <Flex
   p="lg"
   bdrs="md"
   bg="#0A192F"
   direction="column"
   align="center"
   ta="center"
   w="300px"
   m={10}
   
  >
   <ThemeIcon
    color="#1b5b6b"
    size="xl"
    radius="xl"
    mb="20px"
    w="40px"
    h="40px"
    p="5px"
   >
    <Icon color="#4ECDC4" />
   </ThemeIcon>
   <Text c="white" pb="10px" fz="xl">
    {props.title}
   </Text>
   <Text c="dimmed">{props.description}</Text>
  </Flex>
 );
};

const WhatYouWillGet = () => {
 return (
  <Stack
   ml="auto"
   mr="auto"
   pt="25px"
   pb="40px"
   bg="#0A192F"
   maw="1120px"
   w="100%"
   bdrs={8}
  >
   <Title order={2} c="white" ta="center">
    {" "}
    Что вы получаете{" "}
   </Title>
   <Flex direction={{ base: "column", md: "row" }} align="center">
    {featuresData.map((feature) => (
     <FeatureCard
      key={feature.id}
      icon={feature.icon}
      title={feature.title}
      description={feature.description}
     />
    ))}
   </Flex>
  </Stack>
 );
};

export default WhatYouWillGet;
