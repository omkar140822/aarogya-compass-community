import { CheckCircle2, Clock, Award, HeadphonesIcon } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: "Verified Suppliers",
      description: "All suppliers are thoroughly vetted and certified"
    },
    {
      icon: Clock,
      title: "Quick Delivery",
      description: "Fast and reliable delivery across India"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% authentic products with warranties"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Expert support team always ready to help"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive solutions for all your medical equipment needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
