import TokenCarousel from "./Tokens/TokenCarousel";
import HeroBanner from "./hero_banner/HeroBanner";
import '../App.css'
import TokenGrid from "./Tokens/TokenGrid";


const allGuides = [
  {
    image: "/images/windows.png",
    title: "Setting up Windows for Our Project",
    date: "March 19, 2025",
    summary: "How to configure Windows with WSL, Docker Desktop, Git, and Rust to work on our codebase.",
    url: "/setup/windows",
  },
  {
    image: "/images/apple.png",
    title: "Setting up Mac for Our Project",
    date: "March 19, 2025",
    summary: "How to configure Mac with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/mac",
  },
  {
    image: "/images/ubuntu.png",
    title: "Setting up Ubuntu for Our Project",
    date: "March 19, 2025",
    summary: "How to configure Ubuntu with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/ubuntu",
  },
  {
    image: "/images/arch.png",
    title: "Setting up Arch for Our Project",
    date: "March 19, 2025",
    summary: "How to configure Arch with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/arch",
  },
  {
    image: "/images/nixos.png",
    title: "Setting up NixOS for Our Project",
    date: "March 19, 2025",
    summary: "How to configure NixOS with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/nixos",
  },
  {
    image: "/images/rustacean-banner.png",
    title: "Introduction to Rust",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Cargo and Rust",
    url: "/rust",
  },
  {
    image: "/images/docker.webp",
    title: "Introduction to Docker",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Docker",
    url: "/docker",
  },
  {
    image: "/images/kubos.png",
    title: "Introduction to Kubos",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Docker",
    url: "/kubos",
  },
  {
    image: "/images/git.png",
    title: "Introduction to Git/Github",
    date: "March 19, 2025",
    summary: "A guide on how to use Git/Github",
    url: "/github",
  },
  {
    image: "/images/THEIA_PATCH_EXPORT 1.png",
    title: "Walkthrough of THEIA Software Codebase",
    date: "March 19, 2025",
    summary: "A breakdown of the code we use",
    url: "/codebase",
  },

];


const importantGuides = [
  {
    image: "/images/windows.png",
    title: "Setting up Windows for Our Project",
    date: "March 19, 2025",
    summary: "How to configure Windows with WSL, Docker Desktop, Git, and Rust to work on our codebase.",
    url: "/setup/windows",
  },
  {
    image: "/images/docker.webp",
    title: "Introduction to Docker",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Docker",
    url: "/docker",
  },
  {
    image: "/images/kubos.png",
    title: "Introduction to Kubos",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Docker",
    url: "/kubos",
  },
  {
    image: "/images/git.png",
    title: "Introduction to Git/Github",
    date: "March 19, 2025",
    summary: "A guide on how to use Git/Github",
    url: "/github",
  },
  {
    image: "/images/THEIA_PATCH_EXPORT 1.png",
    title: "Walkthrough of THEIA Software Codebase",
    date: "March 19, 2025",
    summary: "A breakdown of the code we use",
    url: "/codebase",
  },
  {
    image: "/images/rustacean-banner.png",
    title: "Introduction to Rust",
    date: "March 19, 2025",
    summary: "A brief walkthrough of Cargo and Rust",
    url: "/rust",
  },
];


export default function Home() {
  return (
    <div>

      <HeroBanner
        title="Software Onboarding"
        subtitle="by Marco Buschauer"
      />

      <h2>Important Guides</h2>
      <TokenCarousel tokens={importantGuides} />

      <h2>All Guides</h2>
      <TokenGrid tokens={allGuides} />
    </div>
  );
}