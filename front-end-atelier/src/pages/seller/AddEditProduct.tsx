import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ChevronLeft, Plus, Trash2, ShieldCheck, Milestone, PackagePlus } from 'lucide-react';

export default function AddEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useApp();

  const isEdit = Boolean(id);
  const existingProduct = products.find(p => p.id === id);

  // Form Fields State
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1500);
  const [category, setCategory] = useState<Product['category']>('living-room');
  
  // Arrays items (we starts with defaults and can modify them or add arrays)
  const [materialInput, setMaterialInput] = useState('');
  const [materials, setMaterials] = useState<string[]>([]);
  
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#624A32');
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Details
  const [detailMaterial, setDetailMaterial] = useState('');
  const [detailDimensions, setDetailDimensions] = useState('W 100cm x D 100cm x H 75cm');
  const [detailCare, setDetailCare] = useState('Wipe with dry microfiber cloth.');
  const [detailOrigin, setDetailOrigin] = useState('Milan, Italy');
  const [detailWeightLimit, setDetailWeightLimit] = useState('150 kg');
  const [detailDesigner, setDetailDesigner] = useState('Artisan Co-Op Studio');
  const [detailWoodGrade, setDetailWoodGrade] = useState('Grade A Oak Wood');

  // Load existing data if editing
  useEffect(() => {
    if (isEdit && existingProduct) {
      setName(existingProduct.name);
      setShortDescription(existingProduct.shortDescription);
      setDescription(existingProduct.description);
      setPrice(existingProduct.price);
      setCategory(existingProduct.category);
      setMaterials(existingProduct.materials);
      setColors(existingProduct.colors);
      setImages(existingProduct.images);
      
      const { details } = existingProduct;
      setDetailMaterial(details.material);
      setDetailDimensions(details.dimensions);
      setDetailCare(details.careInstructions);
      setDetailOrigin(details.origin);
      setDetailWeightLimit(details.weightLimit || '150 kg');
      setDetailDesigner(details.designer);
      setDetailWoodGrade(details.woodGrade || 'Grade A Solid Wood');
    } else {
      // Setup some default lists for new entries
      setMaterials(['Solid European Oak', 'FSC Polyurethane Sealant']);
      setColors([{ name: 'Natural Sand Oak', hex: '#EAE5D9' }]);
      setImages(['https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80']);
      setDetailMaterial('100% Solid European Oak');
    }
  }, [isEdit, existingProduct]);

  // Fast array manipulation helpers
  const handleAddMaterial = () => {
    if (materialInput.trim() && !materials.includes(materialInput.trim())) {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const handleAddColor = () => {
    if (colorName.trim() && !colors.some(c => c.name === colorName.trim())) {
      setColors([...colors, { name: colorName.trim(), hex: colorHex }]);
      setColorName('');
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (materials.length === 0 || colors.length === 0 || images.length === 0) {
      alert('Please include at least 1 Sourced Material, 1 Shader, and 1 Image URL asset.');
      return;
    }

    const compiledProduct: Product = {
      id: isEdit && existingProduct ? existingProduct.id : `prd-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      name,
      shortDescription,
      description,
      price,
      rating: isEdit && existingProduct ? existingProduct.rating : 5.0,
      reviewCount: isEdit && existingProduct ? existingProduct.reviewCount : 1,
      category,
      materials,
      colors,
      images,
      threeSixtyImages: isEdit && existingProduct ? existingProduct.threeSixtyImages : [
        images[0],
        images[0],
        images[0],
        images[0],
        images[0]
      ],
      details: {
        material: detailMaterial,
        dimensions: detailDimensions,
        careInstructions: detailCare,
        origin: detailOrigin,
        weightLimit: detailWeightLimit,
        designer: detailDesigner,
        woodGrade: detailWoodGrade
      },
      sellerId: 'studio-nord', // default sandbox brand
      isFeatured: isEdit && existingProduct ? existingProduct.isFeatured : false
    };

    if (isEdit) {
      updateProduct(compiledProduct);
      alert(`Success! Catalog revised: ${name}`);
    } else {
      addProduct(compiledProduct);
      alert(`Success! Launched new architectural blueprint: ${name}`);
    }
    navigate('/seller/products');
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-8 max-w-4xl">
      
      {/* Navigation back */}
      <button 
        onClick={() => navigate('/seller/products')}
        className="inline-flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-950 uppercase cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Catalog List</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">
          {isEdit ? 'Revise Design Blueprint' : 'Launch New Architectural Blueprint'}
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Complete structural coordinate definitions, wood grade metrics, and design provenance to list this item.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left column Form parameters */}
        <div className="md:col-span-2 bg-white border border-stone-200 p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-mono text-[#B39D69] uppercase font-bold tracking-wider">General Information</h3>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-stone-500 uppercase">Product Design Name</label>
            <input 
              required
              type="text" 
              placeholder="Pierre Bouclé Curved Sofa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Department Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              >
                <option value="living-room">Living Room</option>
                <option value="dining">Dining & Cabinetry</option>
                <option value="bedroom">Bedroom</option>
                <option value="office">Workspace / Cabinet</option>
                <option value="lighting">Architectural Lighting</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Unit Price ($ USD)</label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-stone-500 uppercase">Catchy Short Summary</label>
            <input 
              required
              type="text" 
              placeholder="Minimalist masterwork sculptured from a single source of FSC-certified European Oak."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-stone-500 uppercase">Immersive Narrative Backstory</label>
            <textarea 
              required
              rows={4}
              placeholder="The Pierre Curved Sofa represents architectural purism at its zenith..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 p-4 border border-stone-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <h3 className="text-xs font-mono text-[#B39D69] uppercase font-bold tracking-wider pt-4 border-t border-stone-100">Dimensional & Technical Specifications</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Exact Material Core</label>
              <input 
                required
                type="text" 
                placeholder="100% Solid European Oak"
                value={detailMaterial}
                onChange={(e) => setDetailMaterial(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Wood Grade / Class</label>
              <input 
                type="text" 
                placeholder="Grade A Premium Oak (Zero knots)"
                value={detailWoodGrade}
                onChange={(e) => setDetailWoodGrade(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Span Dimensions</label>
              <input 
                required
                type="text" 
                placeholder="W 240cm x D 100cm x H 75cm"
                value={detailDimensions}
                onChange={(e) => setDetailDimensions(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Weight load limit</label>
              <input 
                type="text" 
                placeholder="180 kg"
                value={detailWeightLimit}
                onChange={(e) => setDetailWeightLimit(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Signature Designer</label>
              <input 
                required
                type="text" 
                placeholder="Harald Thorsen, Studio Nord"
                value={detailDesigner}
                onChange={(e) => setDetailDesigner(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-stone-500 uppercase">Origin Workshop location</label>
              <input 
                required
                type="text" 
                placeholder="Florence, Italy"
                value={detailOrigin}
                onChange={(e) => setDetailOrigin(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-stone-500 uppercase">Preservation & Care Instructions</label>
            <input 
              required
              type="text" 
              placeholder="Wipe with soft microfiber cloth. Avoid damp exposure."
              value={detailCare}
              onChange={(e) => setDetailCare(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

        </div>

        {/* Right column dynamic list items */}
        <div className="md:col-span-1 space-y-6">
          
          {/* materials list creator */}
          <div className="bg-white p-6 border border-stone-200 rounded-3xl space-y-4">
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase">Sourced Materials</h4>
            
            <div className="flex gap-2.5">
              <input 
                type="text"
                placeholder="E.g., Anodized Brass"
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
              <button 
                type="button"
                onClick={handleAddMaterial}
                className="p-2.5 bg-[#c2ab77] text-white rounded-xl"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {materials.map((m, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-150 px-2.5 py-1 rounded-full text-[10px] font-mono text-stone-600">
                  <span>{m}</span>
                  <button 
                    type="button" 
                    onClick={() => setMaterials(materials.filter(item => item !== m))}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* shade shader colors list creator */}
          <div className="bg-white p-6 border border-stone-200 rounded-3xl space-y-4">
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-[#B39D69] uppercase">Timber Shades</h4>
            
            <div className="space-y-3.5">
              <div className="flex gap-2 text-xs">
                <input 
                  type="text"
                  placeholder="Shade Name"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
                <input 
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
              </div>
              <button 
                type="button"
                onClick={handleAddColor}
                className="w-full py-2 bg-stone-950 text-white text-[10px] font-mono uppercase tracking-wider rounded-lg font-bold"
              >
                Add Shade
              </button>
            </div>

            <div className="space-y-2">
              {colors.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center bg-stone-50 p-2 border border-stone-150 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                    <span className="font-medium text-stone-900">{c.name}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setColors(colors.filter(item => item.name !== c.name))}
                    className="text-stone-400 hover:text-rose-600 text-sm font-bold px-1.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* image assets urls creator */}
          <div className="bg-white p-6 border border-stone-200 rounded-3xl space-y-4">
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-stone-400 uppercase">Imaging Assets</h4>
            
            <div className="space-y-2">
              <p className="text-[11px] text-stone-400 font-light leading-normal">Input high-definition photography URLs (e.g. Unsplash images).</p>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={handleAddImage}
                  className="p-2.5 bg-[#c2ab77] text-white rounded-xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-stone-50 border border-stone-100/50 rounded-lg text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[9px] text-stone-300">#{idx+1}</span>
                    <a href={img} target="_blank" rel="noreferrer" className="text-stone-500 hover:underline hover:text-stone-900 truncate max-w-[140px]">
                      {img}
                    </a>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setImages(images.filter(item => item !== img))}
                    className="text-stone-400 hover:text-rose-600 text-sm font-bold px-1.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <button
            type="submit"
            className="w-full h-13 bg-stone-950 hover:bg-stone-900 text-white rounded-xl font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <PackagePlus className="w-4 h-4" />
            <span>{isEdit ? 'Re-lock Blueprint' : 'Enregister Blueprint'}</span>
          </button>

        </div>

      </form>

    </div>
  );
}
