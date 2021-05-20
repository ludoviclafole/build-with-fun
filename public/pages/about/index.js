
const About = ({ query }) => (
	<>
		<h1>About</h1>
		<p>A page all about this website.</p>
		<pre>{JSON.stringify(query)}</pre>
	</>
);

export default About;
