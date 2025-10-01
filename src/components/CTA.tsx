import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-background/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-background/90 mb-10">
            Join thousands of healthcare professionals and suppliers in our growing community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="hero" className="text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
            <Button size="lg" variant="secondary" className="text-lg">
              <Phone className="mr-2 h-5 w-5" />
              Request Callback
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-background/20">
            <div>
              <div className="text-3xl font-bold text-background mb-2">500+</div>
              <div className="text-background/80">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-background mb-2">10,000+</div>
              <div className="text-background/80">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-background mb-2">50+</div>
              <div className="text-background/80">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
