import { Heart } from "lucide-react";

const Footer = () => {
  const randomEmoji = () => {
    const emojis = ["🚀", "✨", "💫", "🌟", "💡", "🎯", "🎨", "🔮"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <footer className="w-full py-6 mt-12 bg-secondary/30">
      <div className="container flex flex-col items-center justify-center gap-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by the FlorryCo team
        </p>
        <p className="flex items-center gap-2">
          Bringing ideas to life {randomEmoji()}
        </p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} FlorryCo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;