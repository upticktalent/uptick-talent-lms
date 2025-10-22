import Box from '@/components/ui/box';
import { Users } from '@/types/auth';
import { useSearchParams } from 'next/navigation';
import { getters } from '@/lib/config/i18n';

const Welcome = () => {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as Users) || 'student';
  const lang = 'en';

  const text = getters.geti18ns()[lang].login;

  return (
    <Box className="w-full max-w-md max-auto mb-8">
      <Box as="h1" className="text-4xl md:5xl font-semibold leading-tight text-white text-center">
        {text.title}
      </Box>

      <Box
        as="p"
        className="mt-4 text-sm md:text-base text-gray-300 text-center max-w-[36rem] mx-auto"
      >
        {text.subtitles[role]}
      </Box>
    </Box>
  );
};

export { Welcome };
