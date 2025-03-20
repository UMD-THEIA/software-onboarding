import '../../App.css'
import TokenCarousel from '../Tokens/TokenCarousel';



const setupGuides = [
  {
    image: "/images/windows.png",
    title: "Windows",
    date: "March 19, 2025",
    summary: "How to configure Windows with WSL, Docker Desktop, Git, and Rust to work on our codebase.",
    url: "/setup/windows",
  },
  {
    image: "/images/apple.png",
    title: "Mac",
    date: "March 19, 2025",
    summary: "How to configure Mac with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/mac",
  },
  {
    image: "/images/ubuntu.png",
    title: "Ubuntu",
    date: "March 19, 2025",
    summary: "How to configure Ubuntu with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/ubuntu",
  },
  {
    image: "/images/arch.png",
    title: "Arch",
    date: "March 19, 2025",
    summary: "How to configure Arch with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/arch",
  },
  {
    image: "/images/nixos.png",
    title: "NixOS",
    date: "March 19, 2025",
    summary: "How to configure NixOS with Docker, Git, and Rust to work on our codebase.",
    url: "/setup/nixos",
  },

];


export default function SetupHome() {
  return (
    <>
      <p>Please select one of our pre-supported OSes to set up with.<br /> If you use a different OS we may not be able to help you.</p>
      <TokenCarousel tokens={setupGuides} useMiniToken={false} />
    </>

  );
}