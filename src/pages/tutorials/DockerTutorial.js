import '../../App.css'
import CodeBlock from "../../CodeBlock.js"
import { Link } from "react-router-dom"
import './tutorial.css'
import TutorialNote from './TutorialNote.js'

function CustomLink({ to, children, ...props }) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}

export default function DockerTutorial() {

  const dockerexec = `$ docker exec -it kubos /bin/bash
kubos@d9a9758e997f:~$ `

  const dockerps = `$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED        STATUS         PORTS                                                                                                                                                                                NAMES
d9a9758e997f   docker-kubos-kubos   "/bin/bash /home/kub…"   39 hours ago   Up 2 minutes   [...]  kubos`

  const dockerStartup = `$ docker compose up kubos 
Attaching to kubos
kubos  | Initializing the flight software
kubos  | You have read and write permissions for 'flight-software'.
kubos  | You have read and write permissions for 'logs'.
kubos  | Starting monitor-service...
kubos  | kubos-monitor-service[7]: Listening on: 0.0.0.0:8030
kubos  | kubos-monitor-service[7]: warp drive engaged: listening on http://0.0.0.0:8030
kubos  | kubos-monitor-service[7]: adding I/O source: 0
kubos  | kubos-monitor-service[7]: scheduling Read for: 0
kubos  | Initializing the flight software
...
kubos  | payload-service is running successfully`;

  return (
    <>
      <div className="leftText">
        <h1>Setting up + Running <CustomLink to="/codebase/docker-kubos">docker-kubos</CustomLink></h1>
        <h3 className="lastUpdate">Last updated September 10th, 2025</h3>
        <TutorialNote>
          <p> This tutorial picks up from <CustomLink to="/setup">Setup</CustomLink>. Please start from there if you haven't already.</p>
        </TutorialNote>

        <p className="tutorial-text">From inside vscode, you should be able to bring up the terminal. You can then run the following command to only start up the KubOS container.</p>
        <CodeBlock language={"bash"} code={"docker compose up kubos"} />
        <TutorialNote>
          <p>
            In the <code>docker-compose.yaml</code> file located in <code>docker-kubos</code>, you'll find a top-level section called <code>services</code>. 
            Under it, you'll see five defined services: <code>kubos</code>, <code>adcs</code>, <code>payload</code>, <code>gps</code>, and <code>pdu</code>. 
            You can run any one (or multiple) of these containers by specifying their names at the end of a 
            <code>docker compose up [service]</code> command. For example, the command above runs only the <code>kubos</code> service.
          </p>
        </TutorialNote>
        <p className='tutorial-text'>You should see a log like:</p>
        <CodeBlock language={"bash"} code={dockerStartup} />
        <p className="tutorial-text">
          Your output may be longer, but the key point is that each service
          reports <code>"...is running successfully"</code>. If you see these messages
          without errors, your container is ready.
        </p>
        <p className="tutorial-text">
          By default, <code>docker compose up</code> runs in the foreground (attached to your terminal).
          Press <code>Ctrl + C</code> to stop it. If you want the container to keep running in the background,
          use <code>docker compose up -d kubos</code> instead. In that case, you can open new
          terminals to run other commands while KubOS stays alive.
        </p>
        <p className='tutorial-text'>If you run <code>docker ps</code>, you should see something similar:</p>
        <CodeBlock language={"bash"} code={dockerps} />
        <p className='tutorial-text'>The <code>CONTAINER ID</code>, <code>IMAGE</code>, <code>CREATED</code>, <code>STATUS</code> and <code>PORTS</code> might all be different. </p>
        <p className='tutorial-text'>To get into the container, run <code>docker exec -it kubos /bin/bash</code>. The breakdown for this command can be found in the <a href="../#/docker">docker tutorial</a>. The result should look something like this:</p>
        <CodeBlock language={"bash"} code={dockerexec} />
        <TutorialNote>
          <p>
            If you see <code>Error response from daemon: container [...] is not running</code>,
            it means the container failed to start or was stopped.
            Try running <code>docker compose up kubos</code> again and check the logs for errors.
          </p>
        </TutorialNote>
      </div>
    </>
  );
}