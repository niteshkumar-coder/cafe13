export const CAFE_INFO = {
  name: "Cafe 13",
  logo: "https://i.ibb.co/b5T2smMJ/logo.png", // Attempting direct link format for ibb.co
  hashtag: "#13meracafe",
  address: "1st Floor, Surya Crystal, Boring Rd, opp. Karlo automobiles, Anandpuri, Patna, Bihar 800001",
  phone: "095255 66665",
  hours: "Open daily, closes at 10:00 PM",
  delivery: "Available now, ends at 9:30 PM",
  socials: {
    instagram: "https://instagram.com/cafe13patna", // Placeholder if exact not known
    facebook: "https://facebook.com/cafe13patna",
  },
  reservations: {
    swiggy: "#",
    eazyDiner: "#",
    zomato: "#",
  },
  ratings: [
    { platform: "Zomato", score: "4.5/5", votes: "638 votes" },
    { platform: "Facebook", score: "4.7/5", votes: "23 votes" },
    { platform: "Justdial", score: "4.2/5", votes: "4,960 votes" },
  ],
  testimonials: [
    {
      text: "Prices are reasonable for the food and place and the staff knows the menu well.",
      author: "Satisfied Guest",
    },
    {
      text: "Good service with beautiful ambiance... waiters are doing their work very well",
      author: "Happy Diner",
    },
  ],
  priceRanges: [
    { range: "₹1–200", label: "Quick Bites" },
    { range: "₹200–400", label: "Casual Dining" },
    { range: "₹400–600", label: "Full Experience" },
    { range: "₹600–800", label: "Premium Choice" },
    { range: "₹800–1,000", label: "Celebration" },
  ],
  menu: [
    {
      category: "Coffee & Beverages",
      items: [
        { name: "Artisanal Cappuccino", price: "₹180", desc: "Rich espresso with velvety steamed milk and a thick layer of foam.", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80" },
        { name: "Cold Brew Special", price: "₹220", desc: "12-hour slow-steeped coffee served over ice for a smooth, low-acid finish.", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80" },
        { name: "Hazelnut Latte", price: "₹210", desc: "Classic latte infused with premium roasted hazelnut syrup.", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80" },
        { name: "Fresh Fruit Coolers", price: "₹190", desc: "Refreshing blend of seasonal fruits, mint, and sparkling soda.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80" },
      ]
    },
    {
      category: "Pizza & Snacks",
      items: [
        { name: "Farmhouse Pizza", price: "₹350", desc: "Loaded with fresh bell peppers, onions, mushrooms, and sweet corn.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" },
        { name: "Peri Peri Fries", price: "₹160", desc: "Crispy golden fries tossed in our signature spicy peri-peri seasoning.", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80" },
        { name: "Classic Nachos", price: "₹240", desc: "Corn tortillas topped with melted cheese, jalapeños, and fresh salsa.", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80" },
        { name: "Stuffed Garlic Bread", price: "₹190", desc: "Freshly baked bread stuffed with mozzarella and sweet corn.", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80" },
      ]
    },
    {
      category: "Main Bites",
      items: [
        { name: "Creamy Pasta", price: "₹320", desc: "Penne tossed in a rich, velvety white sauce with exotic vegetables.", image: "https://images.unsplash.com/photo-1645112481338-316279765519?auto=format&fit=crop&w=800&q=80" },
        { name: "Cafe 13 Special Burger", price: "₹280", desc: "Double patty burger with caramelized onions, cheese, and secret sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
        { name: "Grilled Sandwich", price: "₹220", desc: "Triple-layered sandwich with fresh veggies and herb-infused butter.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80" },
        { name: "Exotic Platters", price: "₹450", desc: "A grand assortment of our best snacks and dips for sharing.", image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80" },
      ]
    },
    {
      category: "Desserts",
      items: [
        { name: "Choco Lava Cake", price: "₹180", desc: "Warm chocolate cake with a gooey, molten chocolate center.", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80" },
        { name: "Sizzling Brownie", price: "₹250", desc: "Hot brownie served on a sizzler plate with vanilla ice cream and fudge.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" },
        { name: "Blueberry Cheesecake", price: "₹280", desc: "Creamy New York style cheesecake topped with fresh blueberry compote.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80" },
        { name: "Waffle Delights", price: "₹240", desc: "Crispy Belgian waffles topped with maple syrup and fresh fruits.", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80" },
      ]
    }
  ],
  images: [
    "https://lh3.googleusercontent.com/p/AF1QipMJ95f9Wm16y4hMpnBszafYrzOyf9BXbRK-6EaA=w1000",
    "https://lh3.googleusercontent.com/p/AF1QipNGqbdqIPmEOebr7cr0q8X6gdw8gbfMMZ9LmuMd=w1000",
    "https://lh3.googleusercontent.com/p/AF1QipPe3SJAOGzqoeRsFXzzroIxTqSJgAVuXOaNbLDq=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweowjEgsu0N41Yf5iGiIZTY7FfGxR4LLkmO9nJGWsUhaSTdkDP0RDIgxHR_NGgAeiC3g_wyYHxj8NvJYzFj2dPN6OxuyJn36bQ2y8tfRTcbO5O1MQ54q8Dy09NEe5n6ayjLf_mNR=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq2MYymJp9mu2VSCFvujCNhzLCs_y05a_I0Z_Sf3aSmK3HxkVjDhYzKKx0VRCYwn6ef9MXfC8qdxf_-BARRNgbClEtdKqlTcw4aZwAf04C71H8nzRsXoDwxslKAnLQV4zeZoT64yPdcAFK0=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwernrrVaN3i7ZqUlsgkmONP5YGPST5hpzylK2XaBumTfC3FlbbkIBtYSlYqf0lHajP-3RCOy6QGz-XvwiWgtVqPOjb0gU5KGxveW2VTt5bTtBGSEpAP_cU3p67LWmwgJiQBSpHILQA=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq9a_9ZO0tVMV39NpLA7MFswzWnNpz9qSxmSnNqyvqVRN9YrTcC2CrXE5kMPaQ3hSPCWfBAU-gKwbW0pyMf3gdsc-e-tZlRK9LCMuJoqjL82cX7CRWRMlf4GIjCqUQJ_SY0onsf0j2cOia9=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerYOJVYUWtLoXxGRDQRrJ-EI5Stu1UvMqATXKrORdJOwbYdI4QY7zHkxKOEnqBH69TzWrrLCMsrAdfC35Rrc0e3ZCcu2SHOD_FVwZOa8VjmqMJ6nCNDkE8PiZNTZNil9JXBcFAOucC8CfE5=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepqvBybrAMVrZDCvDzYGdzVaAnJvxRwndDuQbl4pCinndVNU3bICJeD2A7_EaF1Qq7ne4utWksRwQtYQOzolgyF0__AY_3UNXnP0AhNb6tUQF4PLSXb9CGK7AJQBRVHPUmHQ7dz=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerOZssHG4G9H2pDQc4wf3qHP4q0fYdgMeAgc3LBkRWn9bCbS-eX48o_eFMVr1yMc66qnCVfFFMxsaMXa-GWP5zVkF8_GmybhyZ_GlP_APzrBhSMq7_c-_jBP4Xj5GU2zeyjx4IO=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepFAX0f6lxjuz6H01BXl1-ifEBaoKNWnnsSHXT0xwCGNdKvy_aVAZ7kkbRqhN78pPUXBZj2sos94-M4J0FMaLw-3gnfI6eH8n4Com72ll7_DxkLrSjFWGj5VrtBpj5qMKtSR1eLRAmFXZc=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoYJOAuQJExiWgDex_tVewHHo_WZvRacGzByQD4UrJ-LtwSl90C6G5CT44SzD39q7x_zdt_Uv2LSLZhJj-6V9Tiqv-VkR3dDKDQ51ZIHgUeg2rsQeULCUg0MfscwEEQ6dcp9z2N=w1000",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqUqcRF-ns_FLG6BK-5yV30I_r7M-15TlBViKDIm0-c97L2KTmRBcrZwWDqft_CjA0oZfCMUb4LP9237lb_SVFBlMvQFfj-jTjRKUQsREu1svBHttPDglON0QWSKn5wBJz0CPUf=w1000",
  ]
};
