import { Github, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {currentYear} Sumit Kumar Sah. Built with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'hsl(0, 80%, 60%)' }} /> using React & Node.js
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/sam7488"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            aria-label="GitHub Profile"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/sumit-kumar-sah-503ab4287/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
