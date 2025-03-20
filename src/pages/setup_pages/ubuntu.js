import '../../App.css'
import React from "react";
import CodeBlock from "../../CodeBlock";
import "./setup.css";
import { GithubSSH, GitClone } from "./common-setup"

export default function Ubuntu() {
    const dockerInstall = `sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Add the repository to Apt sources:
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "\${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update`;

    return (
      <div>
      <h2 className='setupText'>Setting up for Ubuntu/Mint</h2>
      <h3 className='setupText'>Setting up Docker</h3>
      <p className='setupText'>This guide attempts to streamline the more detailed process outlined <a rel="noreferrer" href="https://docs.docker.com/engine/install/ubuntu/" target="_blank">here</a>.</p>
      <p className='setupText'>1. Install using Apt</p>
      <CodeBlock language="shell" code={dockerInstall} />

      <p className='setupText'>2. Install Docker Package</p>
      <CodeBlock language="shell" code={`sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`} />

      <p className='setupText'>3. Add Your User to the Docker Group (Allows running Docker without sudo)</p>
      <CodeBlock language="shell" code={`sudo usermod -aG docker $USER`} />
      <p className='setupText'>At this point, please restart your computer to continue the installation process.</p>
      <p className='setupText'>4. Verify Installation</p>
      <CodeBlock language="shell" code={`docker run hello-world`} />

      <h3 className='setupText'>Setting up Git</h3>
      <CodeBlock language="shell" code={`sudo apt install -y git`} />
      <p className='setupText'>Once installed, configure your Git user</p>
      <CodeBlock language="shell" code={`git config --global user.name "YourUsername"\ngit config --global user.email "youremail@example.com"`} />
      <p className='setupText'>(Optional) Enable Git LFS</p>
      <CodeBlock language="shell" code={`git lfs install`} />
      
      <GithubSSH />

      <h3 className='setupText'>Setting up Development Environment</h3>
      <p className='setupText'>Install Rust. Visit <a href="https://www.rust-lang.org/tools/install" target="_blank" rel="noreferrer">this website</a> for information</p>

      <GitClone />
      <h3 className='setupText'>Fin.</h3>
    </div>
    
    );
  }