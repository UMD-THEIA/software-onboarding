import '../../App.css'
import React from "react";
import CodeBlock from "../../CodeBlock";
import "./setup.css";
import { GithubSSH, GitClone, VsCode } from "./common-setup"

export default function Windows() {
  return (<div>
    <h2 className='setupText'>Setting up for Windows</h2>

    <h3 className='setupText'>Install WSL</h3>
    <p className='setupText'>
      Open PowerShell as Administrator and run:
    </p>
    <CodeBlock language="shell" code={`wsl --install`} />
    <p className='setupText'>
      If that does not work, try installing Ubuntu explicitly:
    </p>
    <CodeBlock language="shell" code={`wsl.exe --install Ubuntu`} />
    <p className='setupText'>
      For troubleshooting, visit{" "}
      <a href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noreferrer">
        this link
      </a>.
    </p>

    <h3 className='setupText'>Install Docker</h3>
    <p className='setupText'>
      Install Docker Desktop via the Windows App Store.
    </p>

    <h3 className='setupText'>Update and Upgrade Packages in WSL</h3>
    <CodeBlock language="shell" code={`sudo apt update && sudo apt upgrade`} />

    <h3 className='setupText'>Install Rust</h3>
    <CodeBlock language="shell" code={`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`} />
    <p className='setupText'>
      If you run into issues, check the{" "}
      <a href="https://www.rust-lang.org/tools/install" target="_blank" rel="noreferrer">
        Rust installation guide
      </a>.
    </p>
    <p className='setupText'>
      Add Cargo to your PATH:
    </p>
    <CodeBlock language="shell" code={`echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc`} />

    <h3 className='setupText'>Setting up Github with an SSH Key</h3>
    <p className='setupText'>First, generate an SSH Key</p>
    <CodeBlock language="shell" code={`ssh-keygen -t ed25519 -C "your_email@example.com"`} />
    <p className='setupText'>When prompted, save the key in ~/.ssh/id_ed25519. You can enter a passphrase or leave it empty.</p>
   
    <p className='setupText'>Next, copy your SSH key into Github</p>
    <CodeBlock language="shell" code={`cat ~/.ssh/id_ed25519.pub`} />
    <p className='setupText'>Go to <a rel="noreferrer" href="https://github.com/settings/keys" target="_blank">GitHub SSH Keys</a>, click <b>New SSH Key</b>, paste your key, and save.</p>
    <p className='setupText'>Finally test the connection:</p>
    <CodeBlock language="shell" code={`ssh -T git@github.com`} />
    <p className='setupText'>You should expect the following outpute before it exits:</p>
    <CodeBlock language="shell" code={`Hi github_username! You've successfully authenticated, but GitHub does not provide shell access.`} />

    <h3 className='setupText'>Create a Development Directory</h3>
    <p className='setupText'>Inside WSL, create a folder for your project files:</p>
    <CodeBlock language="shell" code={`mkdir name_of_directory`} />

    <GitClone />

    <h3 className='setupText'>Set Up VS Code</h3>
    <p className='setupText'>
      (Optional but recommended)
    </p>
    <ul className='setupText'>
      <li>Download and install{" "}
        <a href="https://code.visualstudio.com/" target="_blank" rel="noreferrer">
          VS Code
        </a> for Windows
      </li>
      <li>Install the <strong>WSL Extension</strong> inside VS Code</li>
      <li>Open your WSL development directory with:
        <CodeBlock language="shell" code={`code .`} />
      </li>
    </ul>
    <VsCode />

    <h3 className='setupText'>Fin.</h3>
  </div>
  );
}
