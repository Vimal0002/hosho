'use client';

import CategoryCard from './CategoryCard';

/**
 * Categories Component
 * 
 * Section displaying product categories in a responsive grid.
 * 
 * Props:
 *   - title: Section title
 *   - subtitle: Section subtitle
 *   - categories: Array of category objects
 *   - onCategoryClick: Callback when category is clicked
 */

export default function Categories({
  title = 'Shop by Category',
  subtitle = 'Browse our wide selection of products',
  categories = [],
  onCategoryClick = () => {},
}) {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="section-content">
        {/* Header */}
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        {/* Categories Grid */}
        <div className="grid grid-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id || index}
              name={category.name}
              count={category.count}
              icon={category.icon}
              onClick={() => onCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
