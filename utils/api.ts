import type { Product, Order, OrderStatus, UserRating, Testimonial, Review } from '../types';

const DB_PREFIX = 'shecarehub-db-';
const DB_PRODUCTS_KEY = `${DB_PREFIX}products`;
const DB_ORDERS_KEY = `${DB_PREFIX}orders`;
const DB_RATINGS_KEY = `${DB_PREFIX}ratings`;
const DB_TESTIMONIALS_KEY = `${DB_PREFIX}testimonials`;
const DB_REVIEWS_KEY = `${DB_PREFIX}reviews`;

const SIMULATED_LATENCY = 300; // ms

// --- Initial Data ---
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Menstrual Pain Relief Belt",
        brand: "SheCareHub",
        description: "A smart, wearable device that uses a combination of heat and massage therapy to soothe menstrual cramps. Discreet, comfortable, and easy to use on the go.",
        imageUrls: [
            "https://m.media-amazon.com/images/I/71YqDc-POJL.jpg",
            "https://m.media-amazon.com/images/I/81+j8S6j5gL.jpg",
            "https://m.media-amazon.com/images/I/71I5n-o0R3L.jpg"
        ],
        modelUrl: "https://firebasestorage.googleapis.com/v0/b/shecarehub-f8b27.appspot.com/o/scene.gltf?alt=media&token=c148201a-6379-4560-84a8-a53d6de5d06d",
        videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ?si=WpY-a3vaxLz2OaWz",
        category: "Wellness Tech",
        rating: 4.8,
        reviewCount: 258,
        price: 699,
        mrp: 1499,
        discount: "53%",
        inStock: true,
        tag: "Best Seller",
        color: "Pastel Pink",
        materials: "Soft-touch Silicone, Lycra Fabric",
        dimensions: "18cm x 8.5cm",
        careInstructions: "Wipe with a damp cloth. Do not submerge in water."
    },
    {
        id: 2,
        name: "Radiant Glow Vitamin C Serum",
        brand: "Aura Botanicals",
        description: "A potent, lightweight Vitamin C serum that brightens skin, reduces dark spots, and protects against environmental damage for a radiant, even-toned complexion.",
        imageUrls: [
            "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/7262912/pexels-photo-7262912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Skincare",
        rating: 4.6,
        reviewCount: 189,
        price: 899,
        mrp: 1299,
        discount: "31%",
        inStock: true,
        tag: "New Arrival",
        color: "N/A"
    },
    {
        id: 3,
        name: "Hydra-Intense Lipstick",
        brand: "Femme Beauty",
        description: "A creamy, long-lasting lipstick that delivers intense color and hydration. Infused with hyaluronic acid and shea butter to keep lips soft and supple.",
        imageUrls: [
            "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/3335508/pexels-photo-3335508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Makeup",
        rating: 4.9,
        reviewCount: 302,
        price: 549,
        mrp: 799,
        discount: "31%",
        inStock: true,
        tag: "Fan Favorite",
        color: "Ruby Red",
        shades: [
            { name: 'Ruby Red', hex: '#9B111E' },
            { name: 'Nude Rose', hex: '#C48189' },
            { name: 'Coral Kiss', hex: '#F88379' },
            { name: 'Deep Plum', hex: '#3E2F84' }
        ]
    }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 1, quote: "The relief belt is a lifesaver! I can finally get through my day without being doubled over in pain. It's so discreet and comfortable.", author: "Priya S., Bangalore", rating: 5 },
  { id: 2, quote: "SheCareHub products feel so luxurious. The Vitamin C serum has completely transformed my skin's texture and glow. Highly recommend!", author: "Anjali M., Mumbai", rating: 5 },
  { id: 3, quote: "Finally, a brand that understands what women need. The quality is exceptional, and the customer service is so helpful and kind.", author: "Riya G., Delhi", rating: 5 },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 1, productId: 1, author: "Sneha P.", productName: "Menstrual Pain Relief Belt", rating: 5, comment: "This is a game-changer. The combination of heat and massage is perfect. I used to rely on painkillers, but now I just use this belt.", date: "2023-10-15T10:00:00Z" },
  { id: 2, productId: 2, author: "Meera K.", productName: "Radiant Glow Vitamin C Serum", rating: 4, comment: "Good serum, my skin feels brighter. The bottle is a bit small for the price, but the results are visible.", date: "2023-10-12T14:30:00Z" },
  { id: 3, productId: 1, author: "Aditi V.", productName: "Menstrual Pain Relief Belt", rating: 5, comment: "I was skeptical, but it actually works! It's super soft and the battery lasts a long time. So glad I bought it.", date: "2023-10-10T08:45:00Z" },
];

// --- Database Simulation ---

const seedData = () => {
    const initKey = `${DB_PREFIX}initialized`;
    if (!localStorage.getItem(initKey)) {
        localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem(DB_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
        localStorage.setItem(DB_REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
        localStorage.setItem(DB_ORDERS_KEY, JSON.stringify([]));
        localStorage.setItem(DB_RATINGS_KEY, JSON.stringify([]));
        localStorage.setItem(initKey, 'true');
    }
};

seedData();

const db = {
    get: <T>(key: string): T[] => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Failed to read from localStorage key "${key}"`, e);
            return [];
        }
    },
    set: <T>(key: string, data: T[]): void => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to write to localStorage key "${key}"`, e);
        }
    }
};

const simulateRequest = <T>(data: T, latency: number = SIMULATED_LATENCY): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), latency);
    });
};

// --- API Methods ---

// PRODUCTS
export const getProducts = (): Promise<Product[]> => simulateRequest(db.get<Product>(DB_PRODUCTS_KEY));
export const addProduct = (productData: Omit<Product, 'id'>): Promise<Product> => {
    const products = db.get<Product>(DB_PRODUCTS_KEY);
    const newProduct: Product = { ...productData, id: Date.now() + Math.random() };
    db.set(DB_PRODUCTS_KEY, [...products, newProduct]);
    return simulateRequest(newProduct);
};
export const updateProduct = (updatedProduct: Product): Promise<Product> => {
    const products = db.get<Product>(DB_PRODUCTS_KEY);
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    db.set(DB_PRODUCTS_KEY, updatedProducts);
    return simulateRequest(updatedProduct);
};
export const deleteProduct = (productId: number): Promise<void> => {
    const products = db.get<Product>(DB_PRODUCTS_KEY);
    db.set(DB_PRODUCTS_KEY, products.filter(p => p.id !== productId));
    return simulateRequest(undefined);
};

// ORDERS
export const getOrders = (): Promise<Order[]> => simulateRequest(db.get<Order>(DB_ORDERS_KEY));
export const addOrder = (newOrder: Order): Promise<Order> => {
    const orders = db.get<Order>(DB_ORDERS_KEY);
    db.set(DB_ORDERS_KEY, [...orders, newOrder]);
    return simulateRequest(newOrder);
};
export const updateOrderStatus = (orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    const orders = db.get<Order>(DB_ORDERS_KEY);
    let updatedOrder: Order | undefined;
    const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
            updatedOrder = { ...order, status };
            return updatedOrder;
        }
        return order;
    });
    db.set(DB_ORDERS_KEY, updatedOrders);
    return simulateRequest(updatedOrder);
};

// RATINGS
export const getRatings = (): Promise<UserRating[]> => simulateRequest(db.get<UserRating>(DB_RATINGS_KEY));
export const addRating = (newRating: UserRating): Promise<UserRating> => {
    const ratings = db.get<UserRating>(DB_RATINGS_KEY);
    db.set(DB_RATINGS_KEY, [...ratings, newRating]);
    return simulateRequest(newRating);
};

// STATIC CONTENT
export const getTestimonials = (): Promise<Testimonial[]> => simulateRequest(db.get<Testimonial>(DB_TESTIMONIALS_KEY));
export const getReviews = (): Promise<Review[]> => simulateRequest(db.get<Review>(DB_REVIEWS_KEY));
export const addReview = (reviewData: Omit<Review, 'id'>): Promise<Review> => {
    const reviews = db.get<Review>(DB_REVIEWS_KEY);
    const newReview: Review = { ...reviewData, id: Date.now() };
    db.set(DB_REVIEWS_KEY, [...reviews, newReview]);
    return simulateRequest(newReview);
};