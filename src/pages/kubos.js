import '../App.css'
import CodeBlock from '../CodeBlock'



export default function Kubos() {
  return (
    <>
      <h1>KubOS Ecosystem</h1>
      <div className="leftText">

        <p>Documentation: <a href="https://docs.kubos.com/1.21.0/index.html" rel="noreferrer" target="_blank" >https://docs.kubos.com/1.21.0/index.html</a></p>

        <p>KubOS is a collection of microservices that accomplish critical functionality required of flight software (FSW), run within a highly fault tolerant and
          recoverable operating system, and provide a safe and effective development environment for mission specific FSW applications</p>

        <h2>Mission Applications</h2>

        <p>Applications are programs designed for user-level interaction, capable of either single, isolated
          executions or running as ongoing processes.<br /> the context of a satellite mission, mission applications encompass everything responsible for
          controlling the satellite's behavior. They execute specific predefined tasks and oversee onboard activities, collectively serving as the
          intelligence of the system.<br />Each application is usually designed to serve a specific mode or distinct task assigned to the satellite. This
          approach ensures that they remain lightweight and easily transportable. These applications can range from straightforward ones like a telemetry
          beacon app to more intricate ones like a payload operations app.</p>

        <h2>Services</h2>

        <p>Kubos services are defined as persistent processes designed to facilitate interactions with the satellite. These services typically do not make
          independent decisions but serve as tools enabling users to carry out standard flight software tasks, such as telemetry storage, file management,
          shell access, and hardware communication.<br />All services make their functionality accessible through **HTTP** endpoints that accept GraphQL
          requests and return responses in **JSON** format. This approach ensures that client programs wanting to communicate with a service can be implemented
          in any programming language.<br />There are three distinct categories of services within KubOS:
        </p>

        <ul>
          <li><b>Core Services</b> provide the essential functionality of the system. They are independent of the On-Board Computer (OBC) and are
            automatically integrated into KubOS. These services encompass tasks such as OBC monitoring, telemetry management, delay-tolerant file transfers,
            shell access, and application management.</li>
          <li><b>Hardware Services</b> expose the capabilities of connected hardware devices, such as the Attitude Determination and Control System (ADCS),
            GPS, radio, and others, to the rest of the satellite's software bus. These services are designed to be reusable across different missions. KubOS
            includes support for a predefined set of pre-built hardware services.</li>
          <li><b>Payload Services</b> are specialized hardware services tailored to meet the unique requirements of a specific mission's payload hardware.
            Unlike hardware services, they are not intended for reuse across different missions. Instead, they are custom-designed to address the specific
            needs of the mission's payload component</li>
        </ul>

        <h2>Kubos Linux</h2>
        <p>Kubos Linux is a custom Linux distribution designed with embedded devices in mind.</p>
        <p>It focuses on including only drivers that are useful for space applications (eg. I2C and SPI, rather than display drivers) and
          multi-layer system validation and recovery logic.</p>
        <p>Tightly coupled with Kubos Linux is U-Boot, our bootloader of choice. U-Boot is responsible for loading Kubos Linux from permanent
          storage into RAM at boot time. It is also responsible for processing operating system upgrade and recover, when necessary.</p>

        <h2>GraphQL</h2>
        <p>KubOS services expose their functionalities using GraphQL, an efficient and flexible query language that enables precise data retrieval.
          Unlike traditional REST APIs, GraphQL allows clients to request only the data they need, reducing bandwidth and improving efficiency.</p>

        <h3>GraphQL Services and Applications</h3>
        <p>GraphQL services within KubOS provide an interface for interacting with flight software, hardware components, and mission applications.
          These services expose well-structured data models and operations, making it easy to query, modify, and manage the system in real time.
        </p>
        <p>Mission applications interact with these GraphQL services to control onboard functions, manage telemetry, and execute mission tasks.
          By leveraging GraphQL's flexibility, mission software can dynamically request only the necessary data, reducing the complexity of system interactions.</p>
        <h3>Queries</h3>
        <p>Queries in GraphQL are used to request specific data from a KubOS service. Instead of retrieving an entire dataset, a client can specify the exact fields required.
          For example, a query to retrieve the system telemetry might look like this:</p>
        <CodeBlock language="graphql" code={`{
	telemetryData {
		timestamp
		cpuUsage
		memoryUsage
	}
}`} />
        <p>This query returns only the timestamp, CPU usage, and memory usage values, making data retrieval more efficient.</p>

        <h3>Mutations</h3>
        <p>Mutations in GraphQL allow users to modify data within the KubOS ecosystem. They are used for actions such as starting applications, storing telemetry data,
          or executing commands. Below is an example of a mutation to start a satellite application:</p>

        <CodeBlock language="graphql" code={`mutation {
	startApplication(name: "telemetry_beacon") {
		success
		message
	}
}`} />
        <p>This mutation requests the execution of a specific mission application, with a response indicating success or failure.</p>
      </div>
    </>
  );
}