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