import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#A854F7] text-white py-2 sm:py-3 px-3 sm:px-4 text-center shadow-lg z-50">
      <div className="container mx-auto flex flex-col xs:flex-row justify-center items-center gap-1 sm:gap-2">
        <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
          Desenvolvido por Patrício Brito {new Date().getFullYear()}
        </span>
        <span className="hidden xs:inline text-xs sm:text-sm md:text-base mx-1 sm:mx-2 opacity-50">•</span>
        <span className="text-xs sm:text-sm md:text-base font-light italic whitespace-normal xs:whitespace-nowrap">
          AImilia® Tutor AI - Alzheimer Ver.1.0
        </span>
      </div>
    </footer>
  );
};

export default Footer;
