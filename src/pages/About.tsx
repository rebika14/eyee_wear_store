
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const About = () => {
  const location = useLocation();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-medium mb-8 text-center">About EyeTown</h1>
          
          <div className="max-w-4xl mx-auto">
            {/* Our Story Section */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <h2 className="text-xl md:text-2xl font-medium mb-4">Our Story</h2>
                  <p className="text-muted-foreground mb-4">
                    Founded in 2010, EyeTown started as a small optical shop in Thamel, Kathmandu. 
                    Our founder, Dr. Rajesh Sharma, had a vision to provide high-quality eyewear 
                    that was both affordable and stylish for the Nepalese people.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Over the years, we have grown to multiple locations across Kathmandu Valley, 
                    serving thousands of customers with the latest eyewear technology and fashion. 
                    Our commitment to eye health and customer satisfaction remains at the core of 
                    everything we do.
                  </p>
                  <p className="text-muted-foreground">
                    Today, EyeTown is recognized as one of the leading optical retailers in Nepal, 
                    offering a wide range of prescription glasses, sunglasses, and contact lenses 
                    for men, women, and children.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format" 
                      alt="EyeTown team" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Locations Section */}
            <section className="mb-16">
              <h2 className="text-xl md:text-2xl font-medium mb-6">Our Locations in Kathmandu</h2>
              
              <Tabs defaultValue="thamel" className="w-full">
                <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
                  <TabsTrigger value="thamel">Thamel</TabsTrigger>
                  <TabsTrigger value="newroad">New Road</TabsTrigger>
                  <TabsTrigger value="baneshwor">Baneshwor</TabsTrigger>
                  <TabsTrigger value="patan">Patan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="thamel" className="space-y-4">
                  <div className="bg-card shadow-sm rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <h3 className="text-lg font-medium">Thamel Branch (Main)</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Z Street, Thamel, Kathmandu, Nepal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>+977-01-4123456</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>10:00 AM - 7:00 PM (Sun-Fri)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="newroad" className="space-y-4">
                  <div className="bg-card shadow-sm rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <h3 className="text-lg font-medium">New Road Branch</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Opposite to Peanuts Supermarket, New Road, Kathmandu, Nepal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>+977-01-4567890</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>10:00 AM - 7:00 PM (Sun-Fri)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="baneshwor" className="space-y-4">
                  <div className="bg-card shadow-sm rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <h3 className="text-lg font-medium">Baneshwor Branch</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Mid Baneshwor, Near CG Digital, Kathmandu, Nepal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>+977-01-4789123</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>10:00 AM - 7:00 PM (Sun-Fri)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="patan" className="space-y-4">
                  <div className="bg-card shadow-sm rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <h3 className="text-lg font-medium">Patan Branch</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Patan Dhoka, Opposite to Namaste Supermarket, Lalitpur, Nepal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>+977-01-5234567</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>10:00 AM - 7:00 PM (Sun-Fri)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
            
            {/* Contact Us Section */}
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-medium mb-6">Contact Us</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card shadow-sm rounded-lg p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <h3 className="text-base font-medium">Phone</h3>
                        <p className="text-muted-foreground">+977-01-4123456</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <h3 className="text-base font-medium">Email</h3>
                        <p className="text-muted-foreground">info@eyetown.com.np</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <h3 className="text-base font-medium">Head Office</h3>
                        <p className="text-muted-foreground">Z Street, Thamel, Kathmandu, Nepal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <h3 className="text-base font-medium">Business Hours</h3>
                        <p className="text-muted-foreground">10:00 AM - 7:00 PM (Sunday to Friday)</p>
                        <p className="text-muted-foreground">Closed on Saturdays</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Send Us a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-3 py-2 border border-input rounded-md"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-3 py-2 border border-input rounded-md"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={4} 
                        className="w-full px-3 py-2 border border-input rounded-md"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </section>
            
            {/* Why Choose Us */}
            <section>
              <h2 className="text-xl md:text-2xl font-medium mb-6">Why Choose EyeTown?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Expert Eye Care</h3>
                  <p className="text-muted-foreground">
                    Our optometrists are highly trained professionals with years of experience in eye care.
                  </p>
                </div>
                
                <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="8"></circle>
                        <path d="m9 10 2 2 4-4"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Quality Products</h3>
                  <p className="text-muted-foreground">
                    We source our eyewear from trusted global brands, ensuring quality and durability.
                  </p>
                </div>
                
                <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5Z"></path>
                        <path d="m3 3 18 18"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Affordable Prices</h3>
                  <p className="text-muted-foreground">
                    We believe quality eyewear should be accessible to everyone at reasonable prices.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
