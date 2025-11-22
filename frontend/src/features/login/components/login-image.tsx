import { Users } from '@/types/auth';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const LoginImage = () => {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  let role: Users = 'STUDENT';
  if (roleParam === 'mentor') role = 'MENTOR';
  else if (roleParam === 'admin') role = 'ADMIN';
  else role = 'STUDENT';

  const image: Record<Users, string> = {
    STUDENT: '/images/auth-img-1.jpg',
    MENTOR: '/images/auth-img-2.jpg',
    ADMIN: '/images/auth-img-2.jpg',
  };

  return (
    <div className="relative hidden md:block w-full h-full">
      <Image
        src={image[role]}
        alt="Uptick branding"
        fill
        className="object-cover md:rounded-tr-4xl md:rounded-br-4xl"
        priority
      />
    </div>
  );
};

export { LoginImage };
