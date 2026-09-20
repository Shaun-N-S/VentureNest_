import { Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} VentureNest. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:hello@venturenest.com"
            className="hover:text-foreground transition-colors"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
