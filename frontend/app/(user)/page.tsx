import type { Metadata } from "next";
import HeroSection from "@/components/user/HeroSection";
import ContentSection from "@/components/user/ContentSection";

export const metadata: Metadata = {
  title: "Khám Phá Bản Đồ Năng Lượng | VGTech MD",
  description:
    "Tra cứu bản đồ năng lượng cá nhân qua Human Design và Thần số học. Hiểu rõ cơ chế ra quyết định, tiềm năng bẩm sinh và con đường phát triển tự nhiên nhất của bạn.",
  openGraph: {
    title: "Khám Phá Bản Đồ Năng Lượng | VGTech MD",
    description:
      "Tra cứu bản đồ năng lượng cá nhân qua Human Design và Thần số học.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ContentSection />
    </>
  );
}
