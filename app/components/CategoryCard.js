'use client';

/**
 * CategoryCard Component
 * 
 * Single category card with icon, name, and product count.
 * 
 * Props:
 *   - name: Category name
 *   - count: Number of products in category
 *   - icon: Icon emoji or Unicode
 *   - onClick: Callback when clicked
 */

export default function CategoryCard({
  name = 'Category',
  count = 0,
  icon = '📦',
  onClick = () => {},
}) {
  return (
    <div className="category-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="category-icon">{icon}</div>
      <h3 className="category-name">{name}</h3>
      <p className="category-count">{count} products</p>
    </div>
  );
}
