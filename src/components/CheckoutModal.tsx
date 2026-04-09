import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Clock,
  User,
  Phone,
  Armchair
} from "lucide-react";
import { CAFE_INFO } from "../constants";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface CartItem {
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; phone: string; uid: string } | null;
  initialItems?: CartItem[];
}

type CheckoutStep = "menu" | "details" | "payment" | "success";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, user, initialItems }) => {
  const [step, setStep] = useState<CheckoutStep>("menu");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize cart if initialItems are provided
  React.useEffect(() => {
    if (isOpen && initialItems && initialItems.length > 0) {
      setCart(initialItems);
    }
  }, [isOpen, initialItems]);
  const [tableNo, setTableNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuItems = useMemo(() => {
    return CAFE_INFO.menu?.flatMap(cat => cat.items) || [];
  }, []);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: item.price, image: item.image, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.name === itemName) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return sum + (price * item.quantity);
    }, 0);
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (!user || !paymentMethod || !tableNo) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        userName: user.name,
        userPhone: user.phone,
        items: cart,
        total: `₹${totalAmount}`,
        tableNo,
        paymentMethod,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      console.log("Placing order with data:", orderData);
      await addDoc(collection(db, "orders"), orderData);
      setStep("success");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep("menu");
      setCart([]);
      setTableNo("");
      setPaymentMethod("");
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-auto max-h-[90vh] glass border-white/10 p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-serif font-bold">
              {step === "menu" && "Select Your Favorites"}
              {step === "details" && "Order Details"}
              {step === "payment" && "Payment Method"}
              {step === "success" && "Order Placed!"}
            </DialogTitle>
            {step !== "menu" && step !== "success" && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step === "details" ? "menu" : "details")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col min-h-0"
              >
                {/* User Info Header */}
                <div className="px-6 py-3 bg-primary/5 border-b border-white/5 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-primary" />
                    <span className="opacity-60 uppercase tracking-widest">Customer:</span>
                    <span className="font-bold">{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <span className="opacity-60 uppercase tracking-widest">Mobile:</span>
                    <span className="font-bold">{user?.phone}</span>
                  </div>
                </div>

                <div className="flex-grow overflow-hidden flex flex-col md:flex-row min-h-0">
                  {/* Menu List */}
                  <div className="flex-[2] overflow-y-auto p-6 border-r border-white/5 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24">
                      {menuItems.map((item, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex gap-4 group">
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-grow flex flex-col justify-between py-1">
                            <div>
                              <h4 className="font-serif font-bold text-sm">{item.name}</h4>
                              <p className="text-primary font-bold text-sm">{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {cart.find(i => i.name === item.name) ? (
                                <div className="flex items-center gap-3 bg-white/10 rounded-lg px-2 py-1">
                                  <button onClick={() => updateQuantity(item.name, -1)} className="p-1 hover:text-primary transition-colors">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold w-4 text-center">{cart.find(i => i.name === item.name)?.quantity}</span>
                                  <button onClick={() => addToCart(item)} className="p-1 hover:text-primary transition-colors">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <Button size="sm" variant="secondary" className="h-7 text-[10px] uppercase tracking-widest font-bold w-full" onClick={() => addToCart(item)}>
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cart Summary (Desktop Sidebar) */}
                  <div className="w-full md:w-72 bg-black/20 p-6 flex flex-col shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                      <h3 className="font-bold text-sm uppercase tracking-widest">Your Cart ({cart.length})</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto -mx-2 px-2 custom-scrollbar">
                      <div className="space-y-4 pb-4">
                        {cart.length === 0 ? (
                          <p className="text-xs opacity-40 italic text-center py-8">Your cart is empty</p>
                        ) : (
                          cart.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <div className="flex-grow">
                                <h5 className="text-xs font-medium truncate w-32">{item.name}</h5>
                                <p className="text-[10px] opacity-40">{item.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.name, -1)} className="p-1 rounded-md hover:bg-white/10"><Minus className="w-3 h-3" /></button>
                                <span className="text-xs font-bold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.name, 1)} className="p-1 rounded-md hover:bg-white/10"><Plus className="w-3 h-3" /></button>
                                <button onClick={() => removeFromCart(item.name)} className="p-1 text-red-500/50 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <Separator className="my-4 bg-white/10" />
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs uppercase tracking-widest opacity-40">Total</span>
                      <span className="text-xl font-serif font-bold text-primary">₹{totalAmount}</span>
                    </div>
                    <Button 
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold gold-glow"
                      disabled={cart.length === 0}
                      onClick={() => setStep("details")}
                    >
                      Checkout <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.2em] opacity-40">Customer Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <Input value={user?.name || ""} disabled className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.2em] opacity-40">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <Input value={user?.phone || ""} disabled className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase tracking-[0.2em] opacity-40">Select Table Number</Label>
                    <Select onValueChange={setTableNo} value={tableNo}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Armchair className="w-4 h-4 opacity-40" />
                          <SelectValue placeholder="Choose your seat" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                          <SelectItem key={num} value={`Table ${num}`} className="hover:bg-primary/20">Table {num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Order Summary</h4>
                  <div className="space-y-2">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="opacity-60">{item.name} x {item.quantity}</span>
                        <span className="font-medium">₹{parseInt(item.price.replace("₹", "")) * item.quantity}</span>
                      </div>
                    ))}
                    <Separator className="my-2 bg-white/5" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-lg gold-glow"
                  disabled={!tableNo}
                  onClick={() => setStep("payment")}
                >
                  Proceed to Payment
                </Button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-8"
              >
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setPaymentMethod("online")}
                    className={`p-6 rounded-2xl border transition-all flex items-center gap-6 text-left ${
                      paymentMethod === "online" 
                      ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === "online" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Online Payment</h4>
                      <p className="text-xs opacity-40">Pay securely via UPI, Cards or NetBanking</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-6 rounded-2xl border transition-all flex items-center gap-6 text-left ${
                      paymentMethod === "cod" 
                      ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === "cod" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Cash on Delivery (COD)</h4>
                      <p className="text-xs opacity-40">Pay by cash or QR code at your table</p>
                    </div>
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs opacity-40 mb-6 italic">By confirming, you agree to our terms of service and ordering policy.</p>
                  <Button 
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-lg gold-glow"
                    disabled={!paymentMethod || isSubmitting}
                    onClick={handlePlaceOrder}
                  >
                    {isSubmitting ? "Processing..." : `Confirm Order (₹${totalAmount})`}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto relative">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-primary/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <div>
                  <h2 className="text-4xl font-serif font-bold mb-2">Order Successful!</h2>
                  <p className="text-foreground/60">Your order has been sent to the kitchen.</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-primary/10 border border-primary/20 max-w-sm mx-auto gold-glow">
                  <Clock className="w-10 h-10 text-primary animate-pulse" />
                  <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-primary mb-1">5 min wait</p>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60 font-bold">Estimated Preparation Time</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5"
                    onClick={() => setStep("menu")}
                  >
                    Order More
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold gold-glow"
                    onClick={resetAndClose}
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
