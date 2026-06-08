import { UserGroupIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon, ShieldCheckIcon, PhoneIcon } from "@heroicons/react/16/solid";
import React from "react";


type AdvantagesKeys = "user" | "circle" | "shield" | "phone";

export const hashmapForAdvantagesIcons: Record<AdvantagesKeys, React.ElementType<React.SVGProps<SVGSVGElement>>> = {
  user: UserGroupIcon,
  circle: CircleStackIcon,
  shield: ShieldCheckIcon,
  phone: PhoneIcon,
};

type Advantage = {
    icon: AdvantagesKeys;
    title: string;
    description: string;
}

export const advantages: Advantage[] = [
  {
    icon: "user",
    title: "Командная работа",
    description: "Управление доступами и совместная работа",
  },
  {
    icon: "circle",
    title: "API доступ",
    description: "Интеграция данных в ваши внутренние системы",
  },
  {
    icon: "shield",
    title: "Приоритетная поддержка",
    description: "Персональный менеджер и техподдержка 24/7 ",
  },
  {
    icon: "phone",
    title: "Расширенная аналитика",
    description: "Углубленные отчеты и кастомные дашборды",
  },
];

export const features: string[] = [
 "До 50 пользователей",
 "Безлимитные запросы",
 "Полная аналитика + AI",
 "API доступ",
 "Персональный менеджер",
 "SLA 99.9%",
 "Кастомные интеграции",
 "Обучение команды",
];