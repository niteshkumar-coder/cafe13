import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { CAFE_INFO } from "./constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram, 
  Facebook, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Coffee, 
  Pizza, 
  Utensils, 
  Cake, 
  Heart,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  ArrowLeft,
  Search,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { LoginModal } from "./components/LoginModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// --- Components ---

const Navbar = ({ user, onLoginClick, onLogout }: { user: any, onLoginClick: () => void, onLogout: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHome ? "glass py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={CAFE_INFO.logo} 
            alt={CAFE_INFO.name} 
            className="h-10 w-auto object-contain group-hover:scale-110 transition-transform"
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span className="text-2xl font-serif font-bold tracking-tighter text-primary">
            CAFE <span className="text-foreground">13</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          {isHome ? (
            <>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
              <a href="#gallery" className="hover:text-primary transition-colors">Gallery</a>
              <a href="#contact" className="hover:text-primary transition-colors">Visit</a>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="hover:text-primary transition-colors">Full Menu</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <UserIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">{user.name.split(' ')[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-full hover:bg-red-500/10 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onLoginClick} className="hidden sm:flex border-primary/50 hover:bg-primary hover:text-primary-foreground">
              Login
            </Button>
          )}
          <Button onClick={user ? () => {} : onLoginClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Order Now
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = ({ onOrderClick }: { onOrderClick: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={CAFE_INFO.images[0]} 
          alt="Cafe 13 Ambience" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/30 text-primary uppercase tracking-[0.3em] bg-primary/5 backdrop-blur-sm">
            Patna's Stylish Hangout Spot
          </Badge>
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight leading-[1.1]">
            Coffee, Conversations & <br />
            <span className="text-primary italic">Premium Café Vibes</span>
          </h1>

          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={onOrderClick}
              className="h-14 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full gold-glow"
            >
              Order Now
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 hover:bg-white/10 rounded-full backdrop-blur-md">
              Explore Menu
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm font-medium uppercase tracking-widest">4.5+ Rated by Diners</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm font-medium uppercase tracking-widest">Loved for Ambience</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium uppercase tracking-widest">Boring Road, Patna</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
      >
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden gold-glow">
              <img 
                src={CAFE_INFO.images[1]} 
                alt="Cafe 13 Interior" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden border-8 border-background hidden lg:block">
              <img 
                src={CAFE_INFO.images[2]} 
                alt="Cafe 13 Food" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              A Destination for <span className="italic">Memorable Moments</span>
            </h2>
            <div className="space-y-6 text-foreground/70 font-light leading-relaxed text-lg">
              <p>
                Located in the heart of Boring Road, Patna, Cafe 13 is more than just a coffee shop. It's a sanctuary for those who appreciate the finer things in life—good food, great coffee, and even better company.
              </p>
              <p>
                Whether you're looking for a quiet corner for a coffee date, a vibrant space for a friends' meetup, or a warm setting for family time, we've crafted an ambience that invites you to chill and celebrate your special moments.
              </p>
              <p className="font-serif italic text-primary text-2xl pt-4">
                "{CAFE_INFO.hashtag}"
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-1">10+</h4>
                <p className="text-xs uppercase tracking-widest opacity-60">Signature Blends</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-1">5k+</h4>
                <p className="text-xs uppercase tracking-widest opacity-60">Happy Guests</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Coffee className="w-6 h-6" />, title: "Premium Coffee", desc: "Expertly roasted beans and artisanal brewing techniques." },
    { icon: <Utensils className="w-6 h-6" />, title: "Gourmet Food", desc: "From quick snacks to main bites, we have something for everybody." },
    { icon: <Star className="w-6 h-6" />, title: "Beautiful Ambience", desc: "Aesthetically pleasing interiors perfect for your social feed." },
    { icon: <Heart className="w-6 h-6" />, title: "Friendly Staff", desc: "Knowledgeable and welcoming team dedicated to your experience." },
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Why People Love Us</h2>
          <p className="opacity-60 max-w-xl mx-auto">Experience the perfect blend of taste, comfort, and style.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-background/40 border-white/5 hover:border-primary/30 transition-all duration-500 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-serif font-bold mb-6">Trusted by <br /><span className="text-primary italic">Thousands</span></h2>
            <p className="text-foreground/60 mb-8">Our commitment to quality and service is reflected in the love we receive from our community.</p>
            <div className="space-y-4">
              {CAFE_INFO.ratings.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                  <span className="font-medium uppercase tracking-widest text-xs">{r.platform}</span>
                  <div className="text-right">
                    <div className="text-primary font-bold">{r.score}</div>
                    <div className="text-[10px] opacity-40 uppercase tracking-tighter">{r.votes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {CAFE_INFO.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gradient-to-br from-secondary/40 to-transparent border border-white/5 relative"
              >
                <div className="absolute top-8 right-8 opacity-10">
                  <MessageCircle className="w-12 h-12" />
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-lg italic font-serif mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {t.author[0]}
                  </div>
                  <span className="text-sm font-medium uppercase tracking-widest opacity-60">{t.author}</span>
                </div>
              </motion.div>
            ))}
            <div className="md:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-sm opacity-60 italic">"We value every piece of feedback as it helps us grow and serve you better."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuPreview = ({ onOrderClick }: { onOrderClick: () => void }) => {
  const categories = CAFE_INFO.menu || [];

  return (
    <section id="menu" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-[0.3em] text-sm mb-4 block">Taste the Excellence</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Menu Preview</h2>
          <p className="opacity-60 max-w-xl mx-auto">A curated selection of our guest favorites. Something for everybody.</p>
        </div>

        <Tabs defaultValue={categories[0]?.category} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-secondary/30 h-auto p-2 rounded-2xl mb-12">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.category} 
                value={cat.category}
                className="py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all uppercase text-[10px] tracking-widest font-bold"
              >
                {cat.category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat.category} value={cat.category}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {cat.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex justify-between items-center p-6 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/20 transition-colors group cursor-pointer"
                    onClick={onOrderClick}
                  >
                    <span className="font-serif text-xl group-hover:text-primary transition-colors">{item.name}</span>
                    <div className="h-px flex-grow mx-4 border-t border-dashed border-white/10" />
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">{item.price}</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            onClick={onOrderClick}
            className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow font-bold"
          >
            Order Now
          </Button>
          <Link to="/menu">
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/10 hover:bg-white/5">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">The Cafe 13 Experience</h2>
          <p className="opacity-60">Immerse yourself in our premium ambience and culinary art.</p>
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {CAFE_INFO.images.slice(3).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative group overflow-hidden rounded-2xl"
            >
              <img 
                src={img} 
                alt={`Gallery ${i}`} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section className="py-24 bg-secondary/10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4 italic">Satisfying Experience, Comfortable Pricing</h2>
        <p className="opacity-60 mb-12 max-w-2xl mx-auto">Loved by guests for offering a satisfying café experience across a comfortable price range.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {CAFE_INFO.priceRanges.map((p, i) => (
            <div key={i} className="px-8 py-6 rounded-2xl bg-background/40 border border-white/5 hover:border-primary/30 transition-all group">
              <div className="text-2xl font-serif font-bold text-primary mb-1">{p.range}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-40">{p.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs opacity-30 uppercase tracking-widest">Reported by 360+ people</p>
      </div>
    </section>
  );
};

const Reservations = () => {
  const platforms = [
    { name: "Swiggy", icon: <ExternalLink className="w-4 h-4" />, color: "hover:bg-[#FC8019]" },
    { name: "EazyDiner", icon: <ExternalLink className="w-4 h-4" />, color: "hover:bg-[#FF4F4F]" },
    { name: "Zomato", icon: <ExternalLink className="w-4 h-4" />, color: "hover:bg-[#E23744]" },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto p-12 rounded-[3rem] glass border-white/10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Chill Together?</h2>
          <p className="text-lg opacity-70 mb-12 max-w-2xl mx-auto">Book your table now or order your favorite food directly to your doorstep.</p>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {platforms.map((p) => (
              <Button key={p.name} variant="outline" className={`h-16 rounded-2xl border-white/10 bg-white/5 transition-all ${p.color} hover:text-white`}>
                Reserve via {p.name}
                {p.icon}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="h-16 px-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold gold-glow">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: {CAFE_INFO.phone}
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 rounded-full border-white/20 hover:bg-white/10 text-lg font-bold backdrop-blur-md">
              <MapPin className="w-5 h-5 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-8">Visit Us</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold mb-2">Location</h4>
                  <p className="text-foreground/60 leading-relaxed">{CAFE_INFO.address}</p>
                  <p className="text-primary font-medium mt-2 uppercase text-xs tracking-widest">Located on Boring Road, Patna</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold mb-2">Hours</h4>
                  <p className="text-foreground/60">{CAFE_INFO.hours}</p>
                  <p className="text-foreground/40 text-sm mt-1">Delivery ends at 9:30 PM</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold mb-2">Contact</h4>
                  <p className="text-foreground/60">{CAFE_INFO.phone}</p>
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-primary hover:text-primary-foreground transition-all">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-primary hover:text-primary-foreground transition-all">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[500px] rounded-3xl overflow-hidden border border-white/10 relative gold-glow">
            <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center text-center p-12">
              <div>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-foreground/40 uppercase tracking-[0.2em] text-sm">Interactive Map Placeholder</p>
                <Button variant="link" className="text-primary mt-4">Open in Google Maps</Button>
              </div>
            </div>
            {/* Real map would go here */}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "Where is Cafe 13 located?", a: "We are located at 1st Floor, Surya Crystal, Boring Road, opposite Karlo automobiles, Anandpuri, Patna." },
    { q: "What are the opening hours?", a: "We are open daily from morning until 10:00 PM." },
    { q: "Is delivery available?", a: "Yes, delivery is available until 9:30 PM daily." },
    { q: "Can I reserve a table online?", a: "Absolutely! You can reserve via Swiggy, EazyDiner, or Zomato, or just give us a call." },
    { q: "Is Cafe 13 good for friends and family hangouts?", a: "Yes, we've designed our space to be a premium urban hangout perfect for friends, couples, and families alike." },
    { q: "Where can I view the menu?", a: "Our full menu is available on our Instagram profile. Check our highlights!" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
          <p className="opacity-60">Everything you need to know before your visit.</p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 rounded-2xl px-6 bg-secondary/10">
              <AccordionTrigger className="hover:no-underline font-serif text-lg py-6">{f.q}</AccordionTrigger>
              <AccordionContent className="text-foreground/60 pb-6 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={CAFE_INFO.logo} 
                alt={CAFE_INFO.name} 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="text-3xl font-serif font-bold tracking-tighter text-primary">
                CAFE <span className="text-foreground">13</span>
              </span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-primary hover:text-primary-foreground">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-primary hover:text-primary-foreground">
                <Facebook className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-foreground/60 uppercase tracking-widest">
              <li><a href="#about" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-primary transition-colors">Menu</a></li>
              <li><a href="#gallery" className="hover:text-primary transition-colors">Experience</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Visit Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li className="flex gap-3"><MapPin className="w-4 h-4 text-primary shrink-0" /> {CAFE_INFO.address}</li>
              <li className="flex gap-3"><Phone className="w-4 h-4 text-primary shrink-0" /> {CAFE_INFO.phone}</li>
              <li className="flex gap-3"><Clock className="w-4 h-4 text-primary shrink-0" /> {CAFE_INFO.hours}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-xs opacity-40 uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Cafe 13 Patna. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MenuPage = ({ user, onOrderClick }: { user: any, onOrderClick: () => void }) => {
  const { itemName } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const allItems = useMemo(() => {
    return CAFE_INFO.menu?.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.category }))) || [];
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allItems]);

  const selectedItem = useMemo(() => {
    if (!itemName) return null;
    return allItems.find(item => item.name === decodeURIComponent(itemName));
  }, [itemName, allItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemName]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate("/menu")}
                className="mb-8 hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
              </Button>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="aspect-square rounded-3xl overflow-hidden gold-glow">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 uppercase tracking-widest">
                    {selectedItem.category}
                  </Badge>
                  <h1 className="text-5xl font-serif font-bold mb-4">{selectedItem.name}</h1>
                  <div className="text-3xl font-serif text-primary mb-6">{selectedItem.price}</div>
                  <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                    {selectedItem.desc}
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      onClick={onOrderClick}
                      className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
                    >
                      Order Now
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/10 hover:bg-white/5">
                      Add to Favorites
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-24">
                <h3 className="text-2xl font-serif font-bold mb-8">Related Items</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {allItems
                    .filter(item => item.category === selectedItem.category && item.name !== selectedItem.name)
                    .slice(0, 4)
                    .map((item, i) => (
                      <Link key={i} to={`/menu/${encodeURIComponent(item.name)}`} className="group">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        <h4 className="font-serif font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                        <p className="text-xs opacity-40 uppercase tracking-tighter">{item.price}</p>
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                <div>
                  <h1 className="text-5xl font-serif font-bold mb-4">Our Full Menu</h1>
                  <p className="opacity-60">Explore our wide range of premium offerings.</p>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input 
                    type="text" 
                    placeholder="Search your favorite food..." 
                    className="w-full h-14 pl-12 pr-6 rounded-full bg-secondary/20 border border-white/5 focus:border-primary/50 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/menu/${encodeURIComponent(item.name)}`} className="group block h-full">
                      <Card className="bg-secondary/10 border-white/5 hover:border-primary/30 transition-all duration-500 h-full overflow-hidden flex flex-col">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <CardContent className="p-6 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                            <span className="text-primary font-bold">{item.price}</span>
                          </div>
                          <p className="text-sm text-foreground/50 line-clamp-2 mb-4 flex-grow">{item.desc}</p>
                          <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <ChevronRight className="w-3 h-3 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-xl opacity-40 italic">No items found matching your search.</p>
                  <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary mt-4">Clear search</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const HomePage = ({ onOrderClick }: { onOrderClick: () => void }) => (
  <>
    <Hero onOrderClick={onOrderClick} />
    <About />
    <Features />
    <SocialProof />
    <MenuPreview onOrderClick={onOrderClick} />
    <Gallery />
    <Pricing />
    <Reservations />
    <Contact />
    <FAQ />
  </>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Guest",
          phone: firebaseUser.phoneNumber || ""
        });
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: { name: string; phone: string; uid: string }) => {
    setUser(userData);
    // Automatically open checkout after successful login if they were trying to order
    setTimeout(() => setIsCheckoutModalOpen(true), 500);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleOrderClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-primary selection:text-primary-foreground">
        <Navbar 
          user={user} 
          onLoginClick={() => setIsLoginModalOpen(true)} 
          onLogout={handleLogout}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage onOrderClick={handleOrderClick} />} />
            <Route path="/menu" element={<MenuPage user={user} onOrderClick={handleOrderClick} />} />
            <Route path="/menu/:itemName" element={<MenuPage user={user} onOrderClick={handleOrderClick} />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Floating CTA for Mobile */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <Button 
            size="icon" 
            onClick={handleOrderClick}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl gold-glow"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />

        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          user={user}
        />
      </div>
    </BrowserRouter>
  );
}
