import type { Product, Order, OrderStatus, UserRating, Testimonial, Review } from '../types';

const DB_PREFIX = 'shecarehub-db-';
const DB_PRODUCTS_KEY = `${DB_PREFIX}products`;
const DB_ORDERS_KEY = `${DB_PREFIX}orders`;
const DB_RATINGS_KEY = `${DB_PREFIX}ratings`;
const DB_TESTIMONIALS_KEY = `${DB_PREFIX}testimonials`;
const DB_REVIEWS_KEY = `${DB_PREFIX}reviews`;

const SIMULATED_LATENCY = 300; // ms

// --- Database Simulation ---

const seedData = () => {
    const initKey = `${DB_PREFIX}initialized`;
    if (!localStorage.getItem(initKey)) {
        localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify([]));
        localStorage.setItem(DB_TESTIMONIALS_KEY, JSON.stringify([]));
        localStorage.setItem(DB_REVIEWS_KEY, JSON.stringify([]));
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