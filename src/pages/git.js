import "../App.css";
import "./git.css";
import CodeBlock from "../CodeBlock";
import TutorialNote from "./tutorials/TutorialNote";

export default function Git() {
  return (
    <div className="gitTutorial">
      <h1>Git</h1>
      <p>There are only a few basic commands that you need to learn, but to begin to understand git, you need to understand why it exists and how commit graphs work.</p>
      <h2>Why Git exists (the 3 problems it solves)</h2>
      <ol>
        <li>History - Track how files change over time.</li>
        <li>Collaboration - Let many people work on the same code.</li>
        <li>Experiments - Create isolated lines of work (branches).</li>
      </ol>
      <div className="gitflex">
        <div>
          <h2>The mental model: the commit graph</h2>
          <p>
            A Git commit is a snapshot of your project plus metadata (author, message, parent commit). Each commit points to its parent(s). The full history forms a directed
            acyclic graph (DAG).
          </p>
          <ul>
            <li>Circles are commits; arrows point from newer to older parents.</li>
            <li>Branches are pointers (names) to commits, not folders of files.</li>
            <li>HEAD is your current position—usually pointing to a branch name, which points to a commit.</li>
          </ul>
          <p>Every command in this tutorial moves pointers around this graph or adds nodes to it.</p>
        </div>
        <img src={process.env.PUBLIC_URL + "/images/git/git_branch.svg"} alt="Git Graph" className="gitImage" />
      </div>
      <h2>One tiny repo to learn them all</h2>
      <p>We'll use a throwaway repo. Lines starting with $ are commands you type.</p>
      <CodeBlock language="bash" code={`$ mkdir git-basics && cd git-basics\n$ git init\n$ echo "Hello" > app.txt\n$ git add app.txt\n$ git commit -m "init: add app.txt"`} />
      <p>Now you have a graph with one node:</p>
      <CodeBlock language="" code={`A (main)\n^\n|\n(working tree matches A)`} />
      <TutorialNote>
        <p> Git names commits with long hashes (e.g., a1b2c3…). We'll use letters for diagrams.</p>
      </TutorialNote>

      <h2>
        <code>HEAD</code>
      </h2>
      <p className="wip">
        <code>HEAD</code> is where the current user is.
      </p>

      <h2>
        <code>git commit</code>: add a node to the graph
      </h2>
      <p>Record changes staged in the index.</p>
      <p>Cycle:</p>
      <ul>
        <li>Edit files</li>
        <li>
          Stage changes with <code>git add</code>
        </li>
        <li>Save snapshot with git commit</li>
      </ul>
      <CodeBlock language="bash" code={`$ echo "Hola" >> app.txt\n$ git add app.txt\n$ git commit -m "greet: add Spanish"`} />
      <p>Graph:</p>
      <CodeBlock language="bash" code={`A -- B <--(main, HEAD)`} />
      <p>Each new commit adds a node and moves the current branch pointer forward.</p>

      <h2>
        <code>git branch</code> and <code>git checkout</code>: branching and moving HEAD
      </h2>
      <p>Create alternate lines of work and move between them.</p>
      <p>
        <strong>Create a new branch</strong>
      </p>
      <CodeBlock language="bash" code={`$ git branch feature/greeting # create a new branch at HEAD`} />
      <p>Graph now:</p>
      <CodeBlock language="" code={`A -- B <--(main, HEAD, feature/greeting)`} />
      <p>Both branches point at the same commit. Branches are just names.</p>
      <p>
        <strong>Switch to it</strong>
      </p>
      <CodeBlock language="bash" code={`$ git checkout feature/greeting`} />
      <p>
        Now HEAD points to <code>feature/greeting</code>.
      </p>
      <p>
        <strong>Make a new commit there</strong>
      </p>
      <CodeBlock language="bash" code={`$ echo "Bonjour" >> app.txt\n$ git add app.txt\n$ git commit -m "greet: add French (ew)"`} />
      <p>Graph evolves:</p>
      <CodeBlock language="" code={`A -- B   <--(main) \n      \\\n       C   <--(feature/greeting, HEAD)`} />

      <h2>Working on branch</h2>
      <p>You can do commits and work normally on a branch</p>
      <CodeBlock language="bash" code={`$ echo "Salut" >> app.txt\n$ git add app.txt\n$ git commit -m "greet: updated French"`} />
      <p>Graph evolves:</p>
      <CodeBlock language="" code={`A -- B   <--(main) \n      \\\n       C  -- D   <--(feature/greeting, HEAD)`} />

      <h2>
        <code>git push</code>
      </h2>
      <p>First, add a remote (pretend you created an empty repo in GitHub):</p>
      <CodeBlock language={"bash"} code={`$ git remote add origin <your-ssh-or-https-url>\n$ git push -u origin main # publish main the first time`} />
      <p className="wip">Add something about how to merge/push branches?</p>

      <h2>
        <code>git pull</code>
      </h2>
      <p className="wip">
        <code>git stash</code>
      </p>

      <h2>Putting it together</h2>
      <ol>
        <li>
          Sync your local view: <CodeBlock language={"bash"} code={`git checkout main\ngit pull --rebase`} />{" "}
        </li>
        <li>
          Branch for your task: <CodeBlock language={"bash"} code={`git switch -c feature/new-copy # same as: git checkout -b ...`} />{" "}
        </li>
        <li>
          Work in small steps; commit often with clear messages: <CodeBlock language={"bash"} code={`git add -p\ngit commit -m "<text here>"`} />
        </li>
        <li className="wip">...</li>
      </ol>

      <h2>Other common usages</h2>
      <p className="wip">Checkout previous commit</p>

      <h2>Mini exercises</h2>
      <p className="wip">Experiment with github to create and manage a repo.</p>
    </div>
  );
}
