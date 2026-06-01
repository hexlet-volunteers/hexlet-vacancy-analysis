import { Box, Stack, Title, Text, TextInput, Button, Group, Center } from '@mantine/core';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useForm, isEmail } from '@mantine/form';
import { useState, useEffect } from 'react';

interface NewsletterSubscriptionProps {
  onSubmit: (email: string) => void | Promise<void>;
}

type FormValues = {
  email: string;
};

const NewsletterSubscription = ({ onSubmit }: NewsletterSubscriptionProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Некорректный формат email.'),
    },
  });
  const emailProps = form.getInputProps('email');

  const handleFormSubmit = async (values: FormValues) => {
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await onSubmit(values.email);
      setStatus('success');
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      form.setFieldError('email', errorMessage || 'Произошла ошибка. Попробуйте позже.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status !== 'success') return;

    const timer = setTimeout(() => setStatus('idle'), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <Box bg="#0D2E46" p="xl" bdrs="md">
      <Stack align="center" gap="md">
        <Center>
          <EnvelopeIcon color="cyan" width={50} height={50} aria-hidden="true" />
        </Center>
        <Title order={3} ta="center" c="white">
          Подпишитесь на рассылку
        </Title>
        <Text c="white" opacity={0.6} ta="center">
          Получайте еженедельный дайджест лучших статей и эксклюзивные материалы
        </Text>
        <form onSubmit={form.onSubmit(handleFormSubmit)} style={{ width: '100%' }}>
          <Group gap="md" justify="center" align="flex-start" wrap="wrap">
            <Box className="w-full sm:w-[300px] min-h-[90px]">
              <TextInput
                type="email"
                aria-label="Ваш email"
                aria-invalid={!!form.errors.email}
                placeholder="Ваш email"
                size="md"
                radius="md"
                {...emailProps}
                onChange={(e) => {
                  emailProps.onChange(e);
                  if (status === 'success') setStatus('idle');
                }}
                classNames={{
                  input:
                    '!w-full !bg-white/10 !border-white/20 !text-white !placeholder:text-white/50',
                  error: 'mt-1 text-sm text-center sm:text-left',
                }}
              ></TextInput>
              {status === 'success' && !form.errors.email && (
                <Text c="green.4" size="sm" ta={{ base: 'center', sm: 'left' }}>
                  Вы успешно подписались на рассылку!
                </Text>
              )}
            </Box>
            <Button
              color="cyan"
              radius="md"
              type="submit"
              size="md"
              loading={status === 'loading'}
              className="!w-full sm:!w-auto"
            >
              Подписаться
            </Button>
          </Group>
        </form>
      </Stack>
    </Box>
  );
};

export default NewsletterSubscription;
