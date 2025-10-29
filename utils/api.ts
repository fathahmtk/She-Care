import type { Product, Order, OrderStatus, UserRating, Testimonial, Review, Shade } from '../types';

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
        name: "Kerala Kasavu Saree",
        brand: "Malabar Weaves",
        description: "An elegant, handwoven Kasavu saree featuring a classic off-white cotton body with a beautiful golden zari border. Perfect for festive occasions and cultural events, embodying the timeless grace of Kerala's heritage.",
        imageUrls: [
            "https://images.pexels.com/photos/15822340/pexels-photo-15822340/free-photo-of-a-woman-in-a-traditional-indian-sari.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/11283238/pexels-photo-11283238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/18029683/pexels-photo-18029683/free-photo-of-woman-in-traditional-indian-sari.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/11495395/pexels-photo-11495395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/15822338/pexels-photo-15822338/free-photo-of-woman-in-traditional-indian-sari.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Sarees",
        rating: 4.9,
        reviewCount: 152,
        price: 3499,
        mrp: 4999,
        discount: "30%",
        inStock: true,
        tag: "Best Seller",
        color: "Off-white & Gold",
        materials: "100% Handloom Cotton, Golden Zari",
        dimensions: "6.25 meters length",
        careInstructions: "Dry clean only. Store in a cool, dry place."
    },
    {
        id: 2,
        name: "Chikankari Hand-Embroidered Kurti",
        brand: "Lucknowi Threads",
        description: "A beautifully crafted pastel green kurti made from soft georgette, featuring delicate hand-embroidered Chikankari work. This piece blends traditional artistry with a modern silhouette.",
        imageUrls: [
            "https://images.pexels.com/photos/8999990/pexels-photo-8999990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/11585501/pexels-photo-11585501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/7621041/pexels-photo-7621041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/7621040/pexels-photo-7621040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/9000003/pexels-photo-9000003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/11585499/pexels-photo-11585499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Kurtis",
        rating: 4.7,
        reviewCount: 98,
        price: 2199,
        mrp: 3299,
        discount: "33%",
        inStock: true,
        tag: "New Arrival",
        color: "Pastel Green",
        materials: "Faux Georgette, Cotton Thread",
        careInstructions: "Gentle hand wash recommended."
    },
    {
        id: 3,
        name: "Antique Temple Jewelry Necklace",
        brand: "Dakshin Jewels",
        description: "A stunning antique gold-plated necklace inspired by South Indian temple jewelry. Features intricate carvings of deities and is adorned with kemp stones, perfect for weddings and grand celebrations.",
        imageUrls: [
            "https://images.pexels.com/photos/15993936/pexels-photo-15993936/free-photo-of-a-woman-wearing-a-traditional-indian-wedding-dress.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/9777569/pexels-photo-9777569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/14873133/pexels-photo-14873133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/10372337/pexels-photo-10372337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/11649231/pexels-photo-11649231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/15993946/pexels-photo-15993946/free-photo-of-a-close-up-of-a-woman-wearing-a-necklace.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Jewelry",
        rating: 4.8,
        reviewCount: 76,
        price: 4999,
        mrp: 6999,
        discount: "29%",
        inStock: false,
        tag: "Limited Edition",
        color: "Antique Gold",
        materials: "Brass, Gold Plating, Kemp Stones",
        careInstructions: "Store in a zip-lock bag. Avoid contact with perfumes and water."
    },
    {
        id: 4,
        name: "Peacock Jhumka Earrings",
        brand: "Jaipur Gems",
        description: "Exquisite gold-plated Jhumka earrings in a traditional peacock design, studded with vibrant kemp stones and pearls. A timeless accessory for any ethnic ensemble.",
        imageUrls: [
            "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/2669188/pexels-photo-2669188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/17933100/pexels-photo-17933100/free-photo-of-a-woman-in-a-sari-and-jewelry.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/1034983/pexels-photo-1034983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/984897/pexels-photo-984897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Jewelry",
        rating: 4.9,
        reviewCount: 112,
        price: 1299,
        mrp: 2499,
        discount: "48%",
        inStock: true,
        tag: "New Arrival",
        color: "Gold & Multi-color",
        materials: "Brass, Gold Plating, Kemp Stones, Faux Pearls",
        careInstructions: "Wipe with a soft cloth after use. Store in an airtight box."
    },
    {
        id: 5,
        name: "Jaipuri Bandhani Dupatta",
        brand: "Rang Rajasthan",
        description: "A vibrant and traditional Bandhani dupatta from Jaipur, handcrafted with the timeless tie-and-dye technique. Made from soft art silk, it adds a pop of color and ethnic charm to any outfit.",
        imageUrls: [
            "https://images.pexels.com/photos/11093938/pexels-photo-11093938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/12470944/pexels-photo-12470944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/12470943/pexels-photo-12470943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        ],
        category: "Accessories",
        rating: 4.6,
        reviewCount: 85,
        price: 799,
        mrp: 1599,
        discount: "50%",
        inStock: true,
        tag: "Vibrant",
        color: "Multi-color",
        materials: "Art Silk",
        careInstructions: "Gentle hand wash separately in cold water."
    }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 1, quote: "The Kasavu saree I bought is absolutely breathtaking. The quality of the handloom cotton is superb, and it drapes beautifully. A true classic!", author: "Aishwarya R., Chennai", rating: 5 },
  { id: 2, quote: "I'm in love with my Chikankari kurti. The embroidery is so intricate and delicate. I received so many compliments at my office party.", author: "Neha S., Delhi", rating: 5 },
  { id: 3, quote: "SheCareHub is my go-to for authentic Indian wear. Their collection is curated with such taste. The temple necklace I ordered is a masterpiece.", author: "Priya V., Hyderabad", rating: 5 },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 1, productId: 1, author: "Lakshmi M.", productName: "Kerala Kasavu Saree", rating: 5, comment: "Pure elegance. This saree reminded me of my mother's wedding saree. The zari is not too loud, just perfect. So happy with this purchase.", date: "2023-10-15T10:00:00Z" },
  { id: 2, productId: 2, author: "Sunita G.", productName: "Chikankari Kurti", rating: 5, comment: "The fitting is perfect and the material is so comfortable for summer. The handwork is exquisite. Worth every penny!", date: "2023-10-12T14:30:00Z" },
  { id: 3, productId: 1, author: "Deepa K.", productName: "Kerala Kasavu Saree", rating: 4, comment: "Beautiful saree, though a little more maintenance than I expected. But it looks stunning on. Received it very quickly.", date: "2023-10-10T08:45:00Z" },
  { id: 4, productId: 3, author: "Anjali P.", productName: "Antique Temple Jewelry Necklace", rating: 5, comment: "This necklace is a statement piece! It's heavy in a good way, feels so royal. The craftsmanship is just out of this world. Can't wait to wear it.", date: "2023-10-20T11:00:00Z" },
  { id: 5, productId: 2, author: "Rhea S.", productName: "Chikankari Kurti", rating: 4, comment: "Lovely kurti, the color is very soothing. I wish there were more color options available in this design.", date: "2023-10-18T19:20:00Z" },
  { id: 6, productId: 4, author: "Pooja B.", productName: "Peacock Jhumka Earrings", rating: 5, comment: "Absolutely gorgeous earrings! They are not too heavy and look so elegant. The peacock design is very detailed. I'm in love with them.", date: "2023-10-22T16:00:00Z" },
  { id: 7, productId: 4, author: "Vidya R.", productName: "Peacock Jhumka Earrings", rating: 4, comment: "Very pretty jhumkas. The colours are vibrant. The only thing is the back post is a little thick for me, but it's manageable. Overall a good buy.", date: "2023-10-21T09:15:00Z" },
  { id: 8, productId: 5, author: "Kavita S.", productName: "Jaipuri Bandhani Dupatta", rating: 5, comment: "The colors are so bright and beautiful! It looks exactly like the picture. Very happy with this purchase.", date: "2023-10-23T11:00:00Z" },
  { id: 9, productId: 5, author: "Priya N.", productName: "Jaipuri Bandhani Dupatta", rating: 4, comment: "Lovely dupatta, the fabric is soft. A little bit of color bled in the first wash, but it's fine now. It's a beautiful piece.", date: "2023-10-20T18:30:00Z" }
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
    // Prevent duplicate ratings from the same user session for simplicity
    const existingIndex = ratings.findIndex(r => r.productId === newRating.productId);
    if (existingIndex > -1) {
        // In a real app, you'd check user ID. Here, we just update the existing one.
        const updatedRatings = [...ratings];
        updatedRatings[existingIndex] = newRating;
        db.set(DB_RATINGS_KEY, updatedRatings);
    } else {
        db.set(DB_RATINGS_KEY, [...ratings, newRating]);
    }
    return simulateRequest(newRating);
};

// STATIC CONTENT
export const getTestimonials = (): Promise<Testimonial[]> => simulateRequest(db.get<Testimonial>(DB_TESTIMONIALS_KEY));
export const getReviews = (): Promise<Review[]> => simulateRequest(db.get<Review>(DB_REVIEWS_KEY));
export const addReview = (reviewData: Omit<Review, 'id'>): Promise<Review> => {
    const reviews = db.get<Review>(DB_REVIEWS_KEY);
    const newReview: Review = { ...reviewData, id: Date.now() };
    db.set(DB_REVIEWS_KEY, [newReview, ...reviews]); // Add to the top of the list
    return simulateRequest(newReview);
};