import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { Phone, User, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  updateProfile
} from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; phone: string; uid: string }) => void;
}

type LoginStep = "phone" | "name" | "otp" | "success";

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    let timeoutId: any;

    if (isOpen && !recaptchaVerifier.current) {
      const initRecaptcha = () => {
        const el = document.getElementById("recaptcha-container");
        if (el) {
          try {
            if (recaptchaVerifier.current) {
              recaptchaVerifier.current.clear();
            }
            
            // Using 'normal' size instead of 'invisible' to avoid timeouts in iframes
            recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", {
              size: "normal",
              callback: () => {
                console.log("Recaptcha solved");
              },
              "expired-callback": () => {
                console.log("Recaptcha expired");
                if (recaptchaVerifier.current) recaptchaVerifier.current.reset();
              }
            });
            
            recaptchaVerifier.current.render().catch(err => {
              console.error("Error rendering recaptcha:", err);
            });
          } catch (err) {
            console.error("Recaptcha init error:", err);
          }
        } else {
          timeoutId = setTimeout(initRecaptcha, 100);
        }
      };
      
      initRecaptcha();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Ensure phone number is in E.164 format
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+91" + formattedPhone;
      }

      // DIRECT LOGIN BYPASS for 9142645990
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone === "9142645990" || cleanPhone === "919142645990") {
        // Use anonymous auth to get a real session for database access
        const { signInAnonymously } = await import("firebase/auth");
        const result = await signInAnonymously(auth);
        const user = result.user;

        // Try to find existing user in Firestore to get their real name
        let existingName = "Admin User";
        try {
          // We use a direct doc get instead of a query to avoid collection-level permission issues
          // However, we don't know the UID of the user who owns this phone number yet.
          // So we'll just skip the fetch and use the default for the bypass.
          // This avoids "Missing or insufficient permissions" logs.
          /*
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("phone", "==", "+919142645990"));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            existingName = querySnapshot.docs[0].data().name;
          }
          */
        } catch (err) {
          // Silent fail
        }

        setName(existingName);
        setStep("success");
        
        setTimeout(() => {
          onLoginSuccess({ 
            name: existingName, 
            phone: "+919142645990", 
            uid: user.uid // Use the real anonymous UID for database rules
          });
          onClose();
          resetForm();
        }, 1500);
        return;
      }

      if (!recaptchaVerifier.current) {
        const el = document.getElementById("recaptcha-container");
        if (el) {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal"
          });
        } else {
          throw new Error("Recaptcha container not found.");
        }
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      // Handle specific reCAPTCHA errors
      if (err.message?.includes("reCAPTCHA")) {
        setError("reCAPTCHA verification failed or timed out. Please try again.");
      } else if (err.code === "auth/operation-not-allowed" || err.message?.includes("operation-not-allowed")) {
        setError("Authentication methods (Phone/Anonymous) are not enabled in your Firebase Console. Please enable BOTH 'Phone' and 'Anonymous' under Authentication > Sign-in method.");
      } else if (err.code === "auth/admin-restricted-operation" || err.message?.includes("admin-restricted-operation")) {
        setError("User registration is disabled. Please go to Firebase Console > Authentication > Settings > User actions and enable 'Allow users to sign up'. Also ensure 'Anonymous' auth is enabled.");
      } else {
        setError(err.message || "Failed to send OTP.");
      }
      
      if (recaptchaVerifier.current) {
        try { 
          recaptchaVerifier.current.clear(); 
        } catch (e) {}
        recaptchaVerifier.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !confirmationResult) return;

    setError(null);
    setIsLoading(true);
    
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user exists in Firestore after successful login
      const userRef = doc(db, "users", user.uid);
      
      // Let's use getDoc for simplicity and rule compliance
      const { getDoc } = await import("firebase/firestore");
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // Existing User
        const userData = docSnap.data();
        setName(userData.name);
        setIsNewUser(false);
        
        setStep("success");
        setTimeout(() => {
          onLoginSuccess({ 
            name: userData.name, 
            phone: user.phoneNumber || phone, 
            uid: user.uid 
          });
          onClose();
          resetForm();
        }, 2000);
      } else {
        // New User
        setIsNewUser(true);
        setStep("name");
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !auth.currentUser) return;

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: name,
        phone: user.phoneNumber,
        createdAt: serverTimestamp()
      });

      setStep("success");
      setTimeout(() => {
        onLoginSuccess({ 
          name, 
          phone: user.phoneNumber || phone, 
          uid: user.uid 
        });
        onClose();
        resetForm();
      }, 2000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTimeout(() => {
      setStep("phone");
      setName("");
      setPhone("");
      setOtp("");
      setError(null);
      setIsNewUser(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] glass border-white/10 p-0 overflow-hidden">
        <div className="relative p-8">
          <div id="recaptcha-container" className="flex justify-center mb-4 min-h-[78px]"></div>
          
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif font-bold">Welcome to Cafe 13</DialogTitle>
                  <DialogDescription className="text-foreground/60">
                    Enter your mobile number to continue.
                  </DialogDescription>
                </DialogHeader>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-widest opacity-60">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gold-glow font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Checking..." : "Continue"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif font-bold">Almost There!</DialogTitle>
                  <DialogDescription className="text-foreground/60">
                    It looks like you're new here. Please tell us your name.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest opacity-60">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gold-glow font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif font-bold">Verify OTP</DialogTitle>
                  <DialogDescription className="text-foreground/60">
                    {isNewUser ? `Welcome ${name}! ` : `Welcome back ${name}! `}
                    We've sent a code to <span className="text-primary font-medium">{phone}</span>
                  </DialogDescription>
                </DialogHeader>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-xs uppercase tracking-widest opacity-60">6-Digit Code</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <Input
                        id="otp"
                        placeholder="000000"
                        maxLength={6}
                        className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50 tracking-[0.5em] font-mono text-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gold-glow font-bold"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <p className="text-center text-xs opacity-40">
                    Didn't receive the code? <button type="button" className="text-primary hover:underline" onClick={() => handleSendOtp()}>Resend</button>
                  </p>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Login Successful!</h3>
                <p className="text-foreground/60">Welcome back, {name}. Redirecting you to checkout...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
