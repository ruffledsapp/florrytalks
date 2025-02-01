import { Heart, Github } from "lucide-react";

const Footer = () => {
  const randomEmoji = () => {
    const emojis = ["🚀", "✨", "💫", "🌟", "💡", "🎯", "🎨", "🔮"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <footer className="w-full py-6 mt-12 bg-[#F2FCE2]">
      <div className="container flex flex-col items-center justify-center gap-2 text-sm font-['Indie_Flower'] text-[#1A1F2C]">
        <p className="flex items-center gap-2 text-lg">
          Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by the FlorryCo team
        </p>
        <div className="flex items-center gap-4 mt-2">
          <a 
            href="https://github.com/flurryco" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </div>
        <p className="text-base mt-2 animate-bounce">
          Bringing ideas to life {randomEmoji()}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          © {new Date().getFullYear()} FlorryCo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;