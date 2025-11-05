import Box from '@/components/ui/box';
import { Roles, Users } from '@/types/auth';
import { useSearchParams } from 'next/navigation';

const LoginImage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role' as Users) || Roles.STUDENT;

  const image: Record<typeof role, string> = {
    student: '/images/auth-img-1.jpg',
    mentor: '/images/auth-img-2.jpg',
  };

  return (
    <Box
      as="img"
      src={image[role]}
      alt="Uptick branding"
      className="hidden md:block w-full h-full object-cover md:rounded-tr-4xl md:rounded-br-4xl"
    />
  );
};

export { LoginImage };
