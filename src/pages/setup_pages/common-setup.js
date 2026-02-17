import '../../App.css'
import React from "react";
import CodeBlock from "../../CodeBlock";
import "./setup.css";


export function GithubSSH() {
  return (
    <>
      <h3 className='setupText'>Setting up Github with an SSH Key</h3>
      <p className='setupText'>First, generate an SSH Key</p>
      <CodeBlock language="shell" code={`ssh-keygen -t ed25519 -C "your_email@example.com"`} />
      <p className='setupText'>When prompted, save the key in ~/.ssh/id_ed25519. You can enter a passphrase or leave it empty.</p>
      <p className='setupText'>Then, start the SSH agent and add your key</p>
      <CodeBlock language="shell" code={`eval "$(ssh-agent -s)"\nssh-add ~/.ssh/id_ed25519`} />
      <p className='setupText'>Next, copy your SSH key into Github</p>
      <CodeBlock language="shell" code={`cat ~/.ssh/id_ed25519.pub`} />
      <p className='setupText'>Go to <a rel="noreferrer" href="https://github.com/settings/keys" target="_blank">GitHub SSH Keys</a>, click <b>New SSH Key</b>, paste your key, and save.</p>
      <p className='setupText'>Finally test the connection:</p>
      <CodeBlock language="shell" code={`ssh -T git@github.com`} />
      <p className='setupText'>You should expect the following output:</p>
      <CodeBlock language="shell" code={`Hi github_username! You've successfully authenticated, but GitHub does not provide shell access.`} />
    </>
  );
}

export function DockerGhcr(){
  return (
    <>
      <h3 className='setupText'>Setting up Github GHCR with a key</h3>
      <p className='setupText'>First, generate a classic token in github. Go to <a rel="noreferrer" href="https://github.com/settings/tokens" target="_blank">Personal access tokens (classic)</a> and press "Generate new token" and click "Generate new token (Classic)"</p>
      <p className='setupText'>In "Note" give it some name, then choose an expiration date and select a 'scope'. For the purpose of pulling a docker image from GHCR, you will need at least "read:packages" and "read:org" selected. Press generate token, and copy the the token.</p>
      <p className='setupText'>Now go to the terminal, and enter <code>docker login ghcr.io</code></p>
      <CodeBlock language="shell" code={`$ docker login ghcr.io\nUsername: yourUsername`} />
      <p className='setupText'>Where prompted, enter your github username and then when it asks for the password, enter the token you generated above. Press enter and after a few seconds, you'll see "Login Succeeded".</p>
      <p className='setupText'>Now, test that everything works by running the following command and seeing a similar output:</p>
      <CodeBlock language="shell" code={`$ docker image pull ghcr.io/umd-theia/docker-kubos:v0.3.2\nv0.3.2: Pulling from umd-theia/docker-kubos\n...`} />
      <p className='setupText'>If you see the following error, please let someone know:</p>
      <CodeBlock language="shell" code={`$ docker image pull ghcr.io/umd-theia/docker-kubos:v0.3.2\nError response from daemon: Head "https://ghcr.io/v2/umd-theia/docker-kubos/manifests/v0.3.2": unauthorized`} />
    </>
  );
}

export function GitClone() {
  return (
    <>
      <h3 className='setupText'>Clone Repositories</h3>
      <p className='setupText'>At this point, you're nearly done. Find a spot where you want to keep all your THEIA code. I usually use <code>/home/username/Desktop/THEIA</code>.</p>
      <p className='setupText'>Once navigated, run the following command to fully clone the main repo:</p>
      <CodeBlock language="shell" code={`git clone --recurse-submodules git@github.com:UMD-THEIA/docker-kubos.git`} />
    </>
  )
}

export function VsCode(){
  return (
    <>
      <h3 className='setupText'>Using VsCode</h3>
      <p className='setupText'>I recommend using VsCode for programming on this project but you are free to use whatever you want. Assuming vscode is already installed and <code>docker-kubos</code> is in <code>/home/username/THEIA/Software/docker-kubos</code>:</p>
      <p className='setupText'>Run the following command to open vscode in the main repo:</p>
      <CodeBlock language="shell" code={`code /home/username/THEIA/Software/docker-kubos`} />
    </>
  )
}