import React, { useState, useRef, useMemo, useEffect } from 'react';
// FIX: Add side-effect import to ensure JSX namespace is correctly augmented.
import '../../types';
import { Product } from '../../types';
import { useProducts } from '../../contexts/ProductContext';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import CloseIcon from '../icons/CloseIcon';
import AdminEmptyState from './AdminEmptyState';
import EmptyProductsIcon from '../icons/EmptyProductsIcon';
import UploadIcon from '../icons/UploadIcon';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from './PaginationControls';
import SearchIcon from '../icons/SearchIcon';

const PRODUCTS_PER_PAGE = 5;

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
  materials: '', dimensions: '', careInstructions: '', rating: 4.5, reviewCount: 0,
  videoUrl: '', modelUrl: '',
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
  
  const inputStyles = "w-full mt-1 p-2 bg-background-start dark:bg-gray-800 border border-border-color rounded-md text-text-primary text-sm focus:ring-1 focus:ring-accent focus:border-accent";
  const labelStyles = "text-sm font-medium text-text-secondary";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-border-color">
          <h2 className="text-xl font-semibold text-text-primary">{'id' in formData && product && 'id' in product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-accent p-1 rounded-full transition-colors"><CloseIcon className="w-6 h-6"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-text-secondary">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelStyles}>Product Name</label>
                    <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
                </div>
                 <div>
                    <label htmlFor="brand" className={labelStyles}>Brand</label>
                    <input id="brand" type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputStyles} required />
                </div>
            </div>

            <div>
                <label htmlFor="description" className={labelStyles}>Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={inputStyles} rows={4} required></textarea>
            </div>
             <div>
                <label className={labelStyles}>Images</label>
                <div
                    className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-xl cursor-pointer hover:border-accent transition-colors bg-background-start dark:bg-gray-800/50"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); }}
                >
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-text-secondary/70" />
                        <p className="text-sm text-text-secondary">Click to upload, or <span className="font-semibold text-accent">drag and drop</span></p>
                        <p className="text-xs text-text-secondary/80">PNG, JPG, WEBP</p>
                    </div>
                </div>
                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden"/>
                 {formData.imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {formData.imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square group">
                                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-border-color" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-all" aria-label="Remove image">
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className={labelStyles}>Category</label>
                    <input id="category" type="text" name="category" value={formData.category} onChange={handleChange} className={inputStyles} required />
                </div>
                 <div>
                    <label htmlFor="tag" className={labelStyles}>Tag</label>
                    <select id="tag" name="tag" value={formData.tag} onChange={handleChange} className={`${inputStyles} bg-surface`}>
                        <option>New Arrival</option>
                        <option>Best Seller</option>
                        <option>Limited Edition</option>
                        <option>Sale</option>
                    </select>
                </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                    <label htmlFor="price" className={labelStyles}>Price (₹)</label>
                    <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} className={inputStyles} required />
                </div>
                 <div>
                    <label htmlFor="mrp" className={labelStyles}>MRP (₹)</label>
                    <input id="mrp" type="number" name="mrp" value={formData.mrp} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label htmlFor="discount" className={labelStyles}>Discount</label>
                    <input id="discount" type="text" name="discount" value={formData.discount} onChange={handleChange} className={inputStyles} placeholder="e.g. 50%" required />
                </div>
            </div>
            
             <div className="space-y-4 pt-4 border-t border-border-color">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="videoUrl" className={labelStyles}>Video URL (YouTube Embed)</label>
                        <input id="videoUrl" type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} className={inputStyles} placeholder="https://www.youtube.com/embed/..." />
                    </div>
                    <div>
                        <label htmlFor="modelUrl" className={labelStyles}>3D Model URL (.gltf)</label>
                        <input id="modelUrl" type="text" name="modelUrl" value={formData.modelUrl || ''} onChange={handleChange} className={inputStyles} />
                    </div>
                </div>
             </div>

            <div className="flex items-center pt-4 border-t border-border-color">
                <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-4 w-4 rounded border-border-color text-accent focus:ring-accent bg-surface"/>
                    Product is In Stock
                </label>
            </div>

            <div className="flex justify-end gap-4 pt-5 border-t border-border-color">
                <button type="button" onClick={onClose} className="px-5 py-2.5 bg-black/5 dark:bg-white/10 text-text-primary rounded-lg font-semibold text-sm hover:bg-black/10 dark:hover:bg-white/20">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-accent text-surface rounded-lg font-semibold text-sm hover:bg-accent-hover disabled:opacity-70 disabled:cursor-wait">
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const { currentPageData, currentPage, totalPages, setCurrentPage } = usePagination(filteredProducts, PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

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
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold font-heading text-text-primary">Manage Products</h1>
        <button onClick={handleAddProduct} className="bg-accent text-surface font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover transition-colors text-sm whitespace-nowrap">
          + Add Product
        </button>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border-color mb-6">
          <div className="relative">
              <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-transparent bg-transparent rounded-md focus:ring-0 focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
              </div>
          </div>
      </div>
      
      <div className="bg-surface rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[rgb(var(--color-admin-bg))] text-xs text-text-primary uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {loading ? (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-text-secondary">Loading products...</td></tr>
                ) : currentPageData.length > 0 ? (
                    // FIX: Explicitly type 'product' to resolve property access errors on 'unknown' type.
                    currentPageData.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-accent/5">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0"/>
                            <div>
                                <p className="font-semibold text-text-primary">{product.name}</p>
                                <p className="text-xs text-text-secondary">{product.brand}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{product.category}</td>
                    <td className="px-6 py-4 text-text-primary font-semibold">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditProduct(product)} className="text-text-secondary hover:text-accent p-2 rounded-md" aria-label={`Edit ${product.name}`}><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-text-secondary hover:text-red-500 p-2 rounded-md" aria-label={`Delete ${product.name}`}><DeleteIcon className="w-5 h-5"/></button>
                    </td>
                  </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>
                            <AdminEmptyState
                                icon={<EmptyProductsIcon className="w-20 h-20 text-border-color" />}
                                title="No Products Found"
                                description="Your search returned no results, or you haven't added any products yet."
                            />
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      
      {isModalOpen && (
          <ProductFormModal
            product={editingProduct || null}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
          />
      )}
    </div>
  );
};

export default AdminProducts;