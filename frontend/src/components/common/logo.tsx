import Link from 'next/link';
import Box from '../ui/box';
import Image from 'next/image';
import clsx from 'clsx';

interface LogoProps {
  linkTo?: string;
  className?: string;
  width?: number;
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  linkTo = '/',
  className = '',
  width = 120,
  clickable = true,
}) => {
  const logoElement = (
    <Image
      src="/uptick-logo.svg"
      alt="UPTICK TALENT Logo"
      width={width}
      height={29}
      className={clsx('bg-white p-2', className)}
      priority
    />
  );
  return clickable ? <Link href={linkTo}>{logoElement}</Link> : <Box>{logoElement}</Box>;
};

export { Logo };
