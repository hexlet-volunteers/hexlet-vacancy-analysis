import {
 Paper,
 Title,
 Text,
 Stack,
 Group,
 ThemeIcon,
 Button,
 Badge,
} from "@mantine/core";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type Features = {
 name: string;
};

interface PricingCardProps {
 id: string;
 name: string;
 description: string;
 price: string;
 currency: string;
 period: string;
 features: Features[];
}

const PricingCard = (props: PricingCardProps) => {
 // Предполагается, что данные о популярном тарифе приходят с бекенда, например, по ключу "highlight".
 // Пока данных нет, используется вспомогательная функция isPopularPlan,
 // чтобы один из тарифов отображать с бейджом "Популярный" и зеленой рамкой

 const isPopularPlan = (name: string) => name === "Профессиональный";

 const popularPlan = isPopularPlan(props.name);

 const cardBorderColor = popularPlan ? "#4ECDC4" : "#808080";

 const buttonBackGroundColor = popularPlan ? "#4ECDC4" : "#ede8e8";

 const buttonColor = popularPlan ? "#FFFFFF" : "black";

 return (
  <Paper
   p="xl"
   radius="lg"
   style={{
    border: `1px solid ${cardBorderColor}`,
    position: "relative",
    display: "flex",
    flex: 1,
    minWidth: "280px",
    maxWidth: "350px",
    backgroundColor: "white",
   }}
  >
   {popularPlan && (
    <Badge
     color="#4ECDC4"
     variant="filled"
     radius="xl"
     style={{
      position: "absolute",
      top: "-10px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px",
     }}
    >
     Популярный
    </Badge>
   )}
   <Stack gap="md" h="100%" w="100%">
    <Title order={3} ta="center" c="dark">
     {props.name}
    </Title>
    <Text ta="center" size="sm" c="dimmed">
     {props.description}
    </Text>

    <Text ta="center" size="20px" fw={700}>
     <Text span c="#4ECDC4" size="35px" fw={700}>
      {`${props.currency}${props.price} `}
     </Text>
     /{props.period}
    </Text>

    <Stack
     gap="xs"
     mt="md"
     w="100%"
     style={{ flexGrow: 1, alignSelf: "stretch" }}
    >
     {props.features.map((feature, index) => (
      <Group key={index} wrap="nowrap" align="flex-start" w="100%">
       <ThemeIcon size="sm" radius="xl" color="#4ECDC4" variant="light">
        <CheckCircleIcon />
       </ThemeIcon>
       <Text size="sm" c="dark">
        {feature.name}
       </Text>
      </Group>
     ))}
    </Stack>

    <Button
     fullWidth
     mt="auto"
     color={buttonBackGroundColor}
     radius="md"
     style={{ color: buttonColor }}
    >
     Выбрать план
    </Button>
   </Stack>
  </Paper>
 );
};

export default PricingCard;
