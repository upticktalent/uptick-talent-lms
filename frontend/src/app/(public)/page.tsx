import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Box from '@/components/ui/box';

const LandingPage = () => {
  return (
    <Box className="min-h-screen bg-black flex flex-col font-sans">
      {/* --- Hero Section --- */}
      <Box
        as="section"
        className="relative flex flex-col items-center justify-center pt-[150px] pb-[100px] min-h-screen md:h-auto overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="w-full h-full bg-gradient-to-b from-black via-[#0b0b0f] to-[#1a1a1a] opacity-90" />
          <Image
            src="/images/hero-bg.webp"
            alt="Hero Background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>

        <Box className="w-full flex flex-col gap-[46px] justify-center items-center px-3 xl:px-[60px] md:px-10 z-[2] pt-[110.5px] pb-[104.5px]">
          {/* Main Heading */}
          <Box as="h1">
            <p className="font-bold text-[34px] md:text-[72px] px-1 w-full lg:max-w-[900px] text-center leading-[1.2] text-white">
              <span>Discover Your Potential with </span>
              <span className="text-[#477BFF]">Uptick Talent</span>
            </p>
          </Box>

          {/* Subtext */}
          <p className="w-full max-w-[700px] text-white text-center text-[20px] leading-[160%] font-normal">
            Uptick Talent incubates and empowers the next generation of great technology and
            business talent through innovative solutions.
          </p>

          {/* Action Buttons */}
          <Box className="flex flex-col lg:flex-row items-center justify-center gap-[23px] w-full">
            <Link href="/apply">
              <Button className="px-8 py-[28px] bg-[#477BFF] hover:bg-[#477BFF]/90 text-white font-semibold tracking-[1.25px] rounded-lg text-base">
                APPLY
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="outline"
                className="px-8 py-[28px] bg-transparent text-white border border-[rgba(255,255,255,0.30)] hover:bg-white/10 font-semibold tracking-[1.25px] rounded-lg text-base"
              >
                LEARN MORE
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Divider Line (from original site) */}
      <Box as="section" className="bg-[#111]">
        <Box className="w-full max-w-[1301px] h-[1px] bg-[#333] mx-auto"></Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
