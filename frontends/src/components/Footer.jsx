const Footer = () => (
  <div className="flex justify-between items-center w-full fixed bottom-0 left-0 px-8 py-4 bg-white border-t border-gray-200 text-xs text-gray-400 z-50">
    <p>
      CRATOV <span className="ml-2">Copyright 2025</span>
    </p>
    <div className="flex gap-4">
      <a
        href="https://github.com/ArchitAnant/Cratov.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
      </a>
      <a href="/">Disclaimer</a>
    </div>
  </div>
);

export default Footer;
