import React from 'react';
import { ArrowTrendingUpIcon } from "@heroicons/react/16/solid";
import { CurrencyDollarIcon, LightBulbIcon, CheckIcon } from "@heroicons/react/24/outline";



interface FaqItem {
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    question: "Можно ли отменить подписку?",
    answer: "Да, вы можете отменить подписку в любой момент без штрафов.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer: "Принимаем банковские карты, СБП, PayPal и криптовалюту.",
  },
  {
    question: "Есть ли скидки для студентов?",
    answer: "Да! Студентам предоставляется скидка 50% на все тарифы.",
  },
  {
    question: "Можно ли перейти на другой тариф?",
    answer: "Конечно! Вы можете изменить тариф в любое время.",
  },
];

export interface FeatureCardData {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export const featuresData: FeatureCardData[] = [
  {
    id: 'career-growth',
    icon: ArrowTrendingUpIcon,
    title: 'Рост карьеры',
    description: 'Персональные рекомендации для развития',
  },
  {
    id: 'salary-increase',
    icon: CurrencyDollarIcon,
    title: 'Увеличение зарплаты',
    description: 'Данные для успешных переговоров',
  },
  {
    id: 'ai-assistant',
    icon: LightBulbIcon,
    title: 'AI помощник',
    description: 'Умный ассистент для карьерных решений',
  },
  {
    id: 'accurate-forecasts',
    icon: CheckIcon,
    title: 'Точные прогнозы',
    description: 'Аналитика трендов и востребованности',
  },
];