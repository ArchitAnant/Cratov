const Footer = () => (
  <div className="flex justify-between items-center w-full px-8 py-5 bg-white border-t border-gray-200 z-50">
    <p className="flex flex-col  items-start">
      <h1 className="text-[14px] font-medium text-black">
        CRATOV
      </h1>  
      <span className="text-[12px] font-regular text-black opacity-50">
        Copyright &copy; {new Date().getFullYear()} Cratov
      </span>
    </p>
    <div className="flex text-[12px] font-regular text-black opacity-50 gap-4">
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
