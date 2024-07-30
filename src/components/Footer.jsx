function Footer() {
  const teamMembers = [
    { name: "Frederick Okornoe", linkedin: "https://www.linkedin.com/in/frederick-okornoe-b997651b4" },
    { name: "Elson Ricafrente", linkedin: "https://www.linkedin.com/in/elson-ricafrente-541730b7" },
    { name: "Jordan Sidney-Dunu", linkedin: "https://www.linkedin.com/in/jordan-sidney-dunu-265338199" }
  ];

  return (
    <footer className="footer">
      <p>© 2024 Recipe App. All rights reserved.</p>
      <p>Created by:</p>
      <ul className="team-list">
        {teamMembers.map((member, index) => (
          <li key={index}>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">{member.name}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

export default Footer;