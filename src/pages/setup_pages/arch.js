import '../../App.css'
import React from "react";
import CodeBlock from "../../CodeBlock";
import "./setup.css";
import { GithubSSH, GitClone, VsCode } from "./common-setup"

export default function ArchLinux() {
    const dockerInstall = `sudo pacman -Syu --noconfirm
sudo pacman -S --noconfirm docker

# Enable and start the Docker service
sudo systemctl enable docker
sudo systemctl start docker`;

    return (
      <div>
      <h2 className='setupText'>Setting up for Arch Linux/Manjaro</h2>
      <h3 className='setupText'>Setting up Docker</h3>
      <p className='setupText'>1. Install using Pacman</p>
      <CodeBlock language="shell" code={dockerInstall} />

      <p className='setupText'>2. Add Your User to the Docker Group (Allows running Docker without sudo)</p>
      <CodeBlock language="shell" code={`sudo usermod -aG docker $USER`} />
      <p className='setupText'>At this point, please restart your computer to continue the installation process.</p>
      <p className='setupText'>3. Verify Installation</p>
      <CodeBlock language="shell" code={`docker run hello-world`} />

      <h3 className='setupText'>Setting up Git</h3>
      <CodeBlock language="shell" code={`sudo pacman -S --noconfirm git`} />
      <p className='setupText'>Once installed, configure your Git user</p>
      <CodeBlock language="shell" code={`git config --global user.name "YourUsername"\ngit config --global user.email "youremail@example.com"`} />
      <p className='setupText'>(Optional) Enable Git LFS</p>
      <CodeBlock language="shell" code={`sudo pacman -S --noconfirm git-lfs\ngit lfs install`} />
      
      <GithubSSH />

      <h3 className='setupText'>Setting up Development Environment</h3>
      <p className='setupText'>Install Rust. Visit <a href="https://www.rust-lang.org/tools/install" target="_blank" rel="noreferrer">this website</a> for information</p>

      <GitClone />
      <VsCode />
      <h3 className='setupText'>Fin.</h3>
    </div>
    );
}
