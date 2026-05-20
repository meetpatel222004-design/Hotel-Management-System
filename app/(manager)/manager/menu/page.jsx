"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, EyeOff, Trash2, Upload, Flame } from "lucide-react";
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

const SPICY_LEVELS = [
  { value: 0, label: "Not Spicy", color: "text-muted-foreground" },
  { value: 1, label: "Mild", color: "text-yellow-500" },
  { value: 2, label: "Medium", color: "text-orange-500" },
  { value: 3, label: "Hot", color: "text-red-500" },
];

export default function ManagerMenuPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectAllMenuItems);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Container className="min-h-screen pb-10 max-w-5xl mx-auto">
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                      {item.spicy > 0 && (
                        <span className="flex items-center gap-0.5 text-xs">
                          {Array.from({ length: item.spicy }).map((_, i) => (
                            <Flame key={i} className="h-3 w-3 text-red-500" />
                          ))}
                        </span>
                      )}
                      {item.veg && (
                        <span className="text-xs border border-green-500/30 text-green-500 rounded px-1">V</span>
                      )}
                    </div>
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
  const [spicy, setSpicy] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState("");
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageData(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onAdd({
      id: `item-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price, 10) || 0,
      category,
      image: imageData || DEFAULT_IMAGES[category] || DEFAULT_IMAGES.mains,
      available: true,
      popular: false,
      veg: isVeg,
      spicy,
    });
    setName(""); setDescription(""); setPrice(""); setCategory("mains"); setIsVeg(true); setSpicy(0); setImagePreview(null); setImageData("");
  };

  const handleClose = () => {
    setName(""); setDescription(""); setPrice(""); setCategory("mains"); setIsVeg(true); setSpicy(0); setImagePreview(null); setImageData("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Item">
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

        {/* Type */}
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

        {/* Spicy Level */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Spicy Level</label>
          <div className="grid grid-cols-4 gap-2">
            {SPICY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setSpicy(level.value)}
                className={`rounded-2xl py-2.5 text-xs font-semibold border transition text-center ${
                  spicy === level.value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border glass text-muted-foreground"
                }`}
              >
                {level.value > 0 && (
                  <span className="flex items-center justify-center gap-0.5 mb-0.5">
                    {Array.from({ length: level.value }).map((_, i) => (
                      <Flame key={i} className="h-3 w-3" />
                    ))}
                  </span>
                )}
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Item Image</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageData(""); }}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white grid place-items-center text-sm hover:bg-black/80 transition"
              >
                &times;
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full glass rounded-2xl p-6 flex flex-col items-center gap-2 hover:bg-white/10 transition border-2 border-dashed border-white/10"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
            </button>
          )}
          {!imagePreview && (
            <p className="text-xs text-muted-foreground mt-1.5">A default image will be used if none is uploaded.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Add Item</button>
        </div>
      </form>
    </Modal>
  );
}
