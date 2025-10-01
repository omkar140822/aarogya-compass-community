import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Aarogya Abharat</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering healthcare excellence across India through quality medical equipment.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Equipment</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Suppliers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Diagnostic</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Surgical</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Monitoring</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Laboratory</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Aarogya Abharat. All rights reserved. Built with care for Indian healthcare.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
