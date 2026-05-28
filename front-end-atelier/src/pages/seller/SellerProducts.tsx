import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Sofa,
  Edit,
  Trash2,
  Plus,
  Star,
  Layers,
  Package,
  Tag,
} from "lucide-react";

export default function SellerProducts() {
  const { products, deleteProduct } = useApp();
  const navigate = useNavigate();

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete design catalog: ${name}?`,
      )
    ) {
      deleteProduct(id);
      alert("Design deleted from registry.");
    }
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-display font-light text-stone-950 tracking-tight">
            Artisan Catalog Registry
          </h1>
          <p className="text-xs text-stone-400">
            Add, edit, or discontinue premium workshop furniture models.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="w-full sm:w-auto px-5 py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add product</span>
        </Link>
      </div>

      {/* Products table grid */}
      <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
        {products.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-mono text-xs">
            No registered blueprints found in sandbox database.
          </div>
        ) : (
          <>
          <div className="md:hidden divide-y divide-stone-100">
            {products.map((p) => (
              <article key={p.id} className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-stone-50 border p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-950 leading-tight break-words">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-stone-450 font-mono font-normal uppercase mt-1">
                      ID: {p.id}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="bg-stone-100/90 text-stone-700 border border-stone-200/50 px-2.5 py-1 rounded font-mono text-[9px] uppercase">
                        {p.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone-950">
                        ${p.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 min-w-0">
                    <p className="text-[9px] font-mono uppercase font-bold text-stone-400">
                      Materials
                    </p>
                    <p className="mt-1 text-stone-700 font-light line-clamp-2">
                      {p.materials.join(", ")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
                    <p className="text-[9px] font-mono uppercase font-bold text-stone-400">
                      Chamber Score
                    </p>
                    <div className="mt-1 flex items-center gap-1 font-mono text-stone-800">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 stroke-[1.5]" />
                      <span className="font-bold">{p.rating.toFixed(1)}</span>
                      <span className="text-stone-300">({p.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                    className="py-2.5 border border-stone-200 rounded-xl text-stone-700 hover:text-stone-950 hover:border-stone-950 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center gap-2 text-[10px] font-mono uppercase font-bold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="py-2.5 border border-rose-200 rounded-xl text-rose-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-2 text-[10px] font-mono uppercase font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-500 font-sans min-w-[700px]">
              <thead className="text-[10px] font-mono uppercase text-stone-400 bg-stone-50 border-b border-stone-150">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Showroom Item
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Lumber / Materials
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Chamber Score
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    {/* Item photo name */}
                    <td className="px-6 py-4.5 flex items-center gap-4 font-sans text-stone-900 font-semibold">
                      <div className="w-12 h-12 rounded-xl bg-stone-50 border p-1 flex items-center justify-center shrink-0">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-stone-950 truncate max-w-[200px]">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-stone-450 font-mono font-normal uppercase">
                          ID: {p.id}
                        </p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4.5">
                      <span className="bg-stone-100/90 text-stone-700 border border-stone-200/50 px-2.5 py-1 rounded font-mono text-[9px] uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Sourced materials */}
                    <td className="px-6 py-4.5 max-w-[200px] truncate">
                      <p
                        className="text-stone-700 text-xs font-light truncate"
                        title={p.materials.join(", ")}
                      >
                        {p.materials.join(", ")}
                      </p>
                    </td>

                    {/* Pricing */}
                    <td className="px-6 py-4.5 font-mono text-sm font-semibold text-stone-900">
                      ${p.price.toLocaleString()}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1 font-mono text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 stroke-[1.5]" />
                        <span className="font-bold">{p.rating.toFixed(1)}</span>
                        <span className="text-stone-300">
                          ({p.reviewCount})
                        </span>
                      </div>
                    </td>

                    {/* Edit Delete buttons */}
                    <td className="px-6 py-4.5 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/seller/products/${p.id}/edit`)
                          }
                          className="p-2 border border-stone-200 rounded-lg text-stone-500 hover:text-stone-950 hover:border-stone-950 hover:bg-white transition-all cursor-pointer"
                          title="Edit Blueprint specs"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 border border-stone-200 rounded-lg text-rose-500 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete product listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
