import { Provider } from "react-redux";
import { useMemo } from "react";
import { Alert, Text } from "@mantine/core";
import { Link } from "@inertiajs/react";

import { setupStore } from "../../store/store";
import PricingPage from "./pricing-page/ui/PricingPage";

type Features = {
 name: string;
};

type Plan = {
 id: string;
 name: string;
 description: string;
 price: string;
 currency: string;
 period: string;
 features: Features[];
};

type Props = {
 plans: Plan[];
};

const PricingPageWrapper = ({ plans }: Props) => {
 const store = useMemo(() => {
  return setupStore({
   plans: {
    items: plans,
   },
  });
 }, [plans]);

 if (!plans) {
  return (
   <Alert bg="red">
    <Text>Что-то пошло не так.</Text>
    <Link href="/pricing" style={{ color: "white" }}>
     Пожалуйста, перезагрузите страницу.
    </Link>
   </Alert>
  );
 }

 return (
  <Provider store={store}>
   <PricingPage />
  </Provider>
 );
};

export default PricingPageWrapper;
