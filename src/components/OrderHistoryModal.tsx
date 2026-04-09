import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Package, 
  Clock, 
  ChevronRight, 
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; phone: string; uid: string } | null;
  onReorder: (items: any[]) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, user, onReorder }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef, 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] glass border-white/10 p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-serif font-bold">Order History</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          <div className="pb-10">
            {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest opacity-40">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <ShoppingBag className="w-12 h-12 opacity-10" />
              <div>
                <p className="font-serif text-xl opacity-40">No orders yet</p>
                <p className="text-xs opacity-30 mt-1">Your delicious journey starts here!</p>
              </div>
              <Button variant="outline" onClick={onClose} className="mt-4 rounded-full border-primary/30 text-primary">
                Explore Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/30 text-primary bg-primary/5">
                          {order.status || "Pending"}
                        </Badge>
                        <span className="text-[10px] opacity-40 uppercase tracking-tighter">#{order.id.slice(-6)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-60">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-serif font-bold text-primary">{order.total}</p>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest">Table {order.tableNo}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="opacity-70">{item.name} x {item.quantity}</span>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="secondary" 
                    className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-widest gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    onClick={() => onReorder(order.items)}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reorder Items
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DialogContent>
    </Dialog>
  );
};
