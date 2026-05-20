"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Send, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTables } from "@/store/slices/tablesSlice";
import { addNewOrder } from "@/store/slices/ordersSlice";
import { getMenu } from "@/services/restaurants";
import { formatPrice } from "@/lib/format";

export default function ManualOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tables = useSelector(selectAllTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("starters");

  const menu = getMenu("spice-garden");
  const categories = ["starters", "mains", "breads", "desserts", "drinks"];

  const filteredItems = menu.filter(
    (item) =>
      item.group === activeCategory &&
      (item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()))
  );

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1, status: "preparing" }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((c) => c.id === itemId);
    if (existing && existing.qty > 1) {
      setCart(cart.map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c)));
    } else {
      setCart(cart.filter((c) => c.id !== itemId));
    }
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const sendToKitchen = () => {
    if (!selectedTable || cart.length === 0) return;

    const table = tables.find((t) => t.id === selectedTable);
    const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    dispatch(
      addNewOrder({
        id: orderId,
        tableNumber: table.number,
        customerType: "dine-in",
        status: "preparing",
        groups: [
          {
            id: `grp-${Date.now()}`,
            number: 1,
            items: cart,
            servingTime: "now",
            status: "preparing",
            createdAt: Date.now(),
          },
        ],
        totalAmount: total,
        createdAt: Date.now(),
      })
    );

    router.push("/waiter/dashboard");
  };

  return (
    <Container className="min-h-screen pb-32 max-w-2xl mx-auto">
      <TopBar title="Take Order" subtitle="Manual order entry" backTo="/waiter/dashboard" />

      {/* Table selection */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3 px-1">Select Table</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`rounded-2xl p-3 text-center font-bold text-lg transition ${
                selectedTable === table.id
                  ? "bg-primary text-primary-foreground"
                  : table.status === "empty"
                  ? "glass hover:bg-white/10"
                  : "glass opacity-40"
              }`}
            >
              T{table.number}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl glass px-4 h-11">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search menu..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* Category tabs */}
      <div className="mt-4 -mx-5 px-5 flex gap-2 overflow-x-auto scroll-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
              activeCategory === cat ? "bg-primary text-primary-foreground" : "glass text-foreground/70"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="mt-4 space-y-2">
        {filteredItems.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div key={item.id} className="glass rounded-2xl p-3 flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
              </div>
              {inCart ? (
                <div className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground h-8 px-1.5">
                  <button onClick={() => removeFromCart(item.id)} className="grid place-items-center h-6 w-6 rounded hover:bg-white/10">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center tabular-nums">{inCart.qty}</span>
                  <button onClick={() => addToCart(item)} className="grid place-items-center h-6 w-6 rounded hover:bg-white/10">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(item)}
                  className="rounded-lg bg-primary text-primary-foreground h-8 px-3 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom cart bar */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent p-5 pt-8"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={sendToKitchen}
            disabled={!selectedTable}
            className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-50 inline-flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-semibold">{cart.reduce((n, c) => n + c.qty, 0)} items</div>
                <div className="text-xs opacity-80">{formatPrice(total)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send to Kitchen
            </div>
          </motion.button>
        </motion.div>
      )}
    </Container>
  );
}
