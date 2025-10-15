

import React, { useState, useRef } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';
import { useProducts } from '../../contexts/ProductContext';
import type { Product } from '../../types';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import CloseIcon from '../icons/CloseIcon';
import AdminEmptyState from './AdminEmptyState';
import EmptyProductsIcon from '../icons/EmptyProductsIcon';
import UploadIcon from '../icons/UploadIcon';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const emptyProduct: Omit<Product, 'id'> = {
  name: '', brand: '', description: '', imageUrls: [], category: 'Skincare', price: 0, mrp: 0,
  discount: '', inStock: true, tag: 'New Arrival', color: '',
  materials: '', dimensions: '', careInstructions: '', rating: 0, reviewCount: 0,
};

const ProductFormModal: React.FC<{
  product: Product | Omit<Product, 'id'> | null;
  onClose: () => void;
  onSave: (productData: Product | Omit<Product, 'id'>) => Promise<void>;
}> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || emptyProduct);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({...prev, [name]: checked }));
    } else {
        setFormData(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;

    try {
        const base64Promises = Array.from(files).map(fileToBase64);
        const newImageUrls = await Promise.all(base64Promises);
        setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...newImageUrls],
        }));
    } catch (error) {
        console.error("Error converting files to Base64", error);
        alert("There was an error processing your images. Please try again.");
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
      setFormData(prev => ({
          ...prev,
          imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
        alert("Please upload at least one image for the product.");
        return;
    }
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };
  
  const inputStyles = "w-full mt-1 p-2 bg-surface border border-border-color rounded-md text-text-primary focus:ring-2 focus:ring-accent focus:border-accent";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-xl font-semibold text-text-primary">{'id' in formData && product && 'id' in product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-accent p-2 rounded-md transition-colors"><CloseIcon className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-text-secondary">
            <div>
                <label className="text-sm font-medium">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className={inputStyles} rows={3} required></textarea>
            </div>
             <div>
                <label className="text-sm font-medium">Images</label>
                <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-md cursor-pointer hover:border-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e.dataTransfer.files);
                    }}
                >
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-text-secondary" />
                        <div className="flex text-sm text-text-secondary">
                            <p className="pl-1">Click to upload, or drag and drop</p>
                        </div>
                        <p className="text-xs text-text-secondary">PNG, JPG, WEBP</p>
                    </div>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                />
                 {formData.imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {formData.imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square group">
                                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border border-border-color" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Remove image"
                                >
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-medium">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputStyles} required />
                </div>
                 <div>
                    <label className="text-sm font-medium">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className={inputStyles} required />
                </div>
            </div>
            <div>
                <label className="text-sm font-medium">Tag</label>
                <select name="tag" value={formData.tag} onChange={handleChange} className={`${inputStyles} bg-surface`}>
                    <option>New Arrival</option>
                    <option>Best Seller</option>
                    <option>Limited Edition</option>
                    <option>Sale</option>
                </select>
            </div>
             <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="text-sm font-medium">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputStyles} required />
                </div>
                 <div>
                    <label className="text-sm font-medium">MRP (₹)</label>
                    <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className="text-sm font-medium">Discount</label>
                    <input type="text" name="discount" value={formData.discount} onChange={handleChange} className={inputStyles} placeholder="e.g. 50%" required />
                </div>
            </div>
            
            <fieldset className="border border-border-color p-4 rounded-md">
              <legend className="text-sm font-semibold px-2 text-text-primary">Specifications</legend>
              <div className="space-y-2">
                <div>
                    <label className="text-sm">Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="text-sm">Materials</label>
                    <input type="text" name="materials" value={formData.materials || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="text-sm">Dimensions</label>
                    <input type="text" name="dimensions" value={formData.dimensions || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="text-sm">Care Instructions</label>
                    <input type="text" name="careInstructions" value={formData.careInstructions || ''} onChange={handleChange} className={inputStyles} />
                </div>
              </div>
            </fieldset>

            <div className="flex items-center pt-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent bg-surface"/>
                    In Stock
                </label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border-color">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-black/10 dark:bg-white/10 text-text-primary rounded-md hover:bg-black/20 dark:hover:bg-white/20">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-accent text-surface rounded-md hover:bg-accent-hover disabled:opacity-70 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
    if ('id' in productData) {
      await updateProduct(productData as Product);
    } else {
      await addProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Manage Products</h1>
        <button onClick={handleAddProduct} className="bg-accent text-surface font-semibold px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors">
          + Add Product
        </button>
      </div>
      
      <div className="bg-surface rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border-color bg-surface/50">
            <tr>
              <th className="p-3 text-sm font-semibold text-text-secondary">Product</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Brand</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Category</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Price</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Stock</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-text-secondary">Loading products...</td></tr>
            ) : products.length > 0 ? (
                products.map(product => (
              <tr key={product.id} className="border-b border-border-color hover:bg-accent/5">
                <td className="p-3 text-sm flex items-center gap-3">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                    <span className="font-semibold text-text-primary">{product.name}</span>
                </td>
                <td className="p-3 text-sm text-text-secondary">{product.brand}</td>
                <td className="p-3 text-sm text-text-secondary">{product.category}</td>
                <td className="p-3 text-sm text-text-primary font-semibold">₹{product.price.toFixed(2)}</td>
                <td className="p-3 text-sm">
                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                   </span>
                </td>
                <td className="p-3 text-sm">
                    <button onClick={() => handleEditProduct(product)} className="text-text-secondary hover:text-accent p-2 rounded-md"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-text-secondary hover:text-red-500 p-2 rounded-md"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6}>
                        <AdminEmptyState
                            icon={<EmptyProductsIcon className="w-20 h-20 text-border-color" />}
                            title="No Products Yet"
                            description="Get started by adding your first product to the catalog."
                        >
                            <button onClick={handleAddProduct} className="mt-6 bg-accent text-surface font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover transition-colors">
                                + Add Your First Product
                            </button>
                        </AdminEmptyState>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductFormModal 
            product={editingProduct}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default AdminProducts;