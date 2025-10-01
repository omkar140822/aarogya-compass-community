import { Shield, Users, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All equipment meets international healthcare standards and certifications"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with healthcare professionals and suppliers across India"
    },
    {
      icon: Globe,
      title: "Pan-India Network",
      description: "Serving healthcare facilities from metros to remote areas"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Aarogya Abharat
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are building India's most trusted community for medical equipment, connecting healthcare providers 
            with quality suppliers and fostering collaboration for better healthcare outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
