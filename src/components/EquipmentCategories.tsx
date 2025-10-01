import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import diagnosticIcon from "@/assets/diagnostic-icon.jpg";
import surgicalIcon from "@/assets/surgical-icon.jpg";
import monitoringIcon from "@/assets/monitoring-icon.jpg";
import laboratoryIcon from "@/assets/laboratory-icon.jpg";

const EquipmentCategories = () => {
  const categories = [
    {
      image: diagnosticIcon,
      title: "Diagnostic Equipment",
      description: "X-Ray, MRI, CT Scan, Ultrasound machines and more",
      items: "150+ Products"
    },
    {
      image: surgicalIcon,
      title: "Surgical Instruments",
      description: "High-precision surgical tools and equipment",
      items: "200+ Products"
    },
    {
      image: monitoringIcon,
      title: "Patient Monitoring",
      description: "ICU equipment, vital signs monitors, ventilators",
      items: "120+ Products"
    },
    {
      image: laboratoryIcon,
      title: "Laboratory Equipment",
      description: "Lab analyzers, microscopes, testing equipment",
      items: "180+ Products"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Equipment Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our comprehensive range of medical equipment across various specialties
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm font-medium text-primary mb-2">
                  {category.items}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <Button variant="ghost" className="w-full group-hover:bg-accent transition-colors">
                  View More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentCategories;
