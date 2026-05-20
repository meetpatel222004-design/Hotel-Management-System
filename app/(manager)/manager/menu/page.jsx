"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllMenuItems, toggleItemAvailability, addMenuItem, removeMenuItem } from "@/store/slices/menuSlice";
import { formatPrice } from "@/lib/format";
import { Modal } from "@/components/shared/Modal";

const CATEGORIES = [
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Main Course" },
  { id: "breads", label: "Breads & Rice" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];

const DEFAULT_IMAGES = {
  starters: "https://images.pexels.com/photos/5737489/pexels-photo-5737489.jpeg?auto=compress&cs=tinysrgb&w=400",
  mains: "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400",
  breads: "https://images.pexels.com/photos/5559881/pexels-photo-5559881.jpeg?auto=compress&cs=tinysrgb&w=400",
  desserts: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400",
  drinks: "https://images.pexels.com/photos/5404466/pexels-photo-5404466.jpeg?auto=compress&cs=tinysrgb&w=400",
};

export default function ManagerMenuPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectAllMenuItems);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Container className="min-h-screen pb-10 max-w-2xl mx-auto">
      <TopBar title="Menu" subtitle="Manage menu items" backTo="/manager/dashboard" />

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Add new item</span>
      </motion.button>

      {CATEGORIES.map((cat) => {
        const categoryItems = items.filter((i) => i.category === cat.id);
        if (categoryItems.length === 0) return null;

        return (
          <div key={cat.id} className="mt-8">
            <h2 className="text-sm font-semibold mb-3 px-1">{cat.label}</h2>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass rounded-2xl p-3 flex items-center gap-3 ${!item.available ? "opacity-50" : ""}`}
                >
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(toggleItemAvailability(item.id))}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10 transition"
                      title={item.available ? "Hide item" : "Show item"}
                    >
                      {item.available ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    <button
                      onClick={() => dispatch(removeMenuItem(item.id))}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(item) => { dispatch(addMenuItem(item)); setShowAddModal(false); }}
      />
    </Container>
  );
}

function AddItemModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mains");
  const [isVeg, setIsVeg] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onAdd({
      id: `item-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price, 10) || 0,
      category,
      image: DEFAULT_IMAGES[category] || DEFAULT_IMAGES.mains,
      available: true,
      popular: false,
      veg: isVeg,
    });
    setName(""); setDescription(""); setPrice(""); setCategory("mains"); setIsVeg(true);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Item Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken Biryani"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Price (INR)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="250" min="1"
              className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent">
              {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id} className="bg-background">{cat.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Type</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsVeg(true)}
              className={`flex-1 rounded-2xl py-3 text-sm font-semibold border transition ${isVeg ? "border-green-500/50 bg-green-500/10 text-green-500" : "border-border glass text-muted-foreground"}`}>
              Vegetarian
            </button>
            <button type="button" onClick={() => setIsVeg(false)}
              className={`flex-1 rounded-2xl py-3 text-sm font-semibold border transition ${!isVeg ? "border-red-500/50 bg-red-500/10 text-red-500" : "border-border glass text-muted-foreground"}`}>
              Non-Vegetarian
            </button>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Add Item</button>
        </div>
      </form>
    </Modal>
  );
}
