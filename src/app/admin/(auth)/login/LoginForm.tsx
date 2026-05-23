'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { z } from 'zod';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setErrorMessage('Invalid email or password. After 5 failed attempts your account will be locked for 15 minutes.');
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-star-field opacity-30" aria-hidden />
      <div className="absolute inset-0 bg-nebula opacity-20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-black to-black" aria-hidden />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-lg shadow-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-bold">Admin Access</h1>
            <p className="mt-2 text-sm text-white/70">
              Secure portal for Cine Magic Creations team
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@cinemagic.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
              <Sparkles className="mr-2 h-5 w-5" />
              Enter Dashboard
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/50">
            Protected by NextAuth. Unauthorized access is prohibited.
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default LoginForm;
